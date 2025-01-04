import { useState } from 'react';
import { 
    Box as MUIBox, 
    Typography as MUITypography, 
    Button as MUIButton, 
    Table as MUITable, 
    TableBody as MUITableBody, 
    TableCell as MUITableCell, 
    TableContainer as MUITableContainer, 
    TableHead as MUITableHead, 
    TableRow as MUITableRow, 
    TableSortLabel as MUITableSortLabel,
    ThemeProvider,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import muiTheme from '../muiTheme';
import { useThemeContext } from '../context/themeContext'; 
import { FaPlus, FaFilter, FaSort } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";


import TransactionFilterDrawer from './TransactionFilterDrawer';
import CustomTablePagination from './CustomTablePagination';
import AddExpenseDialog from './AddExpenseDialog';

const TransactionCard = ({ expense, themeMode }) => {
    const fields = [
        { label: 'Date', value: expense.date },
        { label: 'Description', value: expense.description },
        { label: 'Category', value: expense.category },
        { label: 'Account', value: expense.account },
        { label: 'Amount', value: `$${expense.amount}` },
    ];

    return (
        <Card 
            sx={{ 
                mb: 2,
                bgcolor: themeMode === 'dark' ? '#202731' : '#fff',
                width: '100%',
            }}
        >
            <CardContent>
                <Stack spacing={1}>
                    {fields.map(({ label, value }) => (
                        <MUIBox 
                            key={label}
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                        >
                            <MUITypography 
                                variant="body2" 
                                color="text.primary"
                                fontWeight={500}
                            >
                                {label}:
                            </MUITypography>
                            <MUITypography variant="body2" color="text.primary">
                                {value}
                            </MUITypography>
                        </MUIBox>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default function TransactionsTable({
    filterDrawerOpen,   //start props for (mostly) filter drawer
    setFilterDrawerOpen,    //(used for filter drawer as well as table)
    amountFilter,
    setAmountFilter,
    dateFilter,
    setDateFilter,
    uniqueAccounts,
    uniqueUnlinkedAccounts,
    selectedAccounts,
    setSelectedAccounts,
    uniqueCategories,
    selectedCategories,
    setSelectedCategories,
    resetFilters,   //end props for (mostly) filter drawer
    orderBy,    //start props for table
    order,
    visibleRows,
    handleSort,
    rowsPerPageOptionsArr,  //start props for table pagination
    sortedExpenses,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    setRowsPerPageOptionsArr,    //end props for table pagination / table
    onAddExpense,
    handleDeleteTransaction
}){
    //using context to get themeMode to use proper mui theme
    const { themeMode } = useThemeContext();
    const muiThemeModed = muiTheme(themeMode);

    const boxBgColor = themeMode === 'dark' ? '#2d3748' : '#fff'

    const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);


    return (
        <ThemeProvider theme={muiThemeModed}>
            <MUIBox bgcolor={boxBgColor} borderRadius='5px' p={2}>
                <MUIBox display="flex" justifyContent="space-between" mb={2}>
                    <MUITypography variant="h4" fontSize={14} fontWeight={700} mt={'2px'}>Transactions</MUITypography>
                    <MUIBox>
                    <MUIButton 
                        startIcon={<FaFilter />} 
                        variant="contained"
                        size='small'
                        sx={{ mr: 2 }}
                        onClick={() => setFilterDrawerOpen(true)}
                    >
                        Filter
                    </MUIButton>
                    <MUIButton 
                        startIcon={<FaPlus />} 
                        variant="contained"
                        size='small' 
                        color="primary"
                        onClick={() => setAddExpenseDialogOpen(true)}
                    >
                        Add Expense
                    </MUIButton>
                    </MUIBox>
                </MUIBox>

                <AddExpenseDialog
                    open={addExpenseDialogOpen}
                    onClose={() => setAddExpenseDialogOpen(false)}
                    handleAddExpense={(expenseData) => {
                        // Pass the expense data up to parent component
                        onAddExpense(expenseData);
                    }}
                    uniqueUnlinkedAccounts={uniqueUnlinkedAccounts}
                />

                <TransactionFilterDrawer
                    filterDrawerOpen={filterDrawerOpen}
                    setFilterDrawerOpen={setFilterDrawerOpen}
                    amountFilter={amountFilter}
                    setAmountFilter={setAmountFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    uniqueAccounts={uniqueAccounts}
                    selectedAccounts={selectedAccounts}
                    setSelectedAccounts={setSelectedAccounts}
                    uniqueCategories={uniqueCategories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    resetFilters={resetFilters}
                />
                <CustomTablePagination
                        rowsPerPageOptions={rowsPerPageOptionsArr}
                        count={sortedExpenses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        setRowsPerPageOptionsArr={setRowsPerPageOptionsArr}
                />
                <MUIBox 
                    sx={{ 
                        display: { xs: 'none', md_3: 'block' }
                    }}
                >
                    <MUITableContainer component = 'div' >
                        <MUITable >
                        <MUITableHead>
                            <MUITableRow>
                            {['Date', 'Description', 'Category', 'Account', 'Amount'].map((header) => (
                                <MUITableCell key={header} sx={{ textAlign: {xs: 'start' ,md_2: 'center'}, pl: 0, pr:0}}>
                                <MUITableSortLabel
                                    active={orderBy === header.toLowerCase()}
                                    direction={orderBy === header.toLowerCase() ? order : 'asc'}
                                    onClick={() => handleSort(header.toLowerCase())}
                                    sx={{
                                        fontSize: 11,
                                        pl: '22px',
                                        '&:hover': {
                                            color: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Change hover background color (light gray in dark mode)
                                        },
                                        '& .MuiTableSortLabel-icon': {
                                            color: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Color of up/down icon (can be customized)
                                        },
                                        '.MuiSvgIcon-root': {
                                            fill: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Color of up/down icon (can be customized)
                                        },
                                    }}
                                >
                                    {header}
                                </MUITableSortLabel>
                                </MUITableCell>
                            ))}
                            </MUITableRow>
                        </MUITableHead>
                        <MUITableBody>
                        {visibleRows.map((expense) => (
                            <MUITableRow key={expense.id}>
                                <MUITableCell sx={{ textAlign: {xs: 'start' ,md_2: 'center'} }}>{expense.date}</MUITableCell>
                                <MUITableCell sx={{ textAlign: {xs: 'start' ,md_2: 'center'} }}>{expense.description}</MUITableCell>
                                <MUITableCell sx={{ textAlign: {xs: 'start' ,md_2: 'center'} }}>{expense.category}</MUITableCell>
                                <MUITableCell sx={{ textAlign: {xs: 'start' ,md_2: 'center'} }}>{expense.account}</MUITableCell>
                                <MUITableCell sx={{ position: 'relative', textAlign: {xs: 'start' ,md_2: 'center'} }}>
                                    ${expense.amount}
                                    {!expense.plaid && (
                                        <MUIButton
                                            onClick={() => handleDeleteTransaction(expense.id)}
                                            startIcon={<MdDelete />}
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                backgroundColor: 'transparent',
                                                color: themeMode === 'dark' ? '#fff' : '#000',
                                                width: '30px',
                                                minWidth: '20px',
                                                padding: 0,
                                                margin: 0,
                                                position: 'absolute', // Makes the button independent of content flow
                                                right: '2px', // Adjust this value to fine-tune the distance from the right edge
                                                top: '50%', // Vertically centers the button
                                                transform: 'translateY(-50%)', // Centers button vertically relative to the cell
                                                '& .MuiButton-startIcon': {
                                                    margin: 0,
                                                },
                                                '&:hover':{
                                                    color: themeMode === 'dark' ? '#212731' : '#fff'
                                                }
                                            }}
                                        />
                                    )}
                                </MUITableCell>
                            </MUITableRow>
                        ))}
                        </MUITableBody>
                        </MUITable>
                    </MUITableContainer>
                </MUIBox>
                <MUIBox 
                    sx={{ 
                        display: { xs: 'block', md_3: 'none' }
                    }}
                >
                    {/* Sort headers for mobile */}
                    <MUITableContainer component='div' sx={{ mb: 2 }}>
                        <MUITable>
                            <MUITableHead>
                                <MUITableRow>
                                {['Date', 'Description', 'Category', 'Account', 'Amount'].map((header) => (
                                    <MUITableCell key={header} sx={{ textAlign:'center', pl: 0, pr:0 }}>
                                    <MUITableSortLabel
                                        active={orderBy === header.toLowerCase()}
                                        direction={orderBy === header.toLowerCase() ? order : 'asc'}
                                        onClick={() => handleSort(header.toLowerCase())}
                                        sx={{
                                            fontSize: { xs: 8 ,xs_1_2: 11 },
                                            pl: {xs: '12px' ,xs_1_2: '22px'},
                                            '&:hover': {
                                                color: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Change hover background color (light gray in dark mode)
                                            },
                                            '& .MuiTableSortLabel-icon': {
                                                color: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Color of up/down icon (can be customized)
                                                margin: 0,
                                                fontSize: {xs: '12px', xs_1_2: '18px'}
                                            },
                                            '.MuiSvgIcon-root': {
                                                fill: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Color of up/down icon (can be customized)
                                            },
                                        }}
                                    >
                                        {header}
                                    </MUITableSortLabel>
                                    </MUITableCell>
                                ))}
                                </MUITableRow>
                            </MUITableHead>
                        </MUITable>
                    </MUITableContainer>
                    {visibleRows.map((expense) => (
                        <MUIBox 
                                key={expense.id}
                                display="flex" 
                                alignItems="center"
                                sx={{ position: 'relative', pl: 4, pr: 4 }}
                                width={'100%'}
                            >
                                <TransactionCard 
                                    expense={expense}
                                    themeMode={themeMode}
                                />
                                {!expense.plaid && (
                                        <MUIButton
                                            onClick={() => handleDeleteTransaction(expense.id)}
                                            startIcon={<MdDelete />}
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                backgroundColor: 'transparent',
                                                color: themeMode === 'dark' ? '#fff' : '#000',
                                                width: '30px',
                                                minWidth: '20px',
                                                padding: 0,
                                                margin: 0,
                                                position: 'absolute', // Makes the button independent of content flow
                                                right: '-7px', // Adjust this value to fine-tune the distance from the right edge
                                                top: '50%', // Vertically centers the button
                                                transform: 'translateY(-50%)', // Centers button vertically relative to the cell
                                                '& .MuiButton-startIcon': {
                                                    margin: 0,
                                                },
                                                '&:hover':{
                                                    color: themeMode === 'dark' ? '#212731' : '#fff'
                                                }
                                            }}
                                        />
                                )}
                        </MUIBox>
                        
                    ))}
                </MUIBox>
            </MUIBox>
        </ThemeProvider>
    );
}
