import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import "./validateData.css"; // ✅ Ensure CSS file is correctly imported

const ValidateData = () => {
    const navigate = useNavigate();
    const { csvData, dataTypes } = useContext(DataContext);
    const [expandedColumns, setExpandedColumns] = useState({}); // Track which columns are expanded

    if (!csvData || !dataTypes) {
        return <p className="text-red-500">Invalid data. Please start over.</p>;
    }

    const errors = {};
    const listColumns = {}; // Store whether a column has multiple values

    // Identify list columns
    Object.keys(dataTypes).forEach((col) => {
        if (dataTypes[col] === "list1" || dataTypes[col] === "list2") {
            listColumns[col] = csvData.some((row) => row[col]?.includes(",") || row[col]?.startsWith("["));
        }
    });

    // Validate data
    csvData.forEach((row, rowIndex) => {
        Object.keys(row).forEach((col) => {
            const value = row[col]?.trim();
            const type = dataTypes[col];

            // Validate Number
            if (type === "number") {
                const cleanedValue = value.replace(/,/g, "");
                if (isNaN(Number(cleanedValue))) {
                    errors[col] = errors[col] || [];
                    errors[col].push(`Row ${rowIndex + 1}: "${value}" is not a valid number.`);
                }
            }

            // Validate Boolean
            if (type === "boolean") {
                if (!["true", "false"].includes(value.toLowerCase())) {
                    errors[col] = errors[col] || [];
                    errors[col].push(`Row ${rowIndex + 1}: "${value}" is not a boolean (true/false).`);
                }
            }

            // Validate Date
            if (type === "date") {
                const parsedDate = Date.parse(value);
                if (isNaN(parsedDate)) {
                    errors[col] = errors[col] || [];
                    errors[col].push(`Row ${rowIndex + 1}: "${value}" is not a valid date.`);
                }
            }

            // Validate List1 (Comma-separated)
            if (type === "list1") {
                if (listColumns[col]) {
                    const items = value.split(",").map((item) => item.trim());
                    if (items.some((item) => item === "")) {
                        errors[col] = errors[col] || [];
                        errors[col].push(`Row ${rowIndex + 1}: "${value}" contains empty list items.`);
                    }
                }
            }

            // ✅ Validate List2 (JSON Array Format)
            if (type === "list2") {
                try {
                    let correctedValue = value
                        .replace(/'/g, '"') // Convert single quotes to double quotes
                        .trim();

                    const parsedArray = JSON.parse(correctedValue);

                    if (!Array.isArray(parsedArray) || parsedArray.some((item) => typeof item !== "string")) {
                        throw new Error();
                    }
                } catch (error) {
                    errors[col] = errors[col] || [];
                    errors[col].push(`Row ${rowIndex + 1}: "${value}" is not a valid JSON array format (["a", "b", "c"]).`);
                }
            }
        });
    });

    // Toggle error visibility for a column
    const toggleColumnErrors = (col) => {
        setExpandedColumns((prev) => ({
            ...prev,
            [col]: !prev[col], // Toggle expansion state
        }));
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">Validation Results</h1>

            {Object.keys(errors).length > 0 ? (
                <div className="error-container">
                    <h2 className="text-red-500 font-bold">Errors Found:</h2>
                    {Object.keys(errors).map((col) => (
                        <div key={col} className="error-section">
                            <button
                                className="error-toggle"
                                onClick={() => toggleColumnErrors(col)}
                            >
                                {expandedColumns[col] ? "▼" : "▶"} {col}
                            </button>
                            {expandedColumns[col] && (
                                <ul className="error-list">
                                    {errors[col].map((err, i) => (
                                        <li key={i} className="error-item">{err}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <h2 className="text-green-500 font-bold success-message">Upload Successful! ✅</h2>
            )}

            <button onClick={() => navigate("/")} className="upload-btn">
                Upload Another CSV
            </button>
        </div>
    );
};

export default ValidateData;
