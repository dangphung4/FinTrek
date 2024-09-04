// src/pages/Goals.jsx
import React from 'react';
import { Box, SimpleGrid, Progress, Text, VStack, useColorModeValue, Button, Flex, Icon } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { FaPlus, FaFlag, FaChartLine, FaCoins } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/DashboardCard';

const goals = [
  'Emergency Fund',
  'Vacation Savings',
  'New Car',
  'Home Down Payment'
];

function Goals() {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box width="100%">
      <PageHeader title="Financial Goals" />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Savings"
          value={`$${faker.number.int({ min: 5000, max: 50000 })}`}
          change="15.7%"
          isIncrease={true}
          icon={FaCoins}
        />
        <DashboardCard
          title="Goals Achieved"
          value={faker.number.int({ min: 1, max: 5 })}
          change="1 this month"
          isIncrease={true}
          icon={FaFlag}
        />
        <DashboardCard
          title="Projected Growth"
          value={`${faker.number.int({ min: 5, max: 15 })}%`}
          change="2.3%"
          isIncrease={true}
          icon={FaChartLine}
        />
      </SimpleGrid>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Your Goals</Text>
          <Button leftIcon={<FaPlus />} colorScheme="blue">Add Goal</Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {goals.map(goal => {
            const current = faker.number.int({ min: 1000, max: 10000 });
            const target = faker.number.int({ min: current, max: 20000 });
            const percentage = (current / target) * 100;
            return (
              <Box key={goal} p={4} borderWidth="1px" borderRadius="md">
                <VStack align="stretch" spacing={4}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold">{goal}</Text>
                    <Icon as={FaFlag} color={percentage >= 100 ? "green.500" : "blue.500"} />
                  </Flex>
                  <Progress value={percentage} colorScheme={percentage >= 100 ? "green" : "blue"} size="sm" />
                  <Flex justify="space-between">
                    <Text fontSize="sm">${current} / ${target}</Text>
                    <Text fontSize="sm" fontWeight="bold" color={percentage >= 100 ? "green.500" : "blue.500"}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Goals;