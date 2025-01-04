// Backend: transactionStats.js
const router = require('express').Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase');

router.post('/', async function (req, res, next) {
    try {
        const { transactions, sbAccessToken, userID } = req.body;
        
        if (!sbAccessToken || !transactions || !Array.isArray(transactions)) {
            console.error('Invalid request parameters');
            return res.status(400).json({ message: 'Invalid request parameters' });
        }

        const supabase = getSupabaseClientWithAuth(sbAccessToken);

        // Get all unique account IDs from the transactions
        const accountIds = [...new Set(transactions.map(t => t.account_id))];

        // Fetch account types for all relevant accounts in one query
        const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select()
            .in('account_id', accountIds)
            .eq('id', userID);

        if (accountsError) {
            console.error('Error fetching account types:', accountsError);
            return res.status(500).json({ message: 'Error fetching account data' });
        }

        // Create a map of account IDs to their types for quick lookup
        const accountTypeMap = accountsData.reduce((acc, account) => {
            acc[account.account_id] = account;
            return acc;
        }, {});

        // Calculate normalized transaction amounts and track the largest expense
        let largestExpenseAmount = 0;
        let largestExpenseTransaction = null;
        let totalExpenses = 0;

        transactions.map(transaction => {
            const account = accountTypeMap[transaction.account_id];
            if (!account) {
                console.error(`Account ID ${transaction.account_id} not found in accountTypeMap.`);
                return; // Skip this transaction if the account is missing
            }
            const amount = parseFloat(transaction.amount);

            const setLargestExpenseTransaction = () => {
                largestExpenseTransaction = {
                    ...transaction,
                    accountType: account.type,
                    accountName: account.name,
                };
            }
            
            // For credit accounts: positive = spending
            // For depository accounts: negative = spending
            if (amount > 0 && account.type === 'credit'){
                totalExpenses += Math.abs(amount);
                if (amount > Math.abs(largestExpenseAmount)){
                    largestExpenseAmount = amount;
                    setLargestExpenseTransaction();
                }
            }else if (amount < 0 && account.type === 'depository'){
                totalExpenses += Math.abs(amount);
                if (amount > Math.abs(largestExpenseAmount)){
                    largestExpenseAmount = amount;
                    setLargestExpenseTransaction();
                }
            }else{
                if (amount > 0){ 
                    totalExpenses += amount;
                    if (amount > Math.abs(largestExpenseAmount)){
                        largestExpenseAmount = amount;
                        setLargestExpenseTransaction();
                    }
                };
            }
        });

        // Calculate date range
        const dateRange = {
            start: new Date(Math.min(...transactions.map(t => new Date(t.date)))),
            end: new Date(Math.max(...transactions.map(t => new Date(t.date))))
        };

        // Calculate average daily spend
        const daysDiff = Math.max(1, Math.ceil(
            (dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)
        ));

        // Calculate statistics
        const stats = {
            largestExpenseTransaction,
            largestExpenseAmount,
            totalExpenses,
            avgDailySpend: totalExpenses / daysDiff,
            dateRange
        };

        res.json(stats);
    } catch (error) {
        console.error('Error processing transaction stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;