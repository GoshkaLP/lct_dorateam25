import React, { createContext, useContext, useMemo, useState } from "react";
import { 
  processWaterConsumptionData, 
  mergeWaterConsumptionData 
} from "../../../../utils/waterConsumptionGenerator";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [testData, setTestData] = useState(null);
  const [apiVersion, setApiVersion] = useState(null);
  const [regions, setRegions] = useState([]);
  const [itpFilters, setItpFilters] = useState({});
  const [itpData, setItpData] = useState({ data: [], loading: false, error: null });
  const [mkdData, setMkdData] = useState({ data: [], loading: false, error: null });
  const [linesData, setLinesData] = useState({ data: [], loading: false, error: null });
  const [rectangle, setRectangle] = useState(null);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [waterConsumptionData, setWaterConsumptionData] = useState([]);
  const [notification, setNotification] = useState(null);

  // Функция для обработки данных ИТП с генерацией потребления воды
  const processItpDataWithWaterConsumption = (itpApiData) => {
    if (!Array.isArray(itpApiData)) return;
    
    // Подсчитываем ИТП с оранжевым статусом
    const orangeStatusCount = itpApiData.filter(item => item.status === 'Оранжевый').length;
        
    // Показываем уведомление, если есть ИТП с оранжевым статусом
    if (orangeStatusCount > 0) {
      setNotification({
        type: 'warning',
        message: `Обнаружено ${orangeStatusCount} ИТП с оранжевым статусом, требующих внимания`,
        count: orangeStatusCount
      });
    } else {
    }
    
    // Генерируем данные потребления воды
    const waterData = processWaterConsumptionData(itpApiData);
    setWaterConsumptionData(waterData);
    
    // Обновляем данные ИТП с информацией о потреблении воды
    const enrichedItpData = mergeWaterConsumptionData(itpApiData, waterData);
    setItpData(prev => ({
      ...prev,
      data: enrichedItpData,
      loading: false,
      error: null
    }));
  };

  // Функция для обработки данных МКД с генерацией потребления воды
  const processMkdDataWithWaterConsumption = (mkdApiData) => {
    if (!Array.isArray(mkdApiData)) return;
    
    // Генерируем данные потребления воды
    const waterData = processWaterConsumptionData(mkdApiData);
    setWaterConsumptionData(prev => [...prev, ...waterData]);
    
    // Обновляем данные МКД с информацией о потреблении воды
    const enrichedMkdData = mergeWaterConsumptionData(mkdApiData, waterData);
    setMkdData(prev => ({
      ...prev,
      data: enrichedMkdData,
      loading: false,
      error: null
    }));
  };

  // Функция для закрытия уведомления
  const clearNotification = () => {
    setNotification(null);
  };

  const contextValue = useMemo(() => {
    return {
      testData,
      setTestData,
      apiVersion,
      setApiVersion,
      regions,
      setRegions,
      itpFilters,
      setItpFilters,
      itpData,
      setItpData,
      mkdData,
      setMkdData,
      linesData,
      setLinesData,
      rectangle,
      setRectangle,
      selectedObjects,
      setSelectedObjects,
      waterConsumptionData,
      setWaterConsumptionData,
      processItpDataWithWaterConsumption,
      processMkdDataWithWaterConsumption,
      notification,
      clearNotification,
    };
  }, [testData, apiVersion, regions, itpFilters, itpData, mkdData, linesData, rectangle, selectedObjects, waterConsumptionData, notification]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
