import React, { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";

const BudgetWindowSelect = ({ onWindowChange }) => {
    const [selectedWindow, setSelectedWindow] = useState(() => {
        // Load initial value from local storage or default to year as the budget window
        return localStorage.getItem("budgetWindow") || "Year";
    });

    useEffect(() => {
        // Update local storage with window and notify parent component on change so it knows the (potentially) new window
        localStorage.setItem("budgetWindow", selectedWindow);
        onWindowChange(selectedWindow);
    }, [selectedWindow]); // function executes upon 

    return (
        <Select
            value={selectedWindow}
            onChange={(e) => setSelectedWindow(e.target.value)}
            size="md"
            width={'62px'}
            mb={5}
        >
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
        </Select>
    );
};

export default BudgetWindowSelect;
