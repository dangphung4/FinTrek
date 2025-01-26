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
} from '@chakra-ui/react';
import supabase from '../supabaseClient';

const AddCategoryModal = ({ isOpenAddCategoryModal, setIsOpenAddCategoryModal }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setIsOpenAddCategoryModal(false);
        setCategoryName(''); // Clear input when modal closes
        setError('');
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        // Only allow letters (A-Z, a-z) and spaces
        if (/^[a-zA-Z\s]*$/.test(value)) {
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
        if (!response.ok) {
            console.log(`response failed fetching at get expenses endpoint. This error occured: ${await response.json().message}`);
            return;
        }
        const data = await response.json();
        console.log(data.message);
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