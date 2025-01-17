// src/pages/Expenses.jsx
import React, {useEffect, useState, useContext, useMemo} from 'react';
import { Box as ChakraBox, Table as ChakraTable, Thead as ChakraThead, Tbody as ChakraTbody, Tr as ChakraTr, Th as ChakraTh, Td as ChakraTd, useColorModeValue as ChakraUseColorModeValue, Button as ChakraButton, Flex as ChakraFlex, Icon as ChakraIcon, Text as ChakraText, SimpleGrid as ChakraSimpleGrid, Stack as ChakraStack, HStack as ChakraHStack, Grid as ChakraGrid } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { FaPlus, FaFilter, FaDownload, FaSort } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/DashboardCard';
import supabase from '../supabaseClient';
import Context from '../context'
import TransactionsTable from '../components/TransactionsTable';

function Expenses() {
  //reloading variable 
  const [reload, setReload] = useState(false);

  const { state: { institutionsLinked } } = useContext(Context);
  const [expenses, setExpenses] = useState([]);
  const [orderBy, setOrderBy] = useState(() => {
    const savedSortState = localStorage.getItem('sortState');
    return savedSortState ? JSON.parse(savedSortState).orderBy : 'date';
  });
  
  const [order, setOrder] = useState(() => {
    const savedSortState = localStorage.getItem('sortState');
    return savedSortState ? JSON.parse(savedSortState).order : 'desc';
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  //Values for dashboard cards about expense details
  const [dateRange, setDateRange] = useState('');
  const [largestExpense, setLargestExpense] = useState(0.00);
  const [largestExpenseCategory, setLargestExpenseCategory] = useState('Loading...');
  const [totalExpenses, setTotalExpenses] = useState(0.00);
  const [avgDailySpend, setAvgDailySpend] = useState(0.00);

  // Filter states
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  const [dateFilter, setDateFilter] = useState([null, null]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // unique accounts and categories (for use in filtering by accounts/categories)
  const [uniqueAccounts, setUniqueAccounts] = useState([]);
  const [uniqueUnlinkedAccounts, setUniqueUnlinkedAccounts] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  //pagination stuff
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPageOptionsArr, setRowsPerPageOptionsArr] = useState(() => {
    const storedArray = JSON.parse(localStorage.getItem('customRowsPerPage')) || [];
    const combinedArray = [...new Set([10, 20, 30, 60, ...storedArray])];
    return combinedArray.sort((a, b) => a - b);
  });


  const triggerReload = () => {
    // Toggle reload state to trigger re-render
    setReload(prev => !prev);
  };

  const formatDateToMMDDYYYY = (inputDate) => {
    const date = new Date(inputDate);
    if (Number.isNaN(date.getTime())) {
      console.error(`Invalid date provided: ${inputDate}`);
      return inputDate; // Return the original date if it's invalid
    }
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Use UTC method
    const day = String(date.getUTCDate()).padStart(2, '0'); // Use UTC method
    const year = date.getUTCFullYear(); // Use UTC method
    return `${month}/${day}/${year}`;
  };
  

  function isValidJson(obj) {
    try {
      JSON.parse(obj);
      return true;
    } catch (e) {
      return false;
    }
  } 

  const JSONParse = (maybeJSON) => {
    if (!maybeJSON){
      return "Unspecified";
    }
    return isValidJson(maybeJSON) ? JSON.parse(maybeJSON)[0] : maybeJSON[0]
  };

  useEffect(() =>{
    const getExpensesCall = async () => {
      const sbAccessToken = localStorage.getItem('sb_access_token');
      const { data: { user } } = await supabase.auth.getUser()
      const userID = user?.id || '';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_expenses`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userID, sbAccessToken }),//look to remove limit and endDate after reworking endpoint slightly
      })
      if (!response.ok) {
        console.log("response failed fetching at get expenses endpoint")
        return;
      }
      const data = await response.json();

      const accountMap = data.accounts.reduce((acc, account) => {
        acc[account.account_id] = account.name;
        return acc;
      }, {});     

      const transformedExpenses = data.latest_transactions.map((transaction) => ({
        id: transaction.transaction_id,
        description: transaction.merchant_name ? transaction.merchant_name : transaction.name,
        amount: `${transaction.amount.toFixed(2)} ${transaction.iso_currency_code}`,
        date: transaction.date,
        category: JSONParse(transaction.category), // Include the category from the data
        account: transaction.account_id ? accountMap[transaction.account_id] : 'Cash',
        account_id: transaction.account_id,
        plaid: transaction.plaid,
      }));
  
      setExpenses(transformedExpenses);

      // Extract unique accounts and categories
      const accounts = [...new Set(transformedExpenses.map(txn => txn.account))];
      const unlinkedAccounts = [...new Set(data.accounts.filter(account => !account.plaid).map(acc => ({account: acc.name, account_id: acc.account_id})))];
      const categories = [...new Set(transformedExpenses.map(txn => txn.category))];

      setUniqueAccounts(accounts);
      setUniqueUnlinkedAccounts(unlinkedAccounts);
      setUniqueCategories(categories);
    }
    getExpensesCall();
  },[institutionsLinked, reload]);

  // Sorting handler
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    // Save sort state to localStorage
    localStorage.setItem('sortState', JSON.stringify({ orderBy: property, order: isAsc ? 'desc' : 'asc' }));
  };

  // Filtering logic
  const filteredExpenses = expenses.filter(expense => {
    // Amount filter
    const meetsAmountCriteria = 
      (!amountFilter.min || parseFloat(expense.amount) >= parseFloat(amountFilter.min)) &&
      (!amountFilter.max || parseFloat(expense.amount) <= parseFloat(amountFilter.max));

    // Date filter
    const expenseDate = new Date(expense.date); // Create a Date object
    //expenseDate.setDate(expenseDate.getDate() - 1); // Subtract one day


    const meetDateCriteria = 
      (!dateFilter[0] || expenseDate >= new Date(new Date(dateFilter[0]).setDate(new Date(dateFilter[0]).getDate() - 1))) &&
      (!dateFilter[1] || expenseDate <= dateFilter[1]);

    // Account filter
    const meetsAccountCriteria = 
      selectedAccounts.length === 0 || 
      selectedAccounts.includes(expense.account);

    // Category filter
    const meetsCategoryCriteria = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(expense.category);

    return meetsAmountCriteria && 
          meetDateCriteria && 
          meetsAccountCriteria && 
          meetsCategoryCriteria;
  });

  // Sorting function
  const sortedExpenses = filteredExpenses.sort((a, b) => {
    const getValue = (expense) => {
      switch(orderBy) {
        case 'amount': return parseFloat(expense.amount);;
        case 'date': return expense.date;
        case 'description': return expense.description;
        case 'category': return expense.category;
        case 'account': return expense.account;
        default: return expense.date;
      }
    };

    const multiplier = order === 'asc' ? 1 : -1;
    const valueA = getValue(a);
    const valueB = getValue(b);

    return valueA < valueB ? -1 * multiplier : 
          valueA > valueB ? 1 * multiplier : 
          0;
  });

  // Reset filters
  const resetFilters = () => {
    setAmountFilter({ min: '', max: '' });
    setDateFilter([null, null]);
    setSelectedAccounts([]);
    setSelectedCategories([]);
  };

  //pagination functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //make visible rows based on pagination
  const visibleRows = useMemo(
    () =>
      [...sortedExpenses].map(txn => ({ ...txn, date: formatDateToMMDDYYYY(txn.date) }))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, sortedExpenses],
  );

  // use setLargestExpense, setTotalExpenses, and setAvgDailySpend, to set those values calculating them based on the visibleRows. So get the largest expense in the visible rows, the average daily spend, and total expenses and set their values. 
  const updateTransactionStats = async () => {
      try {
          const sbAccessToken = localStorage.getItem('sb_access_token');
          const { data: { user } } = await supabase.auth.getUser()
          const userID = user?.id || '';
          const response = await fetch(`${import.meta.env.VITE_API_URL}/get_txn_stats`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  transactions: visibleRows,
                  sbAccessToken: sbAccessToken, // You'll need to pass this from your auth context
                  userID: userID
              }),
          });

          if (!response.ok) {
              throw new Error('Failed to fetch transaction stats');
          }

          const stats = await response.json();
          
          // Update your state values
          setLargestExpense(stats.largestExpenseAmount.toFixed(2));
          setLargestExpenseCategory(stats.largestExpenseTransaction.category)
          setTotalExpenses(stats.totalExpenses.toFixed(2));
          setAvgDailySpend(stats.avgDailySpend.toFixed(2));
          setDateRange(`${formatDateToMMDDYYYY(stats.dateRange.start.slice(0, 10))} to ${formatDateToMMDDYYYY(stats.dateRange.end.slice(0, 10))}`);
      } catch (error) {
          console.error('Error updating transaction stats:', error);
          // Handle error appropriately
      }
  };

  const onAddExpense = async (expenseData) => {
    const sbAccessToken = localStorage.getItem('sb_access_token');
    const { data: { user } } = await supabase.auth.getUser()
    const userID = user?.id || '';
    const response = await fetch(`${import.meta.env.VITE_API_URL}/add_expense`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userID, sbAccessToken, expenseData }),
    })
    if (!response.ok) {
      console.log("response failed fetching at add expense endpoint")
      return;
    }else{
      console.log("response from adding expense was: ",response.json())
    }
    triggerReload();
  }

  const handleDeleteTransaction = async (transaction_id) => {
    const sbAccessToken = localStorage.getItem('sb_access_token');
    const { data: { user } } = await supabase.auth.getUser()
    const userID = user?.id || '';
    const response = await fetch(`${import.meta.env.VITE_API_URL}/delete_expense`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userID, sbAccessToken, transaction_id }),
    })
    if (!response.ok) {
      console.log("response failed fetching at delete expense endpoint")
      return;
    }else{
      console.log("response from deleting expense was: ",response.json())
    }
    triggerReload();
  }

  useEffect(() => {
    updateTransactionStats();
  }, [visibleRows]);

  const bgColor = ChakraUseColorModeValue('white', 'gray.700');

  return (
    <ChakraBox width="100%">
      <PageHeader title="Expenses" />
      <ChakraText fontSize="12px" mb={4} textAlign={'center'}>{dateRange}</ChakraText>
      <ChakraSimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Expenses"
          //value={`$${faker.number.int({ min: 1000, max: 5000 })}`}
          value = {totalExpenses}
          change="9.05%"
          isIncrease={false}
        />
        <DashboardCard
          title="Largest Expense"
          //value={`$${faker.number.int({ min: 100, max: 1000 })}`}
          value = {largestExpense}
          change= {largestExpenseCategory}
          isIncrease={false}
        />
        <DashboardCard
          title="Average Daily Spend"
          //value={`$${faker.number.int({ min: 20, max: 200 })}`}
          value = {avgDailySpend}
          change="12.3%"
          isIncrease={true}
        />
      </ChakraSimpleGrid>

      {/* MUI table */}
      <TransactionsTable
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        uniqueAccounts={uniqueAccounts}
        uniqueUnlinkedAccounts={uniqueUnlinkedAccounts}
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
        uniqueCategories={uniqueCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        resetFilters={resetFilters}
        orderBy={orderBy}
        order={order}
        visibleRows={visibleRows}
        handleSort={handleSort}
        rowsPerPageOptionsArr={rowsPerPageOptionsArr}
        sortedExpenses={sortedExpenses}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        setRowsPerPageOptionsArr={setRowsPerPageOptionsArr}
        onAddExpense={onAddExpense}
        handleDeleteTransaction={handleDeleteTransaction}
      />
    </ChakraBox>
  );
}

export default Expenses;