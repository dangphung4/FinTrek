const express = require('express')
const router = express.Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase')

router.post('/', function (req, response, next) {
    Promise.resolve()
        .then(async function() {
            const { sbAccessToken, userID } = req.body;

            if (!sbAccessToken || !userID) {
                return res.status(400).json({ message: "Missing sbAccessToken or userID" });
            }

            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            const { data: selectUserBudgetDetails, error: selectUserBudgetDetailsError } = await supabase
                .from("userBudgets")
                .select("category, budget")
                .eq("id", userID);

            if (selectUserBudgetDetailsError){
                return response.status(400).json({ message: `this error occured trying to get the users budget details: ${selectUserBudgetDetailsError}` })
            };

            if (selectUserBudgetDetails && selectUserBudgetDetails.length > 0){
                return response.status(200).json({ budgetDetails: selectUserBudgetDetails });
            }else{
                return response.status(404).json({ message: 'Could not find budget details for user' })
            };

        })
        .catch(next);
});

module.exports = router;