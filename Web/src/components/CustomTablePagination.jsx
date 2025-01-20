import React, { useState } from 'react';
import {
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
    Tooltip,
    ThemeProvider
} from '@mui/material';
import muiTheme from '../muiTheme';
import { useThemeContext } from '../context/themeContext'; 
import { FaPlus } from 'react-icons/fa';


function CustomTablePagination({
    rowsPerPageOptions,
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
    setRowsPerPageOptionsArr
}) {
    //using context to get themeMode to use proper mui theme
    const { themeMode } = useThemeContext();
    const muiThemeModed = muiTheme(themeMode);


    const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
    const [customRowsPerPage, setCustomRowsPerPage] = useState('');


    // Handler for custom dialog confirmation
    const handleCustomDialogConfirm = () => {
        // Validate input
        const parsedValue = parseInt(customRowsPerPage, 10);
        
        if (!isNaN(parsedValue) && parsedValue > 0) {
            // Create a synthetic event to match MUI's expected interface
            onRowsPerPageChange({ target: { value: parsedValue } });

            // Update the local storage array
            const storedArray = JSON.parse(localStorage.getItem('customRowsPerPage')) || [];
            if (!storedArray.includes(parsedValue)) {
                const updatedArray = [...storedArray, parsedValue].sort((a, b) => a - b);
                localStorage.setItem('customRowsPerPage', JSON.stringify(updatedArray));
            }

            setRowsPerPageOptionsArr((prev) => [...prev, parsedValue].sort((a,b) => { return a - b }));
            setIsCustomDialogOpen(false);
        } else {
            // Optional: Add error handling for invalid input
            alert('Please enter a valid number greater than 0');
        }
    };


    return (
        <ThemeProvider theme={muiThemeModed}>
            <Box display="flex" justifyContent="flex-end" alignItems="center" width="100%" >
                <TablePagination
                    rowsPerPageOptions={rowsPerPageOptions}
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    sx={{
                        pr:1,
                        // Make elements closer together
                        '.MuiTablePagination-toolbar': {
                        minHeight: '32px', // Adjust overall height
                        padding: 0, // Remove padding
                        margin:0
                        },
                        '.MuiTablePagination-displayedRows': {
                        display: 'none', // Hide the label and range text
                        
                        },
                        '.MuiTablePagination-actions': {
                        margin: 0, // Remove margin between actions
                        padding:0
                        },
                        '.MuiTablePagination-select': {
                        fontSize: '0.875rem', // Adjust font size of dropdown
                        paddingLeft:0,
                        paddingRight:0,
                        margin:0
                        },
                        '.MuiInputBase-root':{
                            margin:0
                        },
                        '.MuiButtonBase-root':{
                            pr:0,
                            pl:1,
                            ml:0.5
                        }
                    }}
                />
            
                {/* Custom Input Button */}
                <Tooltip title="Custom Rows per Page">
                    <IconButton
                    onClick={() => setIsCustomDialogOpen(true)}
                    sx={{
                        color: themeMode === 'dark' ? '#fff' : '#000', // Explicitly sets the icon color
                    }}
                    >
                        <FaPlus />
                    </IconButton>
                </Tooltip>


                {/* Custom Rows Per Page Dialog */}
                <Dialog
                    open={isCustomDialogOpen}
                    onClose={() => setIsCustomDialogOpen(false)}
                >
                    <DialogTitle>Custom Rows Per Page</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Rows per page"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={customRowsPerPage}
                            onChange={(e) => setCustomRowsPerPage(e.target.value)}
                            inputProps={{
                            min: 1,
                            step: 1
                            }}
                            placeholder="Enter # of rows"
                            helperText="Enter a positive # of rows to display"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCustomDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCustomDialogConfirm}>
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}


export default CustomTablePagination;