const express = require('express')
const router = express.Router();
const client = require('../../services/plaidClient')
const { getSupabaseClientWithAuth } = require('../../services/supabase')

router.post('/', function (req,response,next){
    Promise.resolve()
        .then(async function() {
            let ACCESS_TOKEN = null;
            let item_id = null;

            const compareTxnsByDateAscending = (a, b) => (a.date < b.date) - (a.date > b.date);

            //check supabase to see if user has transaction history
            const { userID, sbAccessToken, limit } = req.body;
            if (!sbAccessToken) {
                return response.status(400).json({ message: 'Access token is required.' });
            }
    
            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            const { data: existingUser, error: selectError } = await supabase
            .from('plaidStuff')
            .select('access_token')
            .eq('id', userID)
            .not('access_token', 'is', null)
            .single();

            if (selectError){
                console.error('Error checking for existing user and access token to get expenses', selectError)
                return response.status(500).json({ message: 'Database error while while checking for access token to get expenses' })
            }

            if (existingUser){
                console.log('existing user with access token was found')
                ACCESS_TOKEN = existingUser.access_token
            }

            const { data: existingTransactions, error: selectTransactionsError } = await supabase
            .from('transactions')
            .select()
            .eq('id', userID)
            .order('date', { ascending: false }) // Sort by date descending
            .limit(limit); // Only fetch the latest 10 transactions by default;

            if (selectTransactionsError){
                console.error('Error checking for existing user and access token to get expenses', selectTransactionsError);
                return response.status(500).json({ message: 'Database error while while checking for transaction history to get expenses' });
            }

            if (existingTransactions && existingTransactions.length > 0){
                console.log('existing user with transaction history was found')
                let existingAccountInfo = null;
                
                // get account information
                const { data: accountInformation, error: selectAccountInfoError } = await supabase
                .from('accounts')
                .select()
                .eq('id',userID)

                if (selectAccountInfoError){
                    console.log("Database error when selecting account info", selectAccountInfoError);
                    return response.status(500).json({ message: 'Database error while selecting account info' })
                }
                
                if (accountInformation && accountInformation.length > 0){
                    console.log("account information found for user");
                    existingAccountInfo = accountInformation;
                }


                return response.json({ latest_transactions: existingTransactions, accounts: existingAccountInfo });
            }

            // If no transactions exist, fetch data from Plaid API
            // Set cursor to empty to receive all historical updates
            let cursor = null;

            // New transaction updates since "cursor"
            let added = [];
            let modified = [];
            // Removed transaction ids
            let removed = [];
            let accounts = []
            let hasMore = true;
            // Iterate through each page of new transaction updates for item
            while (hasMore) {
                const request = {
                    access_token: ACCESS_TOKEN,
                    cursor: cursor,
                };
                const plaidResponse = await client.transactionsSync(request)
                const data = plaidResponse.data;

                // If no transactions are available yet, wait and poll the endpoint.
                // Normally, we would listen for a webhook, but the Quickstart doesn't
                // support webhooks. For a webhook example, see
                // https://github.com/plaid/tutorial-resources or
                // https://github.com/plaid/pattern
                cursor = data.next_cursor;
                if (cursor === "") {
                    await sleep(2000);
                    continue;
                }

                // Add this page of results
                added = added.concat(data.added);
                modified = modified.concat(data.modified);
                removed = removed.concat(data.removed);
                hasMore = data.has_more;

                // Extract and upsert account data
                accounts = accounts.concat(data.accounts);

            }

            // Return the 10 most recent transactions by default
            const recently_added = [...added].sort(compareTxnsByDateAscending).slice(-(limit));
            // get item id to put alongside transactions
            const { data: existingUserItemID, error: selectItemIDError } = await supabase
            .from('plaidStuff')
            .select('item_id')
            .eq('id', userID)
            .eq('access_token', ACCESS_TOKEN)
            .not('access_token', 'is', null)
            .not('item_id', 'is', null)
            .single();

            if (selectItemIDError){
                console.error('Error checking for existing user and item id to add transactions to supabase', selectItemIDError)
                return response.status(500).json({ message: 'Database error while while checking for item id to add transactions to supabase' })
            }

            if (existingUserItemID){
                console.log('existing user with item id was found')
                item_id = existingUserItemID.item_id
            }
            //upsert transaction data into transactions table in supabase
            const {error: upsertError} = await supabase.from('transactions').upsert(added.map(txn => ({
                ...txn,
                id: userID, 
                item_id: item_id 
            })),{ onConflict: 'transaction_id' });
            if (upsertError) {
                // Handle Supabase upsert errors
                console.error('Error upserting transactions into database:', upsertError);
                return response.status(500).json({ message: 'Database error while upserting transactions.' });
            }else{
                console.log("successfully upserted transactions into database")
            }
            //upsert account data to accounts table in supabase
            const { error: accountUpsertError } = await supabase.from('accounts').upsert(
                accounts.map(account => ({
                    account_id: account.account_id,
                    id: userID,
                    item_id: item_id,
                    name: account.name,
                    official_name: account.official_name,
                    subtype: account.subtype,
                    type: account.type,
                    available_balance: account.balances.available,
                    current_balance: account.balances.current,
                    iso_currency_code: account.balances.iso_currency_code,
                    balance_limit: account.balances.limit,
                })),
                { onConflict: 'account_id' }
            );
            if (accountUpsertError) {
                console.error('Error upserting accounts data:', accountUpsertError);
                return response.status(500).json({ message: 'Database error while upserting accounts.' });
            }

            response.json({ latest_transactions: recently_added, accounts: accounts });
        })
        .catch(next);
});

module.exports = router;