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

const ModalCategoryBudgetSlider = ({ category }) => {
    const { allocatedBudget, setAllocatedBudget, totalBudget, reset } = useBudget();
    const [sliderValue, setSliderValue] = useState(0);
    
    const handleSliderChange = (newValue) => {
        // Calculate how much this slider's change would affect the total allocated budget
        const budgetDifference = newValue - sliderValue;
        const newAllocatedBudget = allocatedBudget + budgetDifference;
        
        // Only allow the change if it wouldn't exceed the total budget
        if (newAllocatedBudget <= totalBudget) {
            setSliderValue(newValue);
            setAllocatedBudget(newAllocatedBudget);
        } else {
            // If the change would exceed the budget, set the slider to the maximum allowed value
            const maxAllowedValue = sliderValue + (totalBudget - allocatedBudget);
            setSliderValue(maxAllowedValue);
            setAllocatedBudget(totalBudget);
        }
    };

    useEffect(() => {
            setSliderValue(0);
    },[reset]);

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
            left={`${(sliderValue / totalBudget) * 100}%`}
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
            max={totalBudget}
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