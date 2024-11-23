//createUserToken.js
const router = require('express').Router();
const client = require('../../services/plaidClient')
const { getSupabaseClientWithAuth } = require('../../services/supabase');

let USER_TOKEN = null;

// Create a user token which can be used for Plaid Check, Income, or Multi-Item link flows
// https://plaid.com/docs/api/users/#usercreate
router.post('/', function (req, response, next) {
    Promise.resolve()
      .then(async function () {
        const { userID, sbAccessToken } = req.body; // Destructure `accessToken` from the request body
            
        if (!sbAccessToken) {
            return response.status(400).json({ message: 'Access token is required.' });
        }

        const supabase = getSupabaseClientWithAuth(sbAccessToken);

        // Step 1: Check if a user token already exists in the database
        const { data: existingUser, error: selectError } = await supabase
        .from('plaidStuff')
        .select('user_token')
        .eq('id', userID)
        .not('user_token', 'is', null)
        .single(); // Expecting a single match

        if (selectError) {
          if (selectError.code === 'PGRST301') {
            // If the JWT is expired, log the issue and proceed to create a new token
            console.warn('JWT expired. Proceeding to create a new user token.');
          } else if (selectError.code !== 'PGRST116') {
            // Handle other Supabase query errors
            console.error('Error checking for existing user token:', selectError);
            return response.status(500).json({ message: 'Database error while checking for user token.' });
          }
        }

        if (existingUser && selectError?.code !== 'PGRST301') {
          // Step 2: If a user token exists, return it
          return response.status(200).json({ message: 'User token already exists.', user_token: existingUser.user_token });
        }

        const request = {
           // Typically this will be a user ID number from your application. 
          client_user_id: userID
        }
        
        const user = await client.userCreate(request);
        USER_TOKEN = user.data.user_token

        // Step 4: Store the new user token in the database
        const { error: upsertError } = await supabase
        .from('plaidStuff')
        .upsert(
            { 
                id: userID, 
                user_token: USER_TOKEN 
            },
            { onConflict: 'id' } // Use `id` to determine conflicts
        );

        if (upsertError) {
            // Handle Supabase upsert errors
            console.error('Error upserting user token into database:', upsertError);
            return response.status(500).json({ message: 'Database error while upserting user token.' });
        }

        response.json(user.data);
      }).catch(next);
  });

module.exports = router;