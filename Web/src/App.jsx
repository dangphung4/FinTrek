// src/App.jsx
import React from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from './theme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RoutesWrapper from './components/RoutesWrapper'; // Import the new component

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh">
          <Navbar />
          <Flex>
            <Sidebar />
            <Box
              flex="1"
              ml={{ base: 0, md: '240px' }}
              mt="60px"
              p={8}
              minH="calc(100vh - 60px)"
              overflowY="auto"
              width="calc(100% - 240px)"
            >
              <RoutesWrapper /> {/* Use the new components */}
            </Box>
          </Flex>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
