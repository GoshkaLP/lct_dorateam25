import React, { useState } from 'react';
import { useData } from '../Filters/components/DataContext/DataContext';
import { processWaterConsumptionData } from '../../utils/waterConsumptionGenerator';
import './WaterConsumptionTest.css';

const WaterConsumptionTest = () => {
  const { processItpDataWithWaterConsumption, waterConsumptionData } = useData();
  const [testData, setTestData] = useState(null);

  // Тестовые данные в формате API
  const mockItpData = [
    {
      "latitude": 55.7558,
      "longitude": 37.6176,
      "id": "itp_001",
      "district": "Центральный",
      "region": "Москва",
      "dispatcher": "Иванов И.И.",
      "status": "Оранжевый"
    },
    {
      "latitude": 55.7558,
      "longitude": 37.6176,
      "id": "itp_002",
      "district": "Северный",
      "region": "Москва",
      "dispatcher": "Петров П.П.",
      "status": "Зеленый"
    },
    {
      "latitude": 55.7558,
      "longitude": 37.6176,
      "id": "mkd_001",
      "district": "Южный",
      "region": "Москва",
      "dispatcher": "Сидоров С.С.",
      "status": "Красный"
    }
  ];

  const handleTestItpData = () => {
    processItpDataWithWaterConsumption(mockItpData);
    setTestData(mockItpData);
  };

  const handleTestWaterGeneration = () => {
    const waterData = processWaterConsumptionData(mockItpData);
    setTestData(waterData);
  };

  const formatWaterConsumption = (consumption) => {
    if (!consumption) return 'Нет данных';
    
    return Object.entries(consumption)
      .map(([hour, value]) => `${hour}:00 - ${value.toFixed(3)} м³/ч`)
      .join(', ');
  };

  return (
    <div className="water-consumption-test">
      <h2>Тестирование генерации данных потребления воды</h2>
      
      <div className="test-controls">
        <button onClick={handleTestItpData} className="test-button">
          Тест обработки ИТП данных
        </button>
        <button onClick={handleTestWaterGeneration} className="test-button">
          Тест генерации потребления воды
        </button>
      </div>

      <div className="test-results">
        <h3>Результаты тестирования:</h3>
        
        {testData && (
          <div className="test-data">
            <h4>Сгенерированные данные:</h4>
            <pre>{JSON.stringify(testData, null, 2)}</pre>
          </div>
        )}

        {waterConsumptionData.length > 0 && (
          <div className="water-consumption-results">
            <h4>Данные потребления воды в хранилище:</h4>
            {waterConsumptionData.map((item, index) => (
              <div key={index} className="consumption-item">
                <h5>ID: {item.itp_id || item.mkd_id}</h5>
                <div className="consumption-details">
                  {formatWaterConsumption(item.water_consumption)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterConsumptionTest;
