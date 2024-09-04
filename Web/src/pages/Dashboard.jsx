import React from "react";
import {
  SimpleGrid,
  Box,
  Grid,
  GridItem,
  Text,
  Flex,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { faker } from "@faker-js/faker";
import {
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaChartPie,
  FaWallet,
  FaPlus,
} from "react-icons/fa";
import DashboardCard from "../components/DashboardCard";
import PageHeader from "../components/PageHeader";

const lineChartData = Array.from({ length: 7 }, (_, i) => ({
  name: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  expenses: faker.number.int({ min: 50, max: 300 }),
  income: faker.number.int({ min: 100, max: 500 }),
}));

const pieChartData = [
  { name: "Food", value: 400 },
  { name: "Transport", value: 300 },
  { name: "Entertainment", value: 300 },
  { name: "Utilities", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard() {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const chartLineColor = useColorModeValue("#8884d8", "#B794F4");
  const chartLineColor2 = useColorModeValue("#82ca9d", "#4FD1C5");

  return (
    <Box width="100%">
      <PageHeader title="Dashboard" />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <DashboardCard
          title="Total Balance"
          value={`$${faker.number.int({ min: 5000, max: 20000 })}`}
          change="23.36%"
          isIncrease={true}
          icon={FaDollarSign}
        />
        <DashboardCard
          title="Monthly Expenses"
          value={`$${faker.number.int({ min: 1000, max: 5000 })}`}
          change="9.05%"
          isIncrease={false}
          icon={FaWallet}
        />
        <DashboardCard
          title="Savings Rate"
          value={`${faker.number.int({ min: 10, max: 30 })}%`}
          change="5.4%"
          isIncrease={true}
          icon={FaChartPie}
        />
        <DashboardCard
          title="Investments"
          value={`$${faker.number.int({ min: 2000, max: 10000 })}`}
          change="12.7%"
          isIncrease={true}
          icon={FaArrowUp}
        />
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm" height="400px">
            <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
              Income vs Expenses
            </Text>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip
                  contentStyle={{ backgroundColor: bgColor, color: textColor }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke={chartLineColor}
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="income" stroke={chartLineColor2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
        <GridItem>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm" height="400px">
            <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
              Expense Breakdown
            </Text>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: bgColor, color: textColor }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: textColor,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>

      <Box bg={bgColor} mt={6} p={6} borderRadius="lg" boxShadow="sm">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Recent Transactions
          </Text>
          <Button leftIcon={<FaPlus />} colorScheme="blue" size="sm">
            Add Transaction
          </Button>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
              p={3}
              borderWidth={1}
              borderColor={borderColor}
              borderRadius="md"
              bg={useColorModeValue("gray.50", "gray.800")}
            >
              <Flex align="center">
                <Icon
                  as={index % 2 === 0 ? FaArrowUp : FaArrowDown}
                  color={index % 2 === 0 ? "green.500" : "red.500"}
                  mr={2}
                />
                <Box>
                  <Text fontWeight="bold" color={textColor}>
                    {faker.finance.transactionType()}
                  </Text>
                  <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                    {faker.date.recent().toLocaleDateString()}
                  </Text>
                </Box>
              </Flex>
              <Text fontWeight="bold" color={textColor}>
                ${faker.finance.amount()}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}

export default Dashboard;