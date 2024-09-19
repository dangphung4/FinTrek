import React, { useState } from 'react';
import {
  ChakraProvider,
  Input,
  Box,
  VStack,
  Text,
  Button,
  useToast
} from "@chakra-ui/react";
import theme from "../theme.js";
import logo from "../assets/examplelogo.png";
import { Link, useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  

  const handleSendResetLink = async () => {
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Password reset link sent to your email.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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
          <Button
            onClick={handleSendResetLink}
            isLoading={loading}
          >
            Send Reset Link
          </Button>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default ForgotPassword;
