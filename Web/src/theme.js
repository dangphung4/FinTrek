// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
      h1: {

      }
    }),
  },
  components: {
    Button: {
      baseStyle: (props) => ({
        _hover: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
        },
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        _hover: {
          color: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
        },
      }),
    },
    Box: {
      baseStyle: (props) => ({
        _hover: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        },
      }),
    },
    MenuList: {
      baseStyle: (props) => ({
        _hover: {
          borderColor: props.colorMode === 'dark' ? 'gray.200' : 'gray.700',
        },
      }),
    },
  },

});

export default theme;