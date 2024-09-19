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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();


    const handleSignUp = async () => {
        setLoading(true);

        //Check if the email already exists in the profiles table
        const { data: existingUser, error: queryError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email);

        if (queryError) {
          toast({
            title: "Error",
            description: "Error checking profiles table.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }

        if (existingUser.length > 0) {
          // Email already exists
          toast({
            title: "Account already exists",
            description: "An account with this email already exists.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
          return;
        }

        //sign up user
        const { data:signUpData, error:signUpError } = await supabase.auth.signUp({
        email,
        password,
        });


        if (signUpError) {
          toast({
              title: "Error",
              description: signUpError.message,
              status: "error",
              duration: 5000,
              isClosable: true,
          });
        } else {
        // Step 3: Insert into profiles table after successful sign-up
          const { user } = signUpData;
          if (!user) {
            toast({
                title: "Error",
                description: "Sign up failed, user is not authenticated.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            return;
          }
          const { data,error: profileError } = await supabase
            .from("profiles")
            .insert({ id: user.id, email: email,created_at: new Date(),name: name })
            .select();
          
          if (profileError) {
            toast({
              title: "Error",
              description: "Error inserting into profiles table." + profileError.message,
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
