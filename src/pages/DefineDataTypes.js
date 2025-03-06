import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import './DefineDataTypes.css';  // Import the CSS file

const DefineDataTypes = () => {
    const navigate = useNavigate();
    const { csvData, dataTypes, setDataTypes } = useContext(DataContext);
    const [previewData, setPreviewData] = useState([]); // ✅ Store CSV preview

    // ✅ Memoize columns to prevent unnecessary recalculations
    const columns = useMemo(() => (csvData ? Object.keys(csvData[0]) : []), [csvData]);

    // ✅ Initialize dataTypes only once and set preview
    useEffect(() => {
        if (csvData && Object.keys(dataTypes).length === 0) {
            setDataTypes(columns.reduce((acc, col) => ({ ...acc, [col]: "string" }), {}));
        }

        // ✅ Extract preview: First row of data
        if (csvData && csvData.length > 0) {
            const firstRow = csvData[0];
            const preview = columns.map((col) => [col, firstRow[col]]);
            setPreviewData(preview);
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

            {/* ✅ CSV Preview Section */}
            {previewData.length > 0 && (
                <div className="preview-container">
                    <h2 className="preview-title">CSV Preview</h2>
                    <table className="preview-table">
                        <thead>
                            <tr>
                                <th>Column Name</th>
                                <th>First Value</th>
                                <th>Data Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {previewData.map(([col, value], index) => (
                                <tr key={index}>
                                    <td>{col}</td>
                                    <td>{value || "N/A"}</td>
                                    <td>
                                        <select value={dataTypes[col]} onChange={(e) => handleChange(e, col)}>
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="date">Date</option>
                                            <option value="list1">List1 (Comma-separated: a,b,c)</option>
                                            <option value="list2">List2 (JSON Array: ["a","b","c"])</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button onClick={handleSubmit}>Validate</button>
        </div>
    );
};

export default DefineDataTypes;
