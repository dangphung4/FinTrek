// src/App.tsx
import React, {useEffect, useState, useCallback, useContext} from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import theme from './theme';
import muiTheme from './muiTheme';
import { useThemeContext } from './context/themeContext'; 
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RoutesWrapper from './components/RoutesWrapper'; // Import the new component
import Context from "./context";
import supabase from './supabaseClient';

function App() {
  //using context to get themeMode to use proper mui theme
  const { themeMode } = useThemeContext();
  const muiThemeModed = muiTheme(themeMode);

  const [isAuthPath,setIsAuthPath] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Effect to check the current path and update isAuthPath accordingly
  useEffect(() => {
    const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
    setIsAuthPath(authPaths.includes(location.pathname));
  }, [location.pathname]);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const ensureValidSession = async () => {
    const session = await supabase.auth.getSession();
    const tokenExpiresAt = session?.data?.session?.expires_at;
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
    // Refresh only if the token is close to expiry (e.g., less than 5 minutes remaining)
    if (tokenExpiresAt && tokenExpiresAt - currentTime < 300) {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh failed:', error);
        throw new Error('Session refresh failed');
      }
    }
  };

  const { dispatch } = useContext(Context);

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
    //const isUserTokenFlow = data.products.some((product: string) => product === "transactions" || product === "balance");
    const isUserTokenFlow = true;
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
    

  const generateUserToken = useCallback(async (userID: string) => {
    const sbAccessToken = localStorage.getItem('sb_access_token'); // Retrieve the token

    if (!sbAccessToken) {
        console.error('Access token not found.');
        return;
    }
    console.log("calling create user token endpoint")
    const response = await fetch("http://localhost:8080/api/create_user_token", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userID, sbAccessToken })
    });
    if (!response.ok) {
      console.log("failed to create user token");
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

  const generateToken = useCallback(async (userID: string) => {
    const response = await fetch("http://localhost:8080/api/create_link_token", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userID })
    });
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
    if (isAuthPath){ return; }

    const init = async () => {
      await ensureValidSession();
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
      const { data: { user } } = await supabase.auth.getUser()
      const userID = user?.id || '';
      console.log('useID: ', userID)
      await generateUserToken(userID);
      generateToken(userID);
    };
    init();
  }, [dispatch, generateToken, generateUserToken, getInfo, isAuthPath]);

  return (
    <MUIThemeProvider theme={muiThemeModed}>
      {/* Ensures Material UI components reset default browser styles */}
      <CssBaseline />
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
                      <RoutesWrapper setIsAuthPath={setIsAuthPath}/> 
                    </Box>
                </Flex>
              </Box>
            ) : (
              <Box minH="100vh">
                <Navbar isSidebarCollapsed={isSidebarCollapsed} />
                <Flex>
                  <Sidebar onCollapse={handleSidebarCollapse} />
                  <Box
                    position="relative"
                    flex="1"
                    ml={{ 
                      base: 0, 
                      md: isSidebarCollapsed ? '60px' : '240px' 
                    }}
                    mt="60px"
                    p={{base:2, megasmall:4, xxs:8}}
                    minH="calc(100vh - 60px)"
                    overflowY="auto"
                    transition="margin-left 0.2s"
                  >
                    <RoutesWrapper setIsAuthPath={setIsAuthPath}/>
                  </Box>
                </Flex>
              </Box>
            )}
        </Router>
      </ChakraProvider>
    </MUIThemeProvider>
  );
}

export default App; 
