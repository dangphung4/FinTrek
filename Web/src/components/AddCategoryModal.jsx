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
    FormLabel
} from '@chakra-ui/react';

const AddCategoryModal = ({ isOpenAddCategoryModal, setIsOpenAddCategoryModal }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleClose = () => {
        setIsOpenAddCategoryModal(false);
        setCategoryName(''); // Clear input when modal closes
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
                        onChange={(e) => setCategoryName(e.target.value)}
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