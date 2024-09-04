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
import { Link } from 'react-router-dom';

function Navbar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bgColor} px={4} boxShadow="sm" position="fixed" width="full" zIndex="sticky">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Heading size="lg" color={textColor} mr={8}>FinTrek</Heading>
          <Flex display={{ base: 'none', md: 'flex' }}>
            {/* <Button as={Link} to="/" variant="ghost" mr={3}>Dashboard</Button>
            <Button as={Link} to="/expenses" variant="ghost" mr={3}>Expenses</Button>
            <Button as={Link} to="/budget" variant="ghost" mr={3}>Budget</Button>
            <Button as={Link} to="/goals" variant="ghost">Goals</Button> */}
          </Flex>
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
            <MenuList alignItems={'center'} borderColor={borderColor}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>

          <ColorModeSwitcher ml={4} />
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;