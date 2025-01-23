import React, { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";

const BudgetWindowSelect = ({ onWindowChange }) => {
    const [selectedWindow, setSelectedWindow] = useState(() => {
        // Load initial value from local storage or default to year as the budget window
        return localStorage.getItem("budgetWindow") || "Year";
    });

    useEffect(() => {
        // Update local storage with window and notify parent component on change so it knows the (potentially) new window
        localStorage.setItem("budgetWindow", selectedWindow); // stored in local storage so user doesn't get annoyed having to redo this step everytime they log on
        onWindowChange(selectedWindow); //window (week, month, or year) is passed back up to parent function (Budget page)
    }, [selectedWindow]); // function executes upon mount and also selectedWindow variable change, which happens whenever an option is selected 

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
