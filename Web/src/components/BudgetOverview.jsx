// src/components/BudgetOverview.jsx
import React from 'react';
import { Box, Heading, Progress, Text, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';

const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];

function BudgetOverview() {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Budget Overview</Heading>
      <VStack spacing={4} align="stretch">
        {categories.map(category => {
          const spent = faker.number.int({ min: 100, max: 1000 });
          const budget = faker.number.int({ min: spent, max: spent + 500 });
          const percentage = (spent / budget) * 100;
          return (
            <Box key={category}>
              <Text>{category}</Text>
              <Progress value={percentage} colorScheme={percentage > 90 ? "red" : "green"} />
              <Text fontSize="sm">${spent} / ${budget}</Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default BudgetOverview;