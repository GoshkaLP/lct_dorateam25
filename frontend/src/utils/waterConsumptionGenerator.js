/**
 * Генерирует случайные данные потребления воды для ИТП/МКД
 * @param {string} id - ID объекта (itp_id или mkd_id)
 * @returns {Object} Объект с данными потребления воды
 */
export const generateWaterConsumptionData = (id) => {
  // Генерируем случайные значения потребления воды для каждого часа
  // Значения варьируются от 0.01 до 0.5 м³/час
  const generateHourlyConsumption = () => {
    const hours = ["00", "03", "06", "09", "12", "15", "18", "21"];
    const consumption = {};
    
    hours.forEach(hour => {
      // Генерируем более реалистичные значения с учетом времени суток
      let baseValue;
      switch(hour) {
        case "00":
        case "03":
          baseValue = 0.02; // Ночные часы - минимальное потребление
          break;
        case "06":
        case "09":
          baseValue = 0.15; // Утренние часы - среднее потребление
          break;
        case "12":
        case "15":
          baseValue = 0.25; // Дневные часы - высокое потребление
          break;
        case "18":
        case "21":
          baseValue = 0.30; // Вечерние часы - максимальное потребление
          break;
        default:
          baseValue = 0.10;
      }
      
      // Добавляем случайную вариацию ±30%
      const variation = (Math.random() - 0.5) * 0.6; // от -0.3 до +0.3
      consumption[hour] = Math.max(0.01, baseValue + variation);
    });
    
    return consumption;
  };

  return {
    [`${id.includes('itp') ? 'itp_id' : 'mkd_id'}`]: id,
    water_consumption: generateHourlyConsumption()
  };
};

/**
 * Обрабатывает массив данных ИТП/МКД и создает массив с данными потребления воды
 * @param {Array} data - Массив данных из API /api/region/itp
 * @returns {Array} Массив объектов с данными потребления воды
 */
export const processWaterConsumptionData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.map(item => {
    const id = item.id || `unknown_${Date.now()}_${Math.random()}`;
    return generateWaterConsumptionData(id);
  });
};

/**
 * Обновляет существующие данные ИТП/МКД, добавляя информацию о потреблении воды
 * @param {Array} existingData - Существующие данные ИТП/МКД
 * @param {Array} waterConsumptionData - Данные потребления воды
 * @returns {Array} Объединенные данные
 */
export const mergeWaterConsumptionData = (existingData, waterConsumptionData) => {
  if (!Array.isArray(existingData) || !Array.isArray(waterConsumptionData)) {
    return existingData || [];
  }

  return existingData.map(item => {
    const waterData = waterConsumptionData.find(waterItem => 
      waterItem.itp_id === item.id || waterItem.mkd_id === item.id
    );
    
    return {
      ...item,
      water_consumption: waterData ? waterData.water_consumption : null
    };
  });
};
