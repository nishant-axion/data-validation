import React, { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import './DefineDataTypes.css';  // Import the CSS file

const DefineDataTypes = () => {
    const navigate = useNavigate();
    const { csvData, dataTypes, setDataTypes } = useContext(DataContext);

    // ✅ Memoize columns to prevent unnecessary recalculations
    const columns = useMemo(() => (csvData ? Object.keys(csvData[0]) : []), [csvData]);

    // ✅ Fix: Initialize dataTypes only once
    useEffect(() => {
        if (csvData && Object.keys(dataTypes).length === 0) {
            setDataTypes(columns.reduce((acc, col) => ({ ...acc, [col]: "string" }), {}));
        }
    }, [csvData, setDataTypes, columns, dataTypes]);

    if (!csvData) {
        return <p className="no-data-message">No data found. Please upload a CSV file.</p>;
    }

    const handleChange = (e, column) => {
        setDataTypes({ ...dataTypes, [column]: e.target.value });
    };

    const handleSubmit = () => {
        navigate("/validate-data");
    };

    return (
        <div className="container">
            <h1>Define Data Types</h1>
            {columns.map((col) => (
                <div key={col} className="mb-2">
                    <label>{col}: </label>
                    <select value={dataTypes[col]} onChange={(e) => handleChange(e, col)}>
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="list1">List1 (Comma-separated: a,b,c)</option>
                        <option value="list2">List2 (JSON Array: ["a","b","c"])</option>
                    </select>
                </div>
            ))}
            <button onClick={handleSubmit}>Validate</button>
        </div>
    );
};

export default DefineDataTypes;
