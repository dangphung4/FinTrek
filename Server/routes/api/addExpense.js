const express = require('express')
const router = express.Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase')
const { v4: uuidv4 } = require('uuid');

router.post('/', function (req,response,next){
    Promise.resolve()
        .then(async function() {
            const { expenseData, sbAccessToken, userID } = req.body;
            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            const { error: insertTransactionError } = await supabase
            .from('transactions')
            .insert({
                id: userID,
                transaction_id: uuidv4(),
                account_id: expenseData.account,
                amount: expenseData.amount,
                date: expenseData.date,
                name: expenseData.description,
                category: [expenseData.category],
                iso_currency_code: 'USD',
                plaid: false, // Example of a meaningful hardcoded value
            });

            if (insertTransactionError){
                console.error('this error occurred trying to insert new transaction for user: ', insertTransactionError);
                return response.status(500).json({ message: 'this error occurred trying to insert new transaction for user' })
            };

            console.log('successfully added expense');
            return response.status(200).json({ message: 'successfully added expense' });
        })
        .catch(next);
});

module.exports = router;