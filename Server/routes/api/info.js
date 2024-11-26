const router = require('express').Router();
const { Products } = require('plaid');

let ITEM_ID = null;
let ACCESS_TOKEN = null;
// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(
    ',',
);

router.post('/', function (request, response, next) {
    response.json({
      item_id: ITEM_ID,
      access_token: ACCESS_TOKEN,
      products: PLAID_PRODUCTS,
    });
});

module.exports = router;