import React, { useState, useEffect } from 'react'
import { validateYandexMapsApiKey, getApiKeyInfo, type ApiKeyValidationResult } from '../utils/apiKeyValidator'

interface DebugInfo {
  apiKey: string
  apiKeyPresent: boolean
  windowYmaps3: boolean
  scriptElement: boolean
  readyState: string
  userAgent: string
  currentUrl: string
}

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [validationResult, setValidationResult] = useState<ApiKeyValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const collectDebugInfo = () => {
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || ''
    const keyInfo = getApiKeyInfo(apiKey)
    
    const info: DebugInfo = {
      apiKey: keyInfo.masked,
      apiKeyPresent: Boolean(apiKey),
      windowYmaps3: Boolean(window.ymaps3),
      scriptElement: Boolean(document.querySelector('script[src*="api-maps.yandex.ru"]')),
      readyState: document.readyState,
      userAgent: navigator.userAgent,
      currentUrl: window.location.href
    }
    
    setDebugInfo(info)
  }

  const testApiKey = async () => {
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || ''
    
    if (!apiKey) {
      // API ключ не найден
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      const result = await validateYandexMapsApiKey(apiKey)
      setValidationResult(result)
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'Ошибка валидации',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      })
    } finally {
      setIsValidating(false)
    }
  }

  useEffect(() => {
    collectDebugInfo()
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition-colors"
      >
        🐛 DEBUG
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-red-500 rounded-lg p-4 max-w-md shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-red-600">🐛 Отладочная информация</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      
      {debugInfo && (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">API ключ:</span>
            <span className={debugInfo.apiKeyPresent ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.apiKey}
            </span>
            
            <span className="font-semibold">window.ymaps3:</span>
            <span className={debugInfo.windowYmaps3 ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.windowYmaps3 ? 'Есть' : 'НЕТ'}
            </span>
            
            <span className="font-semibold">Script тег:</span>
            <span className={debugInfo.scriptElement ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.scriptElement ? 'Есть' : 'НЕТ'}
            </span>
            
            <span className="font-semibold">ReadyState:</span>
            <span>{debugInfo.readyState}</span>
          </div>
          
          <div className="mt-3 space-y-1">
            <button
              onClick={collectDebugInfo}
              className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
            >
              🔄 Обновить информацию
            </button>
            
            <button
              onClick={testApiKey}
              disabled={isValidating}
              className="w-full bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-50"
            >
              {isValidating ? '⏳ Тестирую...' : '🔑 Тест API ключа'}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
            >
              🔄 Перезагрузить страницу
            </button>
          </div>
          
          {validationResult && (
            <div className={`mt-3 p-2 rounded text-xs ${
              validationResult.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className="font-semibold">
                {validationResult.isValid ? '✅ API ключ валиден' : '❌ Проблема с API ключом'}
              </div>
              {validationResult.error && (
                <div className="mt-1">Ошибка: {validationResult.error}</div>
              )}
              {validationResult.details && (
                <div className="mt-1">{validationResult.details}</div>
              )}
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-600">
            <div>URL: {debugInfo.currentUrl}</div>
            <div>Browser: {debugInfo.userAgent.substring(0, 50)}...</div>
            <div className="mt-2 p-2 bg-gray-100 rounded">
              <div className="font-semibold">Переменные окружения:</div>
              <div>VITE_YANDEX_MAPS_API_KEY: {import.meta.env.VITE_YANDEX_MAPS_API_KEY ? '✅ Установлена' : '❌ НЕТ'}</div>
              <div>NODE_ENV: {import.meta.env.NODE_ENV}</div>
              <div>MODE: {import.meta.env.MODE}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DebugPanel
