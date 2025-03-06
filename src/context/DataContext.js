import React, { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [csvData, setCsvData] = useState(null);
  const [dataTypes, setDataTypes] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  return (
    <DataContext.Provider
      value={{ csvData, setCsvData, dataTypes, setDataTypes,uploadedFile, setUploadedFile,previewData, setPreviewData}}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;