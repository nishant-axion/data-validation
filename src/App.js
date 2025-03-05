import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DefineDataTypes from "./pages/DefineDataTypes";
import ValidateData from "./pages/ValidateData";
import { DataProvider } from "./context/DataContext"; // ✅ Import the provider

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/define-data-types" element={<DefineDataTypes />} />
          <Route path="/validate-data" element={<ValidateData />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;