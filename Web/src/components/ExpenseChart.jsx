// src/components/ExpenseChart.jsx
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { faker } from '@faker-js/faker';

const data = [
  'Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping'
].map(category => ({
  category,
  amount: faker.number.int({ min: 100, max: 1000 })
}));

function ExpenseChart() {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading size="md" mb={4}>Monthly Expenses</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ExpenseChart;