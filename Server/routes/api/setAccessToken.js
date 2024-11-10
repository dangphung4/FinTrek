const router = require('express').Router();
const client = require('../../services/plaidClient')

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
router.post('/', function (req, res, next) {
    PUBLIC_TOKEN = req.body.public_token;
    Promise.resolve()
      .then(async function () {
        const tokenResponse = await client.itemPublicTokenExchange({
          public_token: PUBLIC_TOKEN,
        });
        prettyPrintResponse(tokenResponse);
        ACCESS_TOKEN = tokenResponse.data.access_token;
        ITEM_ID = tokenResponse.data.item_id;
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