import { useEffect, useState } from 'react'

interface UseYandexMapsResult {
  isLoaded: boolean
  isLoading: boolean
  error: string | null
}

export const useYandexMaps = (): UseYandexMapsResult => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Проверяем, не загружен ли уже API
    if (window.ymaps3) {
      setIsLoaded(true)
      return
    }

    // Проверяем, не загружается ли уже скрипт
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]')
    if (existingScript) {
      return
    }

    setIsLoading(true)
    setError(null)

    // Получаем API ключ из переменных окружения
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || ''
    
    
    // Формируем URL для API
    const apiUrl = apiKey 
      ? `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`
      : 'https://api-maps.yandex.ru/v3/?lang=ru_RU'


    // Создаем и добавляем скрипт
    const script = document.createElement('script')
    script.src = apiUrl
    script.type = 'text/javascript'
    script.async = true

    script.onload = () => {
      setIsLoading(false)
      setIsLoaded(true)
      setError(null)
    }

    script.onerror = () => {
      setIsLoading(false)
      setIsLoaded(false)
      setError('Ошибка загрузки Yandex Maps API')
    }


    // Добавляем скрипт в head
    document.head.appendChild(script)
    
    // Добавляем тайм-аут для обнаружения зависших загрузок
    const loadTimeout = setTimeout(() => {
      if (!isLoaded) {
        setError('Тайм-аут загрузки API. Возможны проблемы с сетью.')
        setIsLoading(false)
      }
    }, 30000) // 30 секунд
    
    // Очищаем тайм-аут при успешной загрузке или ошибке
    const originalOnLoad = script.onload
    const originalOnError = script.onerror
    
    script.onload = (event) => {
      clearTimeout(loadTimeout)
      if (originalOnLoad) originalOnLoad.call(script, event)
    }
    
    script.onerror = (event) => {
      clearTimeout(loadTimeout)
      if (originalOnError) originalOnError.call(script, event)
    }

    // Cleanup function
    return () => {
      // Удаляем скрипт при размонтировании (если нужно)
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return { isLoaded, isLoading, error }
}
