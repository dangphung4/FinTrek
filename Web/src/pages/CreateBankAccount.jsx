import React, { useState } from "react";
import {
    ChakraProvider,
    Input,
    Box,
    VStack,
    Select,
    Text,
    Button,
    useToast,
    Container,
    Heading,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import theme from "../theme.js";

import supabase from '../supabaseClient';

function CreateBankAccount() {
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountSubtype, setAccountSubtype] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const getSubtypeOptions = () => {
        if (accountType === 'credit') {
            return ['credit card'];
        } else if (accountType === 'depository') {
            return ['checking', 'savings'];
        }
        return [];
    };

    const handleCreateAccount = async () => {
        if (!accountName || !accountType || !accountSubtype) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);

        try {
            const sbAccessToken = localStorage.getItem('sb_access_token');
            const { data: { user } } = await supabase.auth.getUser()
            const userID = user?.id || '';
            const response = await fetch(`${import.meta.env.VITE_API_URL}/create_bank_account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: accountName,
                    type: accountType,
                    subtype: accountSubtype,
                    sbAccessToken: sbAccessToken,
                    userID: userID,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create account');
            }

            toast({
                title: "Success",
                description: "Account created successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Reset form
            setAccountName('');
            setAccountType('');
            setAccountSubtype('');

        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (

            <Box
                minHeight="100vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Container maxW="md" p={8} borderRadius="lg" boxShadow="md">
                    <VStack spacing={6}>
                        <Heading size="lg">Create New Account</Heading>
                        
                        <FormControl isRequired>
                            <FormLabel>Account Name</FormLabel>
                            <Input
                                placeholder="Enter account name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Account Type</FormLabel>
                            <Select
                                placeholder="Select account type"
                                value={accountType}
                                onChange={(e) => {
                                setAccountType(e.target.value);
                                setAccountSubtype('');
                                }}
                            >
                                <option value="credit">Credit</option>
                                <option value="depository">Depository</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired isDisabled={!accountType}>
                            <FormLabel>Account Subtype</FormLabel>
                            <Select
                                placeholder="Select account subtype"
                                value={accountSubtype}
                                onChange={(e) => setAccountSubtype(e.target.value)}
                            >
                                {getSubtypeOptions().map((subtype) => (
                                <option key={subtype} value={subtype}>
                                    {subtype.charAt(0).toUpperCase() + subtype.slice(1)}
                                </option>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            colorScheme="blue"
                            width="full"
                            onClick={handleCreateAccount}
                            isLoading={loading}
                            loadingText="Creating Account"
                            >
                            Create Account
                        </Button>
                    </VStack>
                </Container>
            </Box>
    );
}

export default CreateBankAccount;