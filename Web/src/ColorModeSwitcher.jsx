import React, { useContext } from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useThemeContext } from "./context/themeContext";


export const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const { setColorMode } = useThemeContext(); // Set themeMode in context

  const handleToggle = () => {
    toggleColorMode(); // Chakra's toggle
    setColorMode(text); // Update ThemeContext
  };

  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${text} mode`}
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={handleToggle}
      icon={<SwitchIcon />}
      {...props}
    />
  );
};