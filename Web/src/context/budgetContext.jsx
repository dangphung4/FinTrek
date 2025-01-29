import { createContext, useContext, useState } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children, initTotalBudget }) => {
    const [allocatedBudget, setAllocatedBudget] = useState(0);
    const [totalBudget, setTotalBudget] = useState(initTotalBudget);
    const [reset, setReset] = useState(false);
    const [categoryToBudgetDictionary, setCategoryToBudgetDictionary] = useState(null);
    const [newCategoryAdded, setNewCategoryAdded] = useState("a"); //this value is just going to be a string of a's, it exists to let the budget page know when to call the get budget details endpoint to avoid excessive or unnecessary api calls. Thought about making it true/false but thought that might be confusing and imply a different use 

    const updateTotalBudget = (newTotal) => {
            if (newTotal < allocatedBudget){
                setAllocatedBudget(0);
                setReset(!reset);
            }
    };
    
    return (
        <BudgetContext.Provider 
            value={{ 
                allocatedBudget, 
                setAllocatedBudget,
                totalBudget, 
                setTotalBudget,
                setCategoryToBudgetDictionary, 
                reset 
            }}>
                {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};