const express = require('express')
const router = express.Router();
const { getSupabaseClientWithAuth } = require('../../services/supabase')

router.post('/', function (req, response, next) {
    Promise.resolve()
        .then(async function() {
            const { category, sbAccessToken, userID } = req.body;

            // Normalize category name
            const normalizedCategory = 
                category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

            const supabase = getSupabaseClientWithAuth(sbAccessToken);

            // Check if category already exists for the user
            const { data: selectUserBudgetsMatchingCategory, error: selectUserBudgetsError } = await supabase
                .from("userBudgets")
                .select("category")
                .eq("id", userID)
                .eq("category", normalizedCategory);
            
            // If category exists, return conflict response
            if (selectUserBudgetsMatchingCategory && selectUserBudgetsMatchingCategory.length > 0) {
                return response.status(409).json({ 
                    message: 'Category already exists for this user' 
                });
            }

            if (selectUserBudgetsError){
                return response.status(400).json({
                    message: `this error occurred while checking if category already exists for user in database: ${selectUserBudgetsError}`
                })
            }

            // If no error and no existing category, insert new category
            const { error: insertError } = await supabase
                .from("userBudgets")
                .insert({ 
                    id: userID, 
                    category: normalizedCategory 
                });

            // Handle insert error
            if (insertError) {
                console.error('Error inserting category:', insertError);
                return response.status(500).json({ 
                    message: 'Failed to add category' 
                });
            }

            // Success response
            response.status(201).json({ 
                message: 'Category added successfully' 
            });
        })
        .catch(next);
});

module.exports = router;