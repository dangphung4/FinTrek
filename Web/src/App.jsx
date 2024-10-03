// src/App.jsx
import React, {useEffect, useState} from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import theme from './theme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RoutesWrapper from './components/RoutesWrapper'; // Import the new component

function App() {
  /* const location = useLocation(); */
  const [isAuthPath,setIsAuthPath] = useState(false)

  // Effect to check the current path and update isAuthPath accordingly
  useEffect(() => {
    const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
    setIsAuthPath(authPaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        {isAuthPath ? (
            <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
              <Flex>
                <Box
                    flex="1"
                    p={8}
                    overflowY="auto"
                  >
                    <RoutesWrapper setIsAuthPath={setIsAuthPath}/> {/* Use the new components */}
                  </Box>
              </Flex>
            </Box>
          ) : (
            <Box minH="100vh">
              <Navbar />
              <Flex>
                <Sidebar />
                <Box
                  flex="1"
                  ml={{ base: 0, md: '240px' }}
                  mt="60px"
                  p={{base:2,megasmall:4,xxs:8}}
                  minH="calc(100vh - 60px)"
                  overflowY="auto"
                  width="calc(100% - 240px)"
                >
                  <RoutesWrapper setIsAuthPath={setIsAuthPath}/> {/* Use the new components */}
                </Box>
              </Flex>
            </Box>
          )}
      </Router>
    </ChakraProvider>
  );
}

export default App; 
