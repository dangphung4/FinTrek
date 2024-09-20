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
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import supabase from "../supabaseClient.js";

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
  

  const handlePasswordReset = async () => {
    setLoading(true);
    if (password !== passwordConfirm) {
        toast({
          title: 'Error',
          description: "Passwords do not match.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase.auth.updateUser({ password: password});
  
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
          description: 'Password has been reset successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        setTimeout(() => {
          navigate('/login');
        }, 3000)
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
          <Text fontSize="xl">Reset Your Password</Text>
          <Input
            placeholder="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <Input
                placeholder="Confirm New Password"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          <Button
            onClick={handlePasswordReset}
            isLoading={loading}
          >
            Reset Password
          </Button>
          <Link to="/login">
            <Text fontSize="xs" as="u">
              Sign in
            </Text>
          </Link>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default ResetPassword;
