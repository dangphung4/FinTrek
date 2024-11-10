// src/App.jsx
import React, {useEffect, useState, useCallback, useContext} from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import theme from './theme';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RoutesWrapper from './components/RoutesWrapper'; // Import the new component
import Context from "./context";

function App() {
  /* const location = useLocation(); */
  const [isAuthPath,setIsAuthPath] = useState(false)

  // Effect to check the current path and update isAuthPath accordingly
  useEffect(() => {
    const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
    setIsAuthPath(authPaths.includes(location.pathname));
  }, [location.pathname]);

  const { linkSuccess, isPaymentInitiation, itemId, dispatch } =
    useContext(Context);

  const getInfo = useCallback(async () => {
    console.log('initiated get info')
    const response = await fetch("http://localhost:8080/api/info", { method: "POST" });
    if (!response.ok) {
      console.log('get info response failed')
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false }; // No need for paymentInitiation
    }
    const data = await response.json();
    console.log('get info call successful')
    
    // Focus on transaction and balance products (no payment initiation)
    const isUserTokenFlow = data.products.some((product) => product === "transactions" || product === "balance");
  
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isUserTokenFlow: isUserTokenFlow, // Updated state
      },
    });
    console.log(isUserTokenFlow)
    return { isUserTokenFlow }; // Only return what's necessary
  }, [dispatch]);
    

  const generateUserToken = useCallback(async () => {
    const response = await fetch("http://localhost:8080/api/create_user_token", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { userToken: null } });
      return;
    }
    const data = await response.json();
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { userToken: data.user_token } });
      return data.user_token;
    }
  }, [dispatch]);

  const generateToken = useCallback(async () => {
    const response = await fetch("http://localhost:8080/api/create_link_token", { method: "POST" });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { linkToken: null } });
      return;
    }
    const data = await response.json();
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: { linkToken: null, linkTokenError: data.error },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
    }
    // Store the link_token
    localStorage.setItem("link_token", data.link_token);
  }, [dispatch]);
  

  useEffect(() => {
    const init = async () => {
      const { isUserTokenFlow } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }

      if (isUserTokenFlow) {
        await generateUserToken();
      }
      generateToken();
    };
    init();
  }, [dispatch, generateToken, generateUserToken, getInfo]);

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
