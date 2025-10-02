import React, { createContext, useContext, useMemo, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [testData, setTestData] = useState(null);
  const [apiVersion, setApiVersion] = useState(null);
  const [regions, setRegions] = useState([]);

  const contextValue = useMemo(() => ({
    testData,
    setTestData,
    apiVersion,
    setApiVersion,
    regions,
    setRegions,
  }), [testData, apiVersion, regions]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
