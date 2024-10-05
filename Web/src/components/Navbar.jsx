import React from 'react';
import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  IconButton,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";


function Navbar() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Sign out the user
      localStorage.removeItem('userToken'); // Remove user token from local storage
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box bg={bgColor}  borderBottom='1px' borderBottomColor={useColorModeValue('gray.200', 'gray.700')} px={4} boxShadow="sm" position="fixed" width="full" zIndex="sticky">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Centering the Heading based on screen size */}
        <Flex flex={1} justifyContent={{ base: 'center', md: 'flex-start' }} paddingLeft={{ base:'12',megasmall:'122', md: '0'}} alignItems="center">
          <Heading size="lg">FinTrek</Heading>
        </Flex>

        <Flex alignItems="center">
          <InputGroup size="sm" width="200px" mr={4} display={{ base: 'none', md: 'block' }}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input type="text" placeholder="Search..." borderRadius="full" />
          </InputGroup>

          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Notifications"
            icon={<FaBell />}
            mr={4}
          />

          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Avatar
                size={'sm'}
                src={'https://avatars.dicebear.com/api/male/username.svg'}
              />
            </MenuButton>
            <MenuList alignItems={'center'}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>

          <ColorModeSwitcher ml={4} />
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;