import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import DataContext from "../context/DataContext";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { csvData, setCsvData, uploadedFile, setUploadedFile } = useContext(DataContext);
  const fileInputRef = useRef(null); // ✅ Reference for file input
  const [previewData, setPreviewData] = useState([]); // ✅ Store CSV preview

  useEffect(() => {
    // ✅ Restore selected file if it exists
    if (uploadedFile && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(uploadedFile);
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [uploadedFile]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUploadedFile(file); // ✅ Store the file object in context

      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data);

          // ✅ Extract preview: First row of data
          if (result.data.length > 0) {
            const headers = Object.keys(result.data[0]);
            const firstRow = result.data[0];
            const preview = headers.map((col) => [col, firstRow[col]]);
            setPreviewData(preview);
          }
        },
        header: true,
      });
    }
  };

  const handleNext = () => {
    navigate("/define-data-types");
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Upload CSV</h1>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} />

      {uploadedFile && (
        <p className="file-name">Uploaded File: <strong>{uploadedFile.name}</strong></p>
      )}

      {/* ✅ CSV Preview Section */}
      {previewData.length > 0 && (
        <div className="preview-container">
          <h2 className="preview-title">CSV Preview</h2>
          <table className="preview-table">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map(([col, value], index) => (
                <tr key={index}>
                  <td>{col}</td>
                  <td>{value || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {csvData && (
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white p-2 mt-2"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Home;
