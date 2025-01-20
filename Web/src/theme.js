// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
  base: '0px',
  megasmall:'380px',
  xxxs: '445px',
  xxs: '495px',
  xs: '535px',
  sm: '628px',
  md: '868px',
  lg: '960px',
  xl: '1037px',
  '2xl': '1536px',
}

const theme = extendTheme({
  breakpoints,
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
    /* Heading: {
      baseStyle: (props) => ({
        _hover: {
          color: props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
        },
      }),
    }, */
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