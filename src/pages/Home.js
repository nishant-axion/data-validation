import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import DataContext from "../context/DataContext";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { csvData, setCsvData } = useContext(DataContext); // ✅ Use context

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data); // ✅ Store data in context
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
      <input type="file" accept=".csv" onChange={handleFileUpload} />
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