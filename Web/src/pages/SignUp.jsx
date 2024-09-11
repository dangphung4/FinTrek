import React, {useEffect,useState} from "react";
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
import { Link } from "react-router-dom";
import theme from "../theme.js";
import logo from "../assets/examplelogo.png"
import supabase from "../supabaseClient.js";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSignUp = async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
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
            description: "Account created successfully.",
            status: "success",
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
                placeholder="Name"
                width="300px"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                width="300px"
                type="email"
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
              <Button
                onClick={handleSignUp}
                isLoading={loading}
              >
                Create Account
              </Button>
              <HStack>
                <Text fontSize="sm">Already have an account?</Text>
                <Link to="/login">
                  <Text fontSize="sm" as="u">
                    Sign in
                  </Text>
                </Link>
              </HStack>
            </VStack>
          </Box>
        </ChakraProvider>
      );
}

export default SignUp;