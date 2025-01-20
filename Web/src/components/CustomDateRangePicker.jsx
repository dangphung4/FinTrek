//using v5 datepicker
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  ThemeProvider,
  TextField 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  subMonths 
} from 'date-fns';

import { useThemeContext } from '../context/themeContext';
import muiTheme from '../muiTheme';


function CustomDateRangePicker({ 
  value, 
  onChange, 
  fullWidth = false 
}) {
  //using context to get themeMode to use proper mui theme
  const { themeMode } = useThemeContext();
  const muiThemeModed = muiTheme(themeMode);

  const [localDateRange, setLocalDateRange] = useState(value || [null, null]);

  // Date range shortcuts
  const dateShortcuts = [
    { 
      label: 'Last 7 Days', 
      getValue: () => [
        startOfDay(subDays(new Date(), 6)), 
        endOfDay(new Date())
      ] 
    },
    { 
      label: 'This Month', 
      getValue: () => [
        startOfDay(startOfMonth(new Date())), 
        endOfDay(new Date())
      ] 
    },
    { 
      label: 'Last Month', 
      getValue: () => [
        startOfDay(startOfMonth(subMonths(new Date(), 1))),
        endOfDay(endOfMonth(subMonths(new Date(), 1)))
      ] 
    },
    { 
      label: 'Last 3 Months', 
      getValue: () => [
        startOfDay(startOfMonth(subMonths(new Date(), 2))), 
        endOfDay(new Date())
      ] 
    },
    { 
      label: 'Last 6 Months', 
      getValue: () => [
        startOfDay(startOfMonth(subMonths(new Date(), 5))), 
        endOfDay(new Date())
      ] 
    },
    { 
      label: 'Last Year', 
      getValue: () => [
        startOfDay(subMonths(new Date(), 11)), 
        endOfDay(new Date())
      ] 
    }
  ];

  // Handle shortcut selection
  const handleShortcutSelect = (shortcut) => {
    const newDateRange = shortcut.getValue();
    setLocalDateRange(newDateRange);
    onChange(newDateRange);
  };

  // Handle start date change
  const handleStartDateChange = (newValue) => {
    const newDateRange = [
      newValue ? startOfDay(newValue) : null, 
      localDateRange?.[1] || null
    ];
    
    // If only start date is selected, set end date to the latest possible date
    if (newValue && !localDateRange?.[1]) {
      newDateRange[1] = endOfDay(new Date());
    }

    setLocalDateRange(newDateRange);
    onChange(newDateRange);
  };

  // Handle end date change
  const handleEndDateChange = (newValue) => {
    const newDateRange = [
      localDateRange?.[0] || null, 
      newValue ? endOfDay(newValue) : null
    ];
    
    // If only end date is selected, set start date to the earliest possible date
    if (newValue && !localDateRange?.[0]) {
      newDateRange[0] = startOfDay(new Date(0)); // Unix epoch start
    }

    setLocalDateRange(newDateRange);
    onChange(newDateRange);
  };

  return (
    <ThemeProvider theme={muiThemeModed}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2 
        }}>
          {/* Shortcuts */}
          <Box
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: { xs: 'row', sm: 'column' }, 
              flexWrap: 'wrap', 
              gap: 1, 
              width: { xs: '100%', sm: '50%' }, 
              height: 'fit-content', 
              border: '1px solid', 
              borderColor: 'divider', // Matches the Paper variant="outlined"
              borderRadius: 1 // Similar to Paper's rounded corners
            }}
          >
            {dateShortcuts.map((shortcut) => (
              <Button
                key={shortcut.label}
                variant="text"
                onClick={() => handleShortcutSelect(shortcut)}
                sx={{ 
                  width: { xs: '200%', sm: '100%' }, 
                  justifyContent: 'center' 
                }}
              >
                {shortcut.label}
              </Button>
            ))}
          </Box>

          {/* Date Pickers */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            flex: 1,
          }}>
            <DatePicker
              label="Start Date"
              value={localDateRange?.[0] || null}
              onChange={handleStartDateChange}
              renderInput={(params) => (
                <TextField 
                {...params} 
                fullWidth={fullWidth} 
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff', // Hover state
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Focused state
                    },
                  },
                }}
                />
              )}
            />
            <DatePicker
              label="End Date"
              value={localDateRange?.[1] || null}
              onChange={handleEndDateChange}
              renderInput={(params) => (
                <TextField 
                {...params} 
                fullWidth={fullWidth} 
                variant="outlined" 
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fff', // Hover state
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: themeMode === 'dark' ? '#90cdf4' : '#3182ce', // Focused state
                    }
                  }
                }}
                />
              )}
            />
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default CustomDateRangePicker;