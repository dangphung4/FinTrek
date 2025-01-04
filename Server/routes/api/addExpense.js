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
                item_id: null,
                transaction_id: uuidv4(),
                account_id: expenseData.account,
                amount: expenseData.amount,
                date: expenseData.date,
                authorized_date: null,
                name: expenseData.description,
                category: [expenseData.category],
                category_id: null,
                pending: null,
                payment_channel: null,
                merchant_name: null,
                transaction_code: null,
                location: null,
                currency: null,
                iso_currency_code: 'USD',
                unofficial_currency_code: null,
                created_at: null,
                account_owner: null,
                authorized_datetime: null,
                check_number: null,
                counterparties: null,
                datetime: null,
                logo_url: null,
                merchant_entity_id: null,
                payment_meta: null,
                pending_transaction_id: null,
                personal_finance_category: null,
                personal_finance_category_icon_url: null,
                transaction_type: null,
                website: null,
                plaid: false
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