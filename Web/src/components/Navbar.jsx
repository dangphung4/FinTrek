import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useDisclosure,
  Avatar,
  HStack,
  InputGroup,
  Input,
  InputLeftElement,
  Badge,
  Container,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaPlus,
} from 'react-icons/fa';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import supabase from "../supabaseClient";

function Navbar({ isSidebarCollapsed }) {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const searchBg = useColorModeValue('gray.50', 'gray.700');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('userToken');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box
      bg={bgColor}
      borderBottom='1px'
      borderBottomColor={borderColor}
      position="fixed"
      width="full"
      zIndex={100}
      boxShadow="sm"
      height="60px"
    >
      <Container maxW="100%" height="full" px={4}>
        <Flex
          h="full"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo/Brand */}
          <Flex alignItems="center">
            <Text
              fontSize="24px"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, teal.400)"
              bgClip="text"
              letterSpacing="tight"
            >
              FinTrek
            </Text>
          </Flex>

          {/* Search Bar */}
          <Flex flex={1} justify="center" ml={10} mr={10}>
            <InputGroup maxW="600px" size="md">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search transactions, categories..."
                borderRadius="full"
                bg={searchBg}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                _focus={{ 
                  boxShadow: 'none',
                  borderColor: 'blue.400',
                  bg: useColorModeValue('white', 'gray.800')
                }}
              />
            </InputGroup>
          </Flex>

          {/* Right Section */}
          <HStack spacing={4}>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="blue"
              size="sm"
              borderRadius="full"
              display={{ base: 'none', md: 'flex' }}
              px={4}
            >
              Add Transaction
            </Button>

            {/* Notifications */}
            <Menu>
              <MenuButton
                as={IconButton}
                variant="ghost"
                borderRadius="full"
                position="relative"
                icon={
                  <Box position="relative">
                    <FaBell />
                    <Badge
                      position="absolute"
                      top="-2"
                      right="-2"
                      colorScheme="red"
                      variant="solid"
                      fontSize="xs"
                      borderRadius="full"
                      minW="5"
                      h="5"
                    >
                      3
                    </Badge>
                  </Box>
                }
              />
              <MenuList py={2}>
                <MenuItem py={2}>New Feature Available</MenuItem>
                <MenuItem py={2}>Budget Alert</MenuItem>
                <MenuItem py={2}>Payment Due</MenuItem>
              </MenuList>
            </Menu>

            {/* Profile Menu */}
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  src="https://avatars.dicebear.com/api/avataaars/your-custom-seed.svg"
                  borderWidth={2}
                  borderColor="blue.400"
                />
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaUserCircle />} py={2}>Profile</MenuItem>
                <MenuItem icon={<FaCog />} py={2}>Settings</MenuItem>
                <Link to="/link-plaid">
                  <MenuItem py={2}>Link Bank Account</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem 
                  icon={<FaSignOutAlt />} 
                  onClick={handleLogout}
                  color="red.400"
                  py={2}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>

            <ColorModeSwitcher />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;