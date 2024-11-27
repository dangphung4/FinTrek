const router = require('express').Router();
const client = require('../../services/plaidClient')
const { getSupabaseClientWithAuth } = require('../../services/supabase');
// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
router.post('/', function (req, res, next) {
    Promise.resolve()
      .then(async function () {
        const { public_token, sbAccessToken, userID} = req.body;
        if (!sbAccessToken) {
          return res.status(400).json({ message: 'Access token is required.' });
        }

        const supabase = getSupabaseClientWithAuth(sbAccessToken);

        // Step 1: Check if an access token and item id already exists in the database
        const { data: existingUser, error: selectError } = await supabase
        .from('plaidStuff')
        .select('access_token, item_id')
        .eq('id', userID)
        .not('access_token', 'is', null) // Ensure access_token is not null
        .not('item_id', 'is', null) // Ensure item_id is not null
        .single(); // Expecting a single match

        if (selectError) {
          if (selectError.code === 'PGRST301') {
            // If the JWT is expired, log the issue and proceed to create a new token
            console.warn('JWT expired. Proceeding to create a new access token.');
          } else if (selectError.code !== 'PGRST116') {
            // Handle other Supabase query errors
            console.error('Error checking for existing access token and item id:', selectError);
            return response.status(500).json({ message: 'Database error while checking for access token and item id.' });
          }
        }

        if (existingUser && selectError?.code !== 'PGRST301') {
          // Step 2: If both access_token and item_id exist, return them
          console.log("existing user with access token and item id was found")
          return res.status(200).json({
              access_token: existingUser.access_token,
              item_id: existingUser.item_id,
              error:null,
          });
        }

        const tokenResponse = await client.itemPublicTokenExchange({
          public_token: public_token,
        });
        ACCESS_TOKEN = tokenResponse.data.access_token;
        ITEM_ID = tokenResponse.data.item_id;

        const { error: upsertError } = await supabase
        .from('plaidStuff')
        .upsert(
            { 
                id: userID,
                item_id: ITEM_ID, 
                access_token: ACCESS_TOKEN // Replace with your access token variable
            },
            { onConflict: 'id' } // Ensures the `id` column is used to determine conflicts
        );

        if (upsertError) {
            // Handle Supabase upsert errors
            console.error('Error upserting access token into database:', upsertError);
            return res.status(500).json({ message: 'Database error while upserting access token.' });
        }

        res.json({
          // the 'access_token' is a private token, DO NOT pass this token to the frontend in your production environment
          access_token: ACCESS_TOKEN,
          item_id: ITEM_ID,
          error: null,
        });
      })
      .catch(next);
});

module.exports = router;