import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [testData, setTestData] = useState(null);
  const [apiVersion, setApiVersion] = useState(null);

  return (
    <DataContext.Provider
      value={{ testData, setTestData, apiVersion, setApiVersion }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
