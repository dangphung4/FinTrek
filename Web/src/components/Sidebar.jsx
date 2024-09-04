// src/components/Sidebar.jsx
import React from 'react';
import { Box, VStack, Icon, Link, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaChartPie, FaList, FaWallet, FaFlag } from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const NavItem = ({ icon, children, to }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        as={RouterLink}
        to={to}
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}
        width="100%"
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          color={isActive ? activeColor : textColor}
          bg={isActive ? hoverBg : 'transparent'}
          _hover={{
            bg: hoverBg,
            color: activeColor,
          }}
        >
          {icon && <Icon mr="4" fontSize="16" as={icon} />}
          {children}
        </Flex>
      </Link>
    );
  };

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: '240px' }}
      pos="fixed"
      h="full"
      pt="60px"
    >
      <VStack align="stretch" spacing={1} mt={8}>
        <NavItem icon={FaChartPie} to="/">Dashboard</NavItem>
        <NavItem icon={FaList} to="/expenses">Expenses</NavItem>
        <NavItem icon={FaWallet} to="/budget">Budget</NavItem>
        <NavItem icon={FaFlag} to="/goals">Goals</NavItem>
      </VStack>
    </Box>
  );
}

export default Sidebar;