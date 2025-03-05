import React, { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [csvData, setCsvData] = useState(null);
  const [dataTypes, setDataTypes] = useState({});

  return (
    <DataContext.Provider
      value={{ csvData, setCsvData, dataTypes, setDataTypes }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;