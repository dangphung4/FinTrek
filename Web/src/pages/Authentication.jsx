import React, { useState } from 'react';
import {
  ChakraProvider,
  Input,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useToast
} from "@chakra-ui/react";
import theme from "../theme.js";
import logo from "../assets/examplelogo.png";
import { Link, useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient.js";

function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: "Signed in successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    }

    if (data.session) {
      localStorage.setItem('userToken', data.session.access_token);
      navigate('/'); // Redirect to dashboard on successful login
    }

    setLoading(false);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing="16px">
          <img src={logo} width="500px" alt="Logo" />
          <Input
            placeholder="Email"
            width="300px"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            width="300px"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/forgot-password">
            <Text fontSize="xs" as="u">
              Forgot Username/Password?
            </Text>
          </Link>
          <Button
            onClick={handleSignIn}
            isLoading={loading}
          >
            Sign in
          </Button>
          <HStack>
            <Text fontSize="sm">New here?</Text>
            <Link to="/signup">
              <Text fontSize="sm" as="u">
                Join now
              </Text>
            </Link>
          </HStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default Authentication;
