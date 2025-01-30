import React, { useState } from 'react';
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react';
import supabase from '../supabaseClient';
import { useBudget } from '../context/budgetContext';

const AddCategoryModal = ({ isOpenAddCategoryModal, setIsOpenAddCategoryModal }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const toast = useToast();

    const { setNewCategoryAdded } = useBudget();

    const handleClose = () => {
        setIsOpenAddCategoryModal(false);
        setCategoryName(''); // Clear input when modal closes
        setError('');
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        // Check if all characters are letters or spaces
        const isValid = value.split('').every(char => 
            (char >= 'a' && char <= 'z') || 
            (char >= 'A' && char <= 'Z') ||
            char === ' '
        );
        
        if (isValid) {
            setCategoryName(value);
            setError('');
        } else {
            setError('Category name can only contain letters');
        }
    };

    const handleAdd = async () => {
        const sbAccessToken = localStorage.getItem('sb_access_token');
        const { data: { user } } = await supabase.auth.getUser()
        const userID = user?.id || '';
        const response = await fetch(`${import.meta.env.VITE_API_URL}/add_category`,{
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ category: categoryName, sbAccessToken, userID }),
        });
        handleClose();
        if (!response.ok) {
            const data = await response.json();
            toast({
                title: "Error Adding Category",
                description: data.message || "Failed to add category",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        const data = await response.json();
        setNewCategoryAdded((prev) => `${prev}a`);

        toast({
            title: "Category Added",
            description: data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom"
        });
    };

    return (
        <Modal isOpen={isOpenAddCategoryModal} onClose={handleClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Category</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Category Name</FormLabel>
                        <Input 
                        placeholder="Enter category (e.g., Food, Utilities)" 
                        value={categoryName}
                        onChange={handleInputChange}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                <Button 
                    colorScheme="blue" 
                    mr={3} 
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button 
                    colorScheme="blue"
                    onClick={handleAdd} 
                >
                    Add
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddCategoryModal;