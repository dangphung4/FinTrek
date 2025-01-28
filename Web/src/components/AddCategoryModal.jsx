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
                >
                    Add
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddCategoryModal;