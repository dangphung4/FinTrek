import React from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, Icon, useColorModeValue } from '@chakra-ui/react';

function DashboardCard({ title, value, change, isIncrease, icon }) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconColor = useColorModeValue('gray.500', 'gray.300');

  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="sm">
      <Stat>
        <Flex justify="space-between" align="center" mb={2}>
          <StatLabel fontSize="md" fontWeight="medium" color={textColor}>{title}</StatLabel>
          {icon && <Icon as={icon} boxSize={6} color={iconColor} />}
        </Flex>
        <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>{value}</StatNumber>
        <StatHelpText color={textColor}>
          <StatArrow type={isIncrease ? 'increase' : 'decrease'} />
          {change}
        </StatHelpText>
      </Stat>
    </Box>
  );
}

export default DashboardCard;