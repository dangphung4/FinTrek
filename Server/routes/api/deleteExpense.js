const express = require('express')
const router = express.Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase')
const { v4: uuidv4 } = require('uuid');

router.post('/', function (req,response,next){
    Promise.resolve()
        .then(async function() {
            const { transaction_id, sbAccessToken, userID } = req.body;
            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            console.log("transaction id to be deleted: ", transaction_id);

            const { error: deleteTransactionError } = await supabase
            .from('transactions')
            .delete()
            .eq('transaction_id', transaction_id);

            if (deleteTransactionError){
                console.error('this error occurred trying to delete a transaction for user: ', deleteTransactionError);
                return response.status(500).json({ message: 'this error occurred trying to delete a transaction for user' })
            };

            console.log('successfully deleted expense');
            return response.status(200).json({ message: 'successfully deleted expense' })
        })
        .catch(next);
});

module.exports = router;