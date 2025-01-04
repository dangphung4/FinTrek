import { createTheme } from '@mui/material/styles';

// Barebones Material-UI theme
const muiTheme = (themeMode) => {
    const isDarkMode = themeMode === 'dark';

    return createTheme({
        palette: {
            mode: themeMode,
            // Define primary and secondary colors
            primary: {
                main: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Default Material-UI primary color
            },
            secondary: {
              main: '#dc004e', // Default Material-UI secondary color
            },
            background: {
                default: '#dc004e', // Default background
            },
            text: {
                primary: isDarkMode ? '#fff' : '#000', // Primary text color
                secondary: '#555', // Secondary text color
            },
        },
        typography: {
            fontFamily: "Segoe UI", //'"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
            fontSize: 14, // Base font size
        },
        components: {
            MuiTablePagination: {
                styleOverrides: {
                    root: {
                        //backgroundColor: '#dc004e', // Example
                        borderBottom: 'none',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDarkMode ? '#90cdf4' : '#3182ce', // Example
                        borderColor: isDarkMode ? '#90cdf4' : '#3182ce',
                        color: isDarkMode ? '#1a202c' : '#fff',
                        '&:hover': {
                            backgroundColor: isDarkMode ? '#6cb2ec' : '#376aaf'
                        },
                    },
                },
            },   
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: isDarkMode ? '1px solid #90cdf4' : '1px solid #3182ce',
                    },
                },
            },
            MuiPickersDay: {
                styleOverrides: {
                root: {
                    backgroundColor: 'transparent', // Default state background
                    color: themeMode === 'dark' ? '#fff' : '#000', // Default state text
                    '&:hover': {
                        backgroundColor: '#3182ce', // Hover state background
                        color: '#fff', // Hover state text
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#3182ce', // Selected state background
                        color: '#fff', // Selected state text
                    },
                },
                today: {
                    borderColor: '#90cdf4', // Outline for "today"
                    borderWidth: 2,
                },
                },
            },
            MuiCalendarPicker: {
                styleOverrides: {
                root: {
                    backgroundColor: themeMode === 'dark' ? '#1a202c' : '#fff', // Calendar picker background
                },
                },
            },
            MuiPaper:{
                styleOverrides: {
                    root: {
                        backgroundColor: themeMode === 'dark' ? '#1a202c' : '#fff', // Calendar picker background
                        backgroundImage: 'none'
                    },
                },
            }  
        },
        breakpoints: {
            values: {
                xs: 0,
                xs_2: 457,
                xs_1_2: 520,
                xs_1: 544,
                sm: 600,
                md: 868,
                md_3: 900,
                md_2: 1050,
                md_1: 1160,
                lg: 1280,
                xl: 1920,
            },
        },
    });
}

export default muiTheme;
