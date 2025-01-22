
// src/pages/Budget.jsx
import React, {useState} from 'react';
import { Box, SimpleGrid, Progress, Text, VStack, useColorModeValue, Button, Flex } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { FaPlus, FaChartBar } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/DashboardCard';
import BudgetWindowSelect from '../components/BudgetWindowSelect';
import { FaRegEdit } from "react-icons/fa";

const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'];

function Budget() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const [budgetWindow, setBudgetWindow] = useState('Year');

  return (
    <Box width="100%">
      <PageHeader title="Budget" />
      <BudgetWindowSelect 
          onWindowChange = {setBudgetWindow}
      />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Budget"
          value={`$${faker.number.int({ min: 2000, max: 10000 })}`}
          change="5.2%"
          isIncrease={true}
          icon={FaChartBar}
        />
        <DashboardCard
          title="Spent so far"
          value={`$${faker.number.int({ min: 1000, max: 5000 })}`}
          change="45%"
          isIncrease={false}
          icon={FaChartBar}
        />
        <DashboardCard
          title="Remaining"
          value={`$${faker.number.int({ min: 500, max: 5000 })}`}
          change="55%"
          isIncrease={true}
          icon={FaChartBar}
        />
      </SimpleGrid>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Budget Breakdown</Text>
          <Box>
            <Button leftIcon={<FaRegEdit />} colorScheme="blue" width={{base:'43px', megasmall:'auto'}} mr={3}>Edit</Button>
            <Button leftIcon={<FaPlus />} colorScheme="blue" width={{base:'86px',megasmall:'auto'}} >Add Category</Button>
          </Box>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {categories.map(category => {
            const spent = faker.number.int({ min: 100, max: 1000 });
            const budget = faker.number.int({ min: spent, max: spent + 500 });
            const percentage = (spent / budget) * 100;
            return (
              <Box key={category} p={4} borderWidth="1px" borderRadius="md">
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
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Budget;