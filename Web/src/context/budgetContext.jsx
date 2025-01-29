import { createContext, useContext, useState } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children, initTotalBudget }) => {
    const [allocatedBudget, setAllocatedBudget] = useState(0);
    const [totalBudget, setTotalBudget] = useState(initTotalBudget);
    const [reset, setReset] = useState(false);
    const [categoryToBudgetDictionary, setCategoryToBudgetDictionary] = useState(null);

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