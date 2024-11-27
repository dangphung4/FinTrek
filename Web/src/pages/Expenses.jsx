// src/pages/Expenses.jsx
import React, {useEffect, useState} from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, Button, Flex, Icon, Text, SimpleGrid, Stack, HStack, Grid } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { FaPlus, FaFilter, FaDownload } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/DashboardCard';
import supabase from '../supabaseClient';

const fakeExpenses = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  date: faker.date.recent().toLocaleDateString(),
  description: faker.commerce.productName(),
  category: faker.helpers.arrayElement(['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping']),
  amount: faker.number.int({ min: 10, max: 500 }),
}));

const sbAccessToken = localStorage.getItem('sb_access_token');
const { data: { user } } = await supabase.auth.getUser()
const userID = user?.id || '';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [limit, setLimit] = useState(10);
  useEffect(() =>{
    const getExpensesCall = async () => {
      const response = await fetch("http://localhost:8080/api/get_expenses",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userID, sbAccessToken, limit }),
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

      function isValidJson(obj) {
        try {
          JSON.parse(obj);
          return true;
        } catch (e) {
          return false;
        }
      }

      const categoryParse = (category) => isValidJson(category) ? JSON.parse(category)[0] : category[0];
      

      const transformedExpenses = data.latest_transactions.map((transaction) => ({
        id: transaction.transaction_id,
        description: transaction.merchant_name ? transaction.merchant_name : transaction.name,
        amount: `${transaction.amount.toFixed(2)} ${transaction.iso_currency_code}`,
        date: transaction.date,
        category: categoryParse(transaction.category), // Include the category from the data
        account: accountMap[transaction.account_id],
      }));
  
      setExpenses(transformedExpenses);
    }
    getExpensesCall();
  },[]);

  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box width="100%" >
      <PageHeader title="Expenses" />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Expenses"
          value={`$${faker.number.int({ min: 1000, max: 5000 })}`}
          change="9.05%"
          isIncrease={false}
          icon={FaDownload}
        />
        <DashboardCard
          title="Largest Expense"
          value={`$${faker.number.int({ min: 100, max: 1000 })}`}
          change="Food & Dining"
          isIncrease={false}
          icon={FaFilter}
        />
        <DashboardCard
          title="Average Daily Spend"
          value={`$${faker.number.int({ min: 20, max: 200 })}`}
          change="12.3%"
          isIncrease={true}
          icon={FaDownload}
        />
      </SimpleGrid>
      <Box display={{base:'none',xs:'block'}} bg={bgColor} p={6} borderRadius="lg" boxShadow="sm" overflowX="auto">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Expense List</Text>
          <Flex>
            <Button leftIcon={<FaFilter />} variant="outline" mr={2}>Filter</Button>
            <Button leftIcon={<FaPlus />} colorScheme="blue">Add Expense</Button>
          </Flex>
        </Flex>
        <Table variant="simple" size = {{base: 'sm',sm: 'md'}}>
          <Thead>
            <Tr>
              <Th>Account</Th>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Category</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.map((expense) => (
              <Tr key={expense.id}>
                <Td>{expense.account}</Td>
                <Td>{expense.date}</Td>
                <Td>{expense.description}</Td>
                <Td>{expense.category}</Td>
                <Td isNumeric>${expense.amount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {/* below 535w use cards instead of table */}
      <Box display={{base:'block',xs:'none'}} mt = {6} bg={bgColor} p={4} borderRadius="lg" boxShadow="sm" overflowX="auto">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Expense List</Text>
          <Flex>
            <Stack>
              <Button display = {{base:'block',xxxs:'none'}} size={{base:'sm',xxxs:'md'}} leftIcon={<FaFilter />} variant="outline" maxWidth={{base:'125px',megasmall:'none'}} mr={2}>Filter</Button>
              <Button display = {{base:'block',xxxs:'none'}} size={{base:'sm',xxxs:'md'}} leftIcon={<FaPlus />} colorScheme="blue" maxWidth={{base:'125px',megasmall:'none'}} mr={2}>Add Expense</Button>
            </Stack>
            <Button display = {{base:'none',xxxs:'flex'}} leftIcon={<FaFilter />} variant="outline" mr={2}>Filter</Button>
            <Button display = {{base:'none',xxxs:'flex'}} leftIcon={<FaPlus />} colorScheme="blue">Add Expense</Button>
          </Flex>
        </Flex>
        <SimpleGrid columns={1} spacing={6}>
          {expenses.map((expense) => (
            <Box key={expense.id} p={1} borderRadius="sm" borderWidth="3px" boxShadow="sm" bg={bgColor}>
              <Stack spacing={2}>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="bold">Account:</Text>
                  <Text fontSize="sm">{expense.account}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="bold">Date:</Text>
                  <Text fontSize="sm">{expense.date}</Text>
                </HStack>
                <Grid templateColumns="auto 1fr" alignItems="center" gap={2}>
                  <Text fontSize="sm" fontWeight="bold">Description:</Text>
                  <Text fontSize="sm" textAlign="right" wordBreak="break-word">{expense.description}</Text>
                </Grid>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="bold">Category:</Text>
                  <Text fontSize="sm">{expense.category}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="bold">Amount:</Text>
                  <Text fontSize="sm" isNumeric>${expense.amount}</Text>
                </HStack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Expenses;