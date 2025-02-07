import React, { useState, useEffect } from 'react';
import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Box,
    Text,
    Flex
} from '@chakra-ui/react';
import { useBudget } from '../context/budgetContext';

const ModalCategoryBudgetSlider = ({ category, budget }) => {
    const [hasMounted, setHasMounted] = useState(false);
    const { allocatedBudget, setAllocatedBudget, potentialTotalBudget, setPotentialCategoryToBudgetDictionary } = useBudget();
    const [sliderValue, setSliderValue] = useState(budget);

    const editPotentialBudgetForCategory = (newValue) => {
        setPotentialCategoryToBudgetDictionary(prev => ({
            ...prev,
            [category]: newValue
        }));
    };
    
    const handleSliderChange = (newValue) => {
        // Calculate how much this slider's change would affect the total allocated budget
        const budgetDifference = Number(newValue) - Number(sliderValue);
        const newAllocatedBudget = Number(allocatedBudget) + budgetDifference;
        
        if (Number(newValue) < Number(sliderValue)) {
            setSliderValue(newValue);
            editPotentialBudgetForCategory(newValue);
            setAllocatedBudget(newAllocatedBudget);
            return;
        }
        // Only allow the change if it wouldn't exceed the total budget
        if (newAllocatedBudget <= Number(potentialTotalBudget)) {
            setSliderValue(newValue);
            editPotentialBudgetForCategory(newValue);
            setAllocatedBudget(newAllocatedBudget);
        } else {
            // If the change would exceed the budget, set the slider to the maximum allowed value
            const maxAllowedValue = Number(sliderValue) + (Number(potentialTotalBudget) - Number(allocatedBudget));
            setSliderValue(maxAllowedValue);
            editPotentialBudgetForCategory(newValue);
            setAllocatedBudget(potentialTotalBudget);
        }
    };

    useEffect(() => {
            if (!hasMounted) {
                setHasMounted(true);
                return;
            }
            setSliderValue(0);
            setAllocatedBudget(0);
    },[potentialTotalBudget]);

    return (
        <Flex 
        align="center"
        justifySelf={"center"} 
        gap={8} 
        w="full" 
        maxW="xl" 
        p={4}
        >
        <Flex w="32" align='center' >
            <Text fontWeight="light" fontSize={14}>{category}</Text>
        </Flex>
        
        <Box flex="1" position="relative">
            <Box
            position="absolute"
            top="-6"
            left={`${(sliderValue / potentialTotalBudget) * 100}%`}
            transform="translateX(-50%)"
            bg="transparent"
            px={2}
            py={1}
            borderRadius="md"
            boxShadow="sm"
            >
                <Text fontSize="sm">{sliderValue}</Text>
            </Box>
            
            {/* Slider component */}
            <Slider
            value={sliderValue}
            min={0}
            max={potentialTotalBudget}
            step={1}
            onChange={handleSliderChange}
            mt={2}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Box>
        </Flex>
    );
};

export default ModalCategoryBudgetSlider;