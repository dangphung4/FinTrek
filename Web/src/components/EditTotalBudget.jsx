import React from 'react';
import { 
    Flex, 
    Text, 
    Input, 
    FormControl 
} from '@chakra-ui/react';
import { useBudget } from '../context/budgetContext';

const EditTotalBudget = ({ handleBudgetChange }) => {
    const { potentialTotalBudget } = useBudget();

    return (
        <Flex align="center" justifySelf={'center'} gap={4}>
            <Text fontWeight={3} fontSize={14}>Total</Text>
            <FormControl>
                <Input 
                type="text" 
                value={potentialTotalBudget}
                onChange={handleBudgetChange}
                w={70}
                />
            </FormControl>
        </Flex>
    );
};

export default EditTotalBudget;