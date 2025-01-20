import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Checkbox,
    FormControlLabel,
    ThemeProvider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useThemeContext } from '../context/themeContext';
import muiTheme from '../muiTheme';

export default function AddExpenseDialog({ 
    open, 
    onClose, 
    handleAddExpense, 
    uniqueUnlinkedAccounts, 
}) {
    //using context to get themeMode to use proper mui theme
    const { themeMode } = useThemeContext();
    const muiThemeModed = muiTheme(themeMode);

    const [formData, setFormData] = useState({
        date: null,
        description: '',
        category: '',
        account: '',
        amount: null,
        isCash: false
    });

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
    };

    const handleDateChange = (newDate) => {
        setFormData({
            ...formData,
            date: newDate
        });
    };

    const handleCashToggle = (event) => {
        setFormData({
            ...formData,
            isCash: event.target.checked,
            // Reset account selection when cash is checked
            account: event.target.checked ? '' : formData.account
        });
    };

    const handleSubmit = () => {
        // Validate form data
        const requiredFields = formData.isCash
            ? ['date', 'description', 'category', 'amount']
            : ['date', 'description', 'category', 'account', 'amount'];

        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
            return;
        }

        // Convert amount to number and validate
        const amount = Number(formData.amount);
        if (isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        // Create expense object
        const expense = {
            ...formData,
            amount: amount,
            // Convert date to ISO string for database
            date: formData.date.toISOString()
        };

        // Pass expense data up to parent
        handleAddExpense(expense);
        
        // Reset form and close dialog
        setFormData({
            date: null,
            description: '',
            category: '',
            account: '',
            amount: '',
            isCash: false
        });
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            date: null,
            description: '',
            category: '',
            account: '',
            amount: '',
            isCash: false
        })
        onClose()
    }

    return (
        <ThemeProvider theme={muiThemeModed}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Dialog 
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                >
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                        <DatePicker
                            label="Date"
                            value={formData.date}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} />}
                            fullWidth
                        />

                        <TextField
                            label="Amount"
                            value={formData.amount}
                            onChange={handleInputChange('amount')}
                            type="number"
                            fullWidth
                        />
                        
                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={handleInputChange('description')}
                            fullWidth
                        />

                        <TextField
                            label="Category"
                            value={formData.category}
                            onChange={handleInputChange('category')}
                            fullWidth
                        />
                        
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isCash}
                                    onChange={handleCashToggle}
                                />
                            }
                            label="Cash Transaction"
                        />
                        
                        {!formData.isCash && uniqueUnlinkedAccounts.length > 0 && (
                            <FormControl fullWidth>
                                <InputLabel>Account</InputLabel>
                                <Select
                                    value={formData.account}
                                    onChange={handleInputChange('account')}
                                    label="Account"
                                >
                                    {uniqueUnlinkedAccounts.map((account) => (
                                        <MenuItem key={account.account_id} value={account.account_id}>
                                            {account.account}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        
                        {!formData.isCash && (
                            <>
                                <Typography 
                                    variant="body2" 
                                    color="text.primary"
                                    fontWeight={200}
                                >
                                    Don't see the account you're looking for?
                                </Typography>
                                <Link to='/create-bank-account'>
                                    <Typography
                                        variant="body2" 
                                        color="primary"
                                        fontWeight={400}
                                    >
                                        create account
                                    </Typography>
                                </Link>
                            </>
                        )}
                        
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCancel()}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained">
                        Add Expense
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </ThemeProvider>
    );
}