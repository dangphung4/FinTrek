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
            console.log('no access token provided to create user token, its required.')
            return response.status(400).json({ message: 'Access token is required.' });
        }
        
        const supabase = getSupabaseClientWithAuth(sbAccessToken);

        // Step 1: Check if a user token already exists in the database
        console.log('finding if user has existing user token')
        const { data: existingUser, error: selectError } = await supabase
        .from('plaidStuff')
        .select('user_token')
        .eq('id', userID)

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

        if (existingUser && existingUser.length > 0 && selectError?.code !== 'PGRST301') {
          // Step 2: If a user token exists, return it
          console.log('user token already exists: ', existingUser)
          return response.status(200).json({ message: 'User token already exists.', user_token: existingUser.user_token });
        }

        const request = {
           // Typically this will be a user ID number from your application. 
          client_user_id: userID
        }
        
        try{
          console.log('attempting to create user')
          const user = await client.userCreate(request);
          USER_TOKEN = user.data.user_token
          // Step 4: Store the new user token in the database
          console.log('attempting to upsert user token to user')
          const { error: upsertError } = await supabase
          .from('plaidStuff')
          .upsert(
              { 
                  id: userID, 
                  user_token: USER_TOKEN 
              },
              { onConflict: 'v4id' } // Use `id` to determine conflicts
          );

          if (upsertError) {
              // Handle Supabase upsert errors
              console.error('Error upserting user token into database:', upsertError);
              return response.status(500).json({ 
                message: 'Database error while upserting user token.',
                details: upsertError
              });
          }
          response.json(user.data);
        }catch (error){
          console.log("Error trying to create user: ", error);
          return response.status(500).json({ 
            message: 'Database error while upserting user token.',
            details: error
          });
        }
      }).catch(next);
  });

module.exports = router;