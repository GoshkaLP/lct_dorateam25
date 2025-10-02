// API утилиты для работы с данными ИТП и МКД

/**
 * Загружает данные ИТП из API
 * @param {string} regionId - ID региона
 * @returns {Promise<Array>} Массив данных ИТП
 */
export const fetchItpData = async (regionId) => {
  try {
    const response = await fetch(`/api/region/itp?region=${regionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке данных ИТП:', error);
    throw error;
  }
};

/**
 * Загружает данные МКД из API
 * @param {string} regionId - ID региона
 * @returns {Promise<Array>} Массив данных МКД
 */
export const fetchMkdData = async (regionId) => {
  try {
    const response = await fetch(`/api/region/mkd?region=${regionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке данных МКД:', error);
    throw error;
  }
};

/**
 * Пример использования с DataContext:
 * 
 * import { useData } from '../components/Filters/components/DataContext/DataContext';
 * import { fetchItpData } from '../utils/api';
 * 
 * const { processItpDataWithWaterConsumption } = useData();
 * 
 * const loadItpData = async (regionId) => {
 *   try {
 *     const itpData = await fetchItpData(regionId);
 *     processItpDataWithWaterConsumption(itpData);
 *   } catch (error) {
 *     console.error('Ошибка загрузки данных ИТП:', error);
 *   }
 * };
 */
