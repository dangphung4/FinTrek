//createUserToken.js
const router = require('express').Router();
const client = require('../../services/plaidClient')
const { v4: uuidv4 } = require('uuid');

let USER_TOKEN = null;

// Create a user token which can be used for Plaid Check, Income, or Multi-Item link flows
// https://plaid.com/docs/api/users/#usercreate
router.post('/', function (req, response, next) {
    Promise.resolve()
      .then(async function () {
        const request = {
           // Typically this will be a user ID number from your application. 
          client_user_id: 'user_' + req.body.userID
        }
        
        const user = await client.userCreate(request);
        USER_TOKEN = user.data.user_token
        response.json(user.data);
      }).catch(next);
  });

module.exports = router;