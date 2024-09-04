// src/components/FinancialGoals.jsx
import React from 'react';
import { Box, Heading, Text, Progress, VStack } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';

const goals = [
  'Emergency Fund',
  'Vacation Savings',
  'New Car',
  'Home Down Payment'
];

function FinancialGoals() {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Financial Goals</Heading>
      <VStack spacing={4} align="stretch">
        {goals.map(goal => {
          const current = faker.number.int({ min: 1000, max: 10000 });
          const target = faker.number.int({ min: current, max: 20000 });
          const percentage = (current / target) * 100;
          return (
            <Box key={goal}>
              <Text>{goal}</Text>
              <Progress value={percentage} colorScheme="blue" />
              <Text fontSize="sm">${current} / ${target}</Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default FinancialGoals;