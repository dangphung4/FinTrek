const express = require('express')
const router = express.Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase')

router.post('/', function (req, response, next) {
    Promise.resolve()
        .then(async function() {
            const { newTotal, newCategoryToBudgetDictionary, sbAccessToken, userID } = req.body;

            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            const { error: upsertExistingUserBudgetTotalError } = await supabase
                    .from("userBudgetTotals")
                    .upsert({
                        id: userID,
                        budget_total: newTotal
                    },
                    { onConflict: 'id' }
                    );
                
            if (upsertExistingUserBudgetTotalError){
                return response.status(400).json({ message: `Error occurred on upsert for new budget total for user: ${upsertExistingUserBudgetTotalError}` });
            }
            
            const categoryBudgetsToUpsert = Object.entries(newCategoryToBudgetDictionary).map(([category, budget]) => ({
                id: userID,
                category: category,
                budget: budget
            }));

            const { error: categoryBudgetsUpsertError } = await supabase
                .from("userBudgets")
                .upsert(categoryBudgetsToUpsert, { onConflict: ['id', 'category'] });
            
            if (categoryBudgetsUpsertError){
                return response.status(400).json({ message: `Error occurred trying to upsert new budgets for categories: ${categoryBudgetsUpsertError}` });
            }

            return response.status(200).json({ message: "Successfully upserted both total budget and budgets for specific categories" })
        })
        .catch(next);
});

module.exports = router;