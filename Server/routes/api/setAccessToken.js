const router = require('express').Router();
const { response } = require('express');
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
        const { public_token, sbAccessToken, userID, institution_id} = req.body;
        if (!sbAccessToken) {
          return res.status(400).json({ message: 'Access token is required.' });
        }

        const supabase = getSupabaseClientWithAuth(sbAccessToken);

        // Step 1: Check if an access token and item id already exists in the database
        const { data: existingUser, error: selectError } = await supabase
            .from('plaidStuff')
            .select('access_token, item_id')
            .eq('id', userID)
            .eq('institution_id', institution_id)
            .not('access_token', 'is', null) // Ensure access_token is not null
            .not('item_id', 'is', null) // Ensure item_id is not null
            .not('institution_id', 'is', null) // Ensure item_id is not null
            .single(); // Expecting a single match

        if (selectError && selectError.code !== 'PGRST116') { // Ignore "not found" errors
          console.error('Error querying existing institution:', selectError);
          return res.status(500).json({ message: 'Error querying database.' });
        }

        if (existingUser) {
          // Step 2: If both access_token and item_id exist, return them
          console.log("existing user with access token item id and institution was found")
          return res.status(200).json({
              access_token: existingUser.access_token,
              item_id: existingUser.item_id,
              error:null,
          });
        }
        //get user token to insert for new access tokens created as well
        let user_token = null;
        const {  data: userTokenData, error: selectUserTokenError } = await supabase
            .from('plaidStuff')
            .select('user_token')
            .eq('id',userID)

        if (selectUserTokenError){
          console.log('error getting user token associated with user id: ', selectUserTokenError)
          return res.status(500).json({ message: "Error getting user token associated with user id" })
        }

        if(userTokenData && userTokenData.length > 0){
          console.log('user token found: ', userTokenData[0].user_token )
          user_token = userTokenData[0].user_token;
        }

        const tokenResponse = await client.itemPublicTokenExchange({
          public_token: public_token,
        });
        ACCESS_TOKEN = tokenResponse.data.access_token;
        ITEM_ID = tokenResponse.data.item_id;

        // Check if there are rows with the given id and a non-null access_token
        const { data: existingRows, error: selectIDError } = await supabase
            .from('plaidStuff')
            .select('id') // Only select the necessary column(s)
            .eq('id', userID)
            .not('access_token', 'is', null);

        if (selectIDError) {
          console.error('Error checking for existing user to determine upsert or insert:', selectIDError);
          return res.status(500).json({ message: 'Error checking for existing user to determine upsert or insert.' });
        }

        if (existingRows && existingRows.length > 0) {
          // If rows exists with non null access_token, insert a new row
          const { error: insertError } = await supabase
              .from('plaidStuff')
              .insert({
                  id: userID,
                  institution_id: institution_id,
                  access_token: ACCESS_TOKEN,
                  item_id: ITEM_ID,
                  user_token: user_token, // Optional: Keep this if relevant
              });

          if (insertError) {
              console.error('Error inserting access token, item id, institution id, and user token into database:', insertError);
              return res.status(500).json({ message: 'Error storing new access token, item id, institution id, and user token.' });
          }

          console.log('New access token, item id, institution id, and user token successfully added for user:', userID);

        } else {
          // If row exists but access_token is null, update the existing row with new values
          const { error: updateError } = await supabase
              .from('plaidStuff')
              .update({
                  institution_id: institution_id,
                  access_token: ACCESS_TOKEN,
                  item_id: ITEM_ID,
              })
              .eq('id', userID); // Update based on userID

          if (updateError) {
              console.error('Error updating access token, item id, institution id, and user token data:', updateError);
              return res.status(500).json({ message: 'Error updating access token, item id, institution id, and user token data.' });
          }

          console.log('access token, item id, institution id, and user token data successfully updated for user:', userID);
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