// src/components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Box, VStack, Icon, Link, Flex, Text, useColorModeValue, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, Button } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaChartPie, FaList, FaWallet, FaFlag, FaBars} from 'react-icons/fa';

function Sidebar() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const { isOpen, onOpen, onClose } = useDisclosure();


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
    <>
      <Box
        display={{ base: 'none', md:'flex'}}/* on smaller screens (md breakpoint) hides sidebar*/
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

    {/* for smaller/md screen */}
      <Button
          display={{ base: 'block', md: 'none' }} // Show on small screens
          pos="fixed"
          top="12px"
          left="10px"
          onClick={onOpen}
          zIndex="overlay"
          colorScheme="blue"
        >
          <Icon as={FaBars} />
      </Button>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent
            bg={bgColor}
          >
            <DrawerCloseButton />
            <DrawerHeader>Navigation</DrawerHeader>
            <DrawerBody>
              <VStack align="stretch" spacing={1} mt={8}>
                <NavItem icon={FaChartPie} to="/" onClick={onClose}>
                  Dashboard
                </NavItem>
                <NavItem icon={FaList} to="/expenses" onClick={onClose}>
                  Expenses
                </NavItem>
                <NavItem icon={FaWallet} to="/budget" onClick={onClose}>
                  Budget
                </NavItem>
                <NavItem icon={FaFlag} to="/goals" onClick={onClose}>
                  Goals
                </NavItem>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default Sidebar;