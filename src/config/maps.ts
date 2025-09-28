// Конфигурация для Yandex Maps API
export const MAPS_CONFIG = {
  // Для демо-версии используем публичный ключ или оставляем пустым
  // В продакшене замените на ваш API ключ от Yandex
  API_KEY: '',
  
  // Центр Москвы
  MOSCOW_CENTER: [37.6176, 55.7558] as [number, number],
  
  // Настройки карты по умолчанию
  DEFAULT_ZOOM: 10,
  
  // URL для API (без ключа для демо)
  API_URL: 'https://api-maps.yandex.ru/v3/?lang=ru_RU'
}

// Альтернативный способ - проверяем есть ли переменная окружения
export const getApiKey = (): string => {
  return import.meta.env.VITE_YANDEX_MAPS_API_KEY || MAPS_CONFIG.API_KEY
}
