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
            const { userID, sbAccessToken} = req.body;
            if (!sbAccessToken) {
                return response.status(400).json({ message: 'Access token is required.' });
            }
    
            const supabase = getSupabaseClientWithAuth(sbAccessToken);
            
            let accessTokenList = [];
            let refreshedTokenList = [];
            let definitiveTokenList = [];

            const { data: existingUser, error: selectError } = await supabase
            .from('plaidStuff')
            .select('access_token')
            .eq('id', userID)
            .not('access_token', 'is', null)

            if (selectError){
                if (selectError.code === 'PGRST301') {
                    //check if existingUser is null because if it is that means this is the user going to the expenses page without ever linking an account with plaid
                    //keep in mind that the logic will prob have to change later on because there is a chance they just dont want to link plaid and have already added transactions manually...
                    //... in which case I would probably want to just make sure it doesn't return during all this logic dealing with access tokens so that it goes to search for transactions
                    if (existingUser){
                        // If the JWT is expired, log the issue and proceed to create a new token
                        console.warn('JWT expired. Proceeding to create new access tokens.');

                        accessTokenList = existingUser.map(row => row.access_token);

                        for (const token of accessTokenList){
                            const res = await client.itemAccessTokenInvalidate({
                                access_token: token,
                            });
                            const newAccessToken = res.data.new_access_token;
                            refreshedTokenList.push({ oldToken: token, newToken: newAccessToken });
                        }
                        console.log("successfully refreshed access tokens")

                        // Batch update the database with new tokens
                        const updates = refreshedTokenList.map(({ oldToken, newToken }) =>
                            supabase
                            .from('plaidStuff')
                            .update({ access_token: newToken })
                            .eq('access_token', oldToken)
                        );

                        try {
                            await Promise.all(updates);
                            console.log('All tokens successfully updated in the database.');
                        } catch (updateError) {
                            console.error('Error updating access tokens in database:', updateError);
                            return response.status(500).json({ message: 'Database error while updating access tokens.' });
                        }

                        console.log("successfully updated/refreshed expired access token")
                        definitiveTokenList = refreshedTokenList.map(({ newToken }) => newToken);
                    }else{
                        console.log('JWT expired error occurred somehow while selecting access_tokens but there were no access_tokens in the database to refresh')
                    }
                }else{
                    console.error('Error checking for existing user and access token to get expenses', selectError)
                    return response.status(500).json({ message: 'Database error while while checking for access token to get expenses' })
                }
            }

            if (existingUser && existingUser.length > 0 && !selectError){
                console.log('existing user with access tokens was found')
                definitiveTokenList = existingUser.map(row => row.access_token)
            }

            const { data: existingTransactions, error: selectTransactionsError } = await supabase
            .from('transactions')
            .select()
            .eq('id', userID)
            .order('date', { ascending: false }) // Sort by date descending

            if (selectTransactionsError){
                console.error('Error checking for existing user and access token to get expenses', selectTransactionsError);
                return response.status(500).json({ message: 'Database error while while checking for transaction history to get expenses' });
            }

            if (existingTransactions && existingTransactions.length > 0){
                console.log('existing user with transaction history was found')
                //Query to get all item IDs associated with the user from the plaidStuff table
                const { data: plaidStuff, error: selectPlaidStuffError } = await supabase
                    .from('plaidStuff')
                    .select('item_id')
                    .eq('id', userID);

                if (selectPlaidStuffError) {
                    console.error('Error fetching item IDs from plaidStuff', selectPlaidStuffError);
                    return response.status(500).json({ message: 'Database error while fetching item IDs from plaidStuff' });
                }
                let itemIDsList = null;

                if (plaidStuff && plaidStuff.length > 0) {
                    itemIDsList = [...new Set(plaidStuff.map(item => item.item_id))];
                    // Check if there is at least one transaction for each item ID
                    const { data: transactionsForItems, error: transactionsForItemsError } = await supabase
                    .from('transactions')
                    .select('item_id')
                    .in('item_id', itemIDsList);

                    if (transactionsForItemsError) {
                        console.error('Error checking transactions for item IDs', transactionsForItemsError);
                        return response.status(500).json({ message: 'Database error while checking transactions for item IDs' });
                    }

                    if (transactionsForItems && transactionsForItems.length > 0) {
                        //getting only unique item ids from data object
                        uniqueItemIDsFromTransactionHistory = [...new Set(transactionsForItems.map(txn => txn.item_id))]
                        //checking if it is the same length as the itemIDsList. if its not this means that the transaction history does not account for the transactions from one or more linked institutions
                        if (uniqueItemIDsFromTransactionHistory.length === itemIDsList.length){ 
                            console.log('There are transactions for the all the item IDs associated with the user.');
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
                        }else{
                            console.log('The existing transaction history does not account for one or more newly linked institutions.');
                        }
                    }else{
                        console.log('There are transactions for the item IDs associated with the user. Going to pull them')
                    }

                }
            }
            //check if definitiveTokenList has a length greater than 0, confirming that there is at least one access token associated with the user...
            //... if this is not the case then just log and return a response to the user saying that there is no transaction history for the user and no institutions linked with plaid
            if (!(definitiveTokenList.length > 0)){
                console.log('No transaction history or institutions linked with plaid for the user');
                return response.status(500).json({ message: 'No transaction history or institutions linked with plaid for the user' });
            }
            // If no transactions exist, fetch data from Plaid API
            // Set cursor to empty to receive all historical updates
            let allAdded = [];
            let allAccounts = []
            
            for (const token of definitiveTokenList){
                let cursor = null;

                // New transaction updates since "cursor"
                let added = [];
                let modified = [];
                // Removed transaction ids
                let removed = [];
                let hasMore = true;
                let accounts = [];
                // Iterate through each page of new transaction updates for item
                while (hasMore) {
                    const request = {
                        access_token: token,
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
                    allAccounts = allAccounts.concat(accounts);

                    //add added to allAdded to eventually compile all transactions across all accounts
                    allAdded = allAdded.concat(added);
                }

                // get item id to put alongside transactions
                const { data: existingUserItemID, error: selectItemIDError } = await supabase
                .from('plaidStuff')
                .select('item_id')
                .eq('id', userID)
                .eq('access_token', token)
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
                    date: txn.date,
                    id: userID, 
                    item_id: item_id,
                    plaid: true 
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
                        plaid: true,
                    })),
                    { onConflict: 'account_id' }
                );
                if (accountUpsertError) {
                    console.error('Error upserting accounts data:', accountUpsertError);
                    return response.status(500).json({ message: 'Database error while upserting accounts.' });
                }else{
                    console.log(`successfully upserted accounts for item id: ${item_id}`)
                }
            }
            allAdded = allAdded.map(transaction => ({
                ...transaction,
                date: transaction.date, // Standardized date format
                plaid: true,
            })); 
            const recently_added = [...allAdded].sort(compareTxnsByDateAscending)
            
            response.json({ latest_transactions: recently_added, accounts: allAccounts });
        })
        .catch(next);
});

module.exports = router;