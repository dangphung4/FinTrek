const express = require('express')
const router = express.Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase')
const { v4: uuidv4 } = require('uuid');

router.post('/', function (req,response,next){
    Promise.resolve()
        .then(async function() {
            const { name, type, subtype, sbAccessToken, userID } = req.body;
            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            const { data: existingAccount, error: existingAccountError } = await supabase
            .from('accounts')
            .select()
            .eq('id', userID)
            .eq('name', name)
            .maybeSingle();

            if (existingAccountError){
                console.error('this error occurred trying to find existing account when creating a new bank account for user: ', existingAccountError);
                return response.status(500).json({ message: 'error occurred trying to find existing account when creating a new bank account for user' })
            };

            if (existingAccount){
                console.log('existing account found while trying to create new bank account for user: ', existingAccount);
                return response.status(500).json({ message: 'Existing account with same name found.' })
            }

            const { error: newAccountInsertError } = await supabase
            .from('accounts')
            .insert({
                id: userID,
                item_id: null,
                name: name,
                official_name: null,
                subtype: subtype,
                type: type,
                available_balance: null,
                current_balance: null,
                iso_currency_code: 'USD',
                balance_limit: null,
                account_id: uuidv4(),
                plaid: false
            })

            if (newAccountInsertError){
                console.error('Error trying to insert new bank account into supabase accounts table: ', newAccountInsertError);
                return response.status(500).json({ message: 'Error trying to insert new bank account into supabase accounts table' })
            }

            console.log('successfully inserted new bank account into accounts table');
            return response.status(200).json({ message: 'Successfully added new account!' });
        })
        .catch(next);
});

module.exports = router;