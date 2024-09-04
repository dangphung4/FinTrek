// src/pages/Expenses.jsx
import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, Button, Flex, Icon, Text, SimpleGrid } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';
import { FaPlus, FaFilter, FaDownload } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import DashboardCard from '../components/DashboardCard';

const expenses = Array.from({ length: 10 }, () => ({
  id: faker.string.uuid(),
  date: faker.date.recent().toLocaleDateString(),
  description: faker.commerce.productName(),
  category: faker.helpers.arrayElement(['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping']),
  amount: faker.number.int({ min: 10, max: 500 }),
}));

function Expenses() {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box width="100%">
      <PageHeader title="Expenses" />
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Expenses"
          value={`$${faker.number.int({ min: 1000, max: 5000 })}`}
          change="9.05%"
          isIncrease={false}
          icon={FaDownload}
        />
        <DashboardCard
          title="Largest Expense"
          value={`$${faker.number.int({ min: 100, max: 1000 })}`}
          change="Food & Dining"
          isIncrease={false}
          icon={FaFilter}
        />
        <DashboardCard
          title="Average Daily Spend"
          value={`$${faker.number.int({ min: 20, max: 200 })}`}
          change="12.3%"
          isIncrease={true}
          icon={FaDownload}
        />
      </SimpleGrid>
      <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm" overflowX="auto">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">Expense List</Text>
          <Flex>
            <Button leftIcon={<FaFilter />} variant="outline" mr={2}>Filter</Button>
            <Button leftIcon={<FaPlus />} colorScheme="blue">Add Expense</Button>
          </Flex>
        </Flex>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th>Category</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.map((expense) => (
              <Tr key={expense.id}>
                <Td>{expense.date}</Td>
                <Td>{expense.description}</Td>
                <Td>{expense.category}</Td>
                <Td isNumeric>${expense.amount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default Expenses;