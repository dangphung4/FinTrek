// src/components/Sidebar.jsx
import React from 'react';
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  VStack,
  Text,
  IconButton,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  CloseButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FaChartPie,
  FaList,
  FaWallet,
  FaFlag,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from 'react-icons/fa';

function Sidebar({ onCollapse }) {
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Add effect to notify parent of collapse state changes
  React.useEffect(() => {
    onCollapse?.(isCollapsed);
  }, [isCollapsed, onCollapse]);

  const NavItem = ({ icon, children, to }) => {
    const isActive = location.pathname === to;
    
    return (
      <Tooltip 
        label={isCollapsed ? children : ''} 
        placement="right" 
        hasArrow
        bg={useColorModeValue('gray.800', 'gray.200')}
        color={useColorModeValue('white', 'gray.800')}
      >
        <Link
          as={RouterLink}
          to={to}
          style={{ textDecoration: 'none', width: '100%' }}
          _focus={{ boxShadow: 'none' }}
        >
          <Flex
            align="center"
            p="3.5"
            mx="3"
            borderRadius="xl"
            role="group"
            cursor="pointer"
            color={isActive ? activeColor : textColor}
            bg={isActive ? useColorModeValue('blue.50', 'gray.700') : 'transparent'}
            _hover={{
              bg: useColorModeValue('gray.50', 'gray.700'),
              color: activeColor,
            }}
            transition="all 0.2s"
          >
            {icon && (
              <Icon
                mr={isCollapsed ? "0" : "3.5"}
                fontSize="20"
                as={icon}
                color={isActive ? activeColor : textColor}
                _groupHover={{ color: activeColor }}
                transition="all 0.2s"
              />
            )}
            {!isCollapsed && (
              <Text 
                fontSize="15px"
                fontWeight={isActive ? "600" : "500"}
                letterSpacing="wide"
              >
                {children}
              </Text>
            )}
          </Flex>
        </Link>
      </Tooltip>
    );
  };

  const navItems = [
    { icon: FaChartPie, label: 'Dashboard', to: '/' },
    { icon: FaList, label: 'Expenses', to: '/expenses' },
    { icon: FaWallet, label: 'Budget', to: '/budget' },
    { icon: FaFlag, label: 'Goals', to: '/goals' },
    { icon: FaCog, label: 'Settings', to: '/settings' },
  ];

  const SidebarContent = () => (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={isCollapsed ? '60px' : '240px'}
      pos="fixed"
      h="full"
      pt="70px"
      transition="all 0.3s ease"
    >
      <Flex
        direction="column"
        h="full"
        overflow="hidden"
        css={{
          '&:hover': {
            overflowY: 'auto',
          },
          '&::-webkit-scrollbar': { 
            width: '3px',
            height: '3px',
          },
          '&::-webkit-scrollbar-track': { 
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': { 
            background: borderColor,
            borderRadius: '20px',
          },
        }}
      >
        <VStack 
          align="stretch" 
          spacing={2} 
          p={3}
          flex="1"
        >
          {navItems.map((item) => (
            <NavItem key={item.to} icon={item.icon} to={item.to}>
              {item.label}
            </NavItem>
          ))}
        </VStack>

        <Box p={3} borderTop="1px" borderTopColor={borderColor}>
          <IconButton
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            icon={isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="sm"
            width="full"
            variant="ghost"
            borderRadius="lg"
            color={textColor}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700'),
              color: activeColor,
            }}
          />
        </Box>
      </Flex>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box 
        display={{ base: 'none', md: 'block' }}
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        zIndex={99}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Hamburger Button */}
      <IconButton
        aria-label="Open Menu"
        icon={<FaBars />}
        onClick={onOpen}
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        top="4"
        left="4"
        zIndex="overlay"
      />

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="240px">
          <CloseButton position="absolute" right="4" top="4" onClick={onClose} />
          <SidebarContent />
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;