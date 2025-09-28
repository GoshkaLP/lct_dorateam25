// Утилита для валидации API ключа Yandex Maps

export interface ApiKeyValidationResult {
  isValid: boolean
  error?: string
  details?: string
}

export const validateYandexMapsApiKey = async (apiKey: string): Promise<ApiKeyValidationResult> => {
  if (!apiKey) {
    return {
      isValid: false,
      error: 'API ключ пустой',
      details: 'Ключ не был предоставлен'
    }
  }

  // Проверяем формат UUID (Yandex использует UUID для API ключей)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(apiKey)) {
    return {
      isValid: false,
      error: 'Неверный формат API ключа',
      details: 'API ключ должен быть в формате UUID (например: 12345678-1234-1234-1234-123456789abc)'
    }
  }

  try {
    // Пытаемся сделать запрос к API для проверки ключа
    const testUrl = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`
    
    // Используем dynamic import для создания script элемента и проверки загрузки
    return new Promise<ApiKeyValidationResult>((resolve) => {
      const testScript = document.createElement('script')
      testScript.src = testUrl
      testScript.async = true
      
      const timeout = setTimeout(() => {
        document.head.removeChild(testScript)
        resolve({
          isValid: false,
          error: 'Таймаут при загрузке API',
          details: 'API не ответил в течение 10 секунд'
        })
      }, 10000)

      testScript.onload = () => {
        clearTimeout(timeout)
        document.head.removeChild(testScript)
        resolve({
          isValid: true,
          details: 'API ключ валиден и API загружается успешно'
        })
      }

      testScript.onerror = () => {
        clearTimeout(timeout)
        document.head.removeChild(testScript)
        resolve({
          isValid: false,
          error: 'Ошибка загрузки API',
          details: 'Возможно, API ключ неверный или заблокирован домен'
        })
      }

      document.head.appendChild(testScript)
    })

  } catch (error) {
    return {
      isValid: false,
      error: 'Ошибка при валидации',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

export const getApiKeyInfo = (apiKey: string) => {
  return {
    length: apiKey.length,
    format: apiKey.includes('-') ? 'UUID формат' : 'Неизвестный формат',
    masked: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'НЕТ',
    source: import.meta.env.VITE_YANDEX_MAPS_API_KEY ? 'Из .env переменной' : 'Хардкод в коде'
  }
}
