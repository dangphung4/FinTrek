import { 
    Box as MUIBox, 
    Typography as MUITypography, 
    Button as MUIButton, 
    Drawer as MUIDrawer,
    Checkbox as MUICheckbox,
    FormGroup as MUIFormGroup,
    FormControlLabel as MUIFormControlLabel,
    TextField as MUITextField,
    Grid as MUIGrid,
    ThemeProvider
} from '@mui/material';
import muiTheme from '../muiTheme';
import { useThemeContext } from '../context/themeContext'; 
import CustomDateRangePicker from './CustomDateRangePicker';


export default function TransactionFilterDrawer({
    filterDrawerOpen,
    setFilterDrawerOpen,
    amountFilter,
    setAmountFilter,
    dateFilter,
    setDateFilter,
    uniqueAccounts,
    selectedAccounts,
    setSelectedAccounts,
    uniqueCategories,
    selectedCategories,
    setSelectedCategories,
    resetFilters,
}){
    //using context to get themeMode to use proper mui theme
    const { themeMode } = useThemeContext();
    const muiThemeModed = muiTheme(themeMode);


    return(
        <ThemeProvider theme={muiThemeModed}>
            <MUIDrawer
                anchor="top"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{ 
                    sx: { 
                        maxHeight: 'calc(60vh)', 
                        borderBottomLeftRadius: 16, 
                        borderBottomRightRadius: 16,
                        p: 3,
                        pl:{
                            xs: 7,
                            md: 3,
                        },
                        /* pr:{
                            xs: 7,
                            md: 3,
                        }, */
                        pt:{
                            xs: 2,
                            md: 3,
                        },
                        backgroundColor: themeMode === 'dark' ? '#1b202c': '#fff',
                        backgroundImage:'none',
                    } 
                }}
            >
            <MUIGrid container spacing={3} sx={{ mb: 2, pr: 4 }}>
                {/* Amount Filter */}
                <MUIGrid item xs={12} md_1={3}>
                    <MUITypography variant="h6" gutterBottom textAlign={'center'}>Amount Range</MUITypography>
                    <MUIBox display="flex" gap={2}>
                        <MUITextField 
                            label="Min Amount" 
                            type="number"
                            value={amountFilter.min}
                            onChange={(e) => setAmountFilter(prev => ({ ...prev, min: e.target.value }))}
                            fullWidth
                        />
                        <MUITextField 
                            label="Max Amount" 
                            type="number"
                            value={amountFilter.max}
                            onChange={(e) => setAmountFilter(prev => ({ ...prev, max: e.target.value }))}
                            fullWidth
                        />
                    </MUIBox>
                </MUIGrid>

                {/* Date Range Picker */}
                <MUIGrid item xs={12} md_1={3}>
                    <MUITypography variant="h6" gutterBottom textAlign={'center'}>Date Range</MUITypography>
                    <CustomDateRangePicker 
                        value={dateFilter}
                        onChange={setDateFilter}
                        fullWidth
                    />
                </MUIGrid>

                {/* Account Filter */}
                <MUIGrid item xs={12} xs_2={6} md_1={3}>
                    <MUITypography variant="h6" gutterBottom textAlign={'center'}>Accounts</MUITypography>
                    <MUIFormGroup>
                        {uniqueAccounts.map(account => (
                        <MUIFormControlLabel
                            sx={{
                                justifyContent: 'center'
                            }}
                            key={account}
                            control={
                                <MUICheckbox
                                    checked={selectedAccounts.includes(account)}
                                    onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSelectedAccounts(prev => 
                                        isChecked 
                                        ? [...prev, account]
                                        : prev.filter(a => a !== account)
                                    );
                                    }}
                                />
                            }
                            label={account}
                        />
                        ))}
                    </MUIFormGroup>
                </MUIGrid>

                {/* Category Filter */}
                <MUIGrid item xs={12} xs_2={6} md_1={3}>
                    <MUITypography variant="h6" gutterBottom textAlign={'center'}>Categories</MUITypography>
                    <MUIFormGroup>
                        {uniqueCategories.map(category => (
                        <MUIFormControlLabel
                            sx={{
                                justifyContent: 'center'
                            }}
                            key={category}
                            control={
                            <MUICheckbox
                                checked={selectedCategories.includes(category)}
                                onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedCategories(prev => 
                                    isChecked
                                    ? [...prev, category]
                                    : prev.filter(c => c !== category)
                                );
                                }}
                            />
                            }
                            label={category}
                        />
                        ))}
                    </MUIFormGroup>
                </MUIGrid>
            </MUIGrid>
            {/* Action Buttons */}
            <MUIGrid item xs={12} sx={{ pr: 0, mr: 0 }}>
                <MUIBox display="flex" justifyContent="flex-end" gap={2} sx={{ justifyContent: { xs: 'center', xs_1: 'flex-end' }, pr: { xs: 4 ,xs_1: 0 } }}>
                    <MUIButton 
                    variant="outlined" 
                    onClick={resetFilters}
                    >
                    Reset Filters
                    </MUIButton>
                    <MUIButton 
                    variant="contained" 
                    onClick={() => setFilterDrawerOpen(false)}
                    >
                    Apply Filters
                    </MUIButton>
                </MUIBox>
            </MUIGrid>
            </MUIDrawer>
        </ThemeProvider>
    );
}