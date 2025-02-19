import React from 'react';
import {
    Box,
    VStack,
    Flex,
    Text,
    Progress
} from "@chakra-ui/react"

const BudgetCategoryCard = ({
    category,
    budget,
    spent,
}) => {
    const percentage = (spent / budget) * 100;
    return (
        <Box p={4} borderWidth="1px" borderRadius="md">
            <VStack align="stretch" spacing={4}>
                <Flex justify="space-between">
                    <Text fontWeight="bold">{category}</Text>
                    <Text>${spent} / ${budget}</Text>
                </Flex>
                <Progress value={percentage} colorScheme={percentage > 90 ? "red" : "green"} size="sm" />
                <Text fontSize="sm" color={percentage > 90 ? "red.500" : "green.500"}>
                    {percentage.toFixed(1)}% used
                </Text>
            </VStack>
        </Box>
    );
};

export default BudgetCategoryCard;