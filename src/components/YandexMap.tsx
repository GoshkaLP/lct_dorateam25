import React, { useEffect, useRef, useState, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { mapStore } from '../stores'
import { MAPS_CONFIG } from '../config/maps'
import { useYandexMaps, useMarkerModal } from '../hooks'
import { KremlinModal, MarkerModal } from './'

const YandexMap: React.FC = observer(() => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isApiReady, setIsApiReady] = useState(false)
  // Используем хук для загрузки API
  const { isLoaded: isApiLoaded, isLoading: isApiLoading, error: apiError } = useYandexMaps()
  
  // Используем универсальный хук для модального окна маркера Кремля
  const { 
    isVisible: isModalVisible, 
    position: markerPosition, 
    openModal, 
    closeModal, 
    handleMarkerClick 
  } = useMarkerModal({
    mapInstance: mapInstanceRef.current,
    coordinates: MAPS_CONFIG.MOSCOW_CENTER,
    autoOpenOnClick: true
  })

  // Координаты для пользовательского объекта (мемоизируем, чтобы избежать пересоздания)
  const customObjectCoords = useMemo((): [number, number] => [
    MAPS_CONFIG.MOSCOW_CENTER[0] + 0.1,
    MAPS_CONFIG.MOSCOW_CENTER[1] + 0.2
  ], [])
  
  const { 
    isVisible: isCustomModalVisible, 
    position: customMarkerPosition, 
    closeModal: closeCustomModal, 
    handleMarkerClick: handleCustomMarkerClick 
  } = useMarkerModal({
    mapInstance: mapInstanceRef.current,
    coordinates: customObjectCoords,
    autoOpenOnClick: true
  })


  // Выносим функцию инициализации карты на уровень компонента
  const initializeMap = async () => {
      try {
        // Ждем готовности API
        await window.ymaps3.ready
        setIsApiReady(true)

        // Ждем небольшой таймаут чтобы DOM успел отрендериться
        await new Promise(resolve => setTimeout(resolve, 100))

        // Пытаемся получить контейнер через ref или по ID
        let mapContainer = mapRef.current
        
        if (!mapContainer) {
          mapContainer = document.getElementById('yandex-map-container') as HTMLDivElement
        }

        if (!mapContainer) {
          mapStore.setError('Контейнер карты не найден. Попробуйте обновить страницу.')
          mapStore.setMapLoading(false)
          return
        }
        
        // Обновляем ref если он был null (через Object.assign для обхода readonly)
        if (!mapRef.current && mapContainer) {
          Object.assign(mapRef, { current: mapContainer })
        }

        // Импортируем необходимые модули согласно документации
        const ymaps3 = window.ymaps3
        
        // Правильный импорт модулей согласно документации
        await ymaps3.ready;
        
        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;
        
        const { YMapControls, YMapControlButton } = await ymaps3.import(['@yandex/ymaps3-controls@0.0.1']);
        const { YMapDefaultMarker } = await ymaps3.import(['@yandex/ymaps3-markers@0.0.1']);

        // Создаем карту с правильными параметрами
        const map = new YMap(mapContainer, {
          location: {
            center: MAPS_CONFIG.MOSCOW_CENTER,
            zoom: MAPS_CONFIG.DEFAULT_ZOOM
          },
          mode: 'vector'
        })

        // Добавляем схему карты
        map.addChild(new YMapDefaultSchemeLayer({}))
        
        // Добавляем слой объектов
        map.addChild(new YMapDefaultFeaturesLayer({}))

        // Добавляем контролы
        const controls = new YMapControls({ 
          position: 'top left',
          orientation: 'vertical'
        })
        
        const centerButton = new YMapControlButton({
          text: '🏠 Центр Москвы',
          onClick: () => {
            map.setLocation({
              center: MAPS_CONFIG.MOSCOW_CENTER,
              zoom: MAPS_CONFIG.DEFAULT_ZOOM
            })
            mapStore.centerOnMoscow()
          }
        })
        
        const infoButton = new YMapControlButton({
          text: '🏰 О Кремле',
          onClick: openModal
        })
        
        controls.addChild(centerButton)
        controls.addChild(infoButton)
        map.addChild(controls)

        // Добавляем маркер в центре Москвы
        const marker = new YMapDefaultMarker({
          coordinates: MAPS_CONFIG.MOSCOW_CENTER,
          draggable: false,
          title: 'Центр Москвы?',
          subtitle: 'Красная площадь'
        })
        
        // Добавляем обработчик клика для открытия модального окна
        try {
          marker.addEventListener('click', handleMarkerClick)
        } catch (error) {
          // Если addEventListener не работает, попробуем другой способ
          if (marker.on) {
            marker.on('click', handleMarkerClick)
          }
        }
        
        map.addChild(marker)

        // Добавляем ваш пользовательский объект рядом с основным маркером
        const customObjectCoords: [number, number] = [
          MAPS_CONFIG.MOSCOW_CENTER[0] + 0.002, // Немного сдвигаем по долготе
          MAPS_CONFIG.MOSCOW_CENTER[1] + 0.001  // Немного сдвигаем по широте
        ]

        const customMarker = new YMapDefaultMarker({
          coordinates: customObjectCoords,
          draggable: true, // Делаем перетаскиваемым
          title: '🏢 Мой объект',
          subtitle: 'Пользовательская точка'
        })

        // Добавляем обработчик клика для пользовательского маркера
        try {
          customMarker.addEventListener('click', handleCustomMarkerClick)
        } catch (error) {
          if (customMarker.on) {
            customMarker.on('click', handleCustomMarkerClick)
          }
        }

        map.addChild(customMarker)
        
        // Подписываемся на события карты для обновления позиции модального окна
        try {
          const updateModalPosition = () => {
            // Принудительно обновляем позиции при изменении карты
            // Триггерим перерендер хука useMarkerPosition
            const event = new CustomEvent('mapChanged')
            window.dispatchEvent(event)
          }

          // Пытаемся подписаться на события карты (API может отличаться в разных версиях)
          if (map && typeof (map as any).addEventListener === 'function') {
            (map as any).addEventListener('update', updateModalPosition)
          } else if (map && typeof (map as any).on === 'function') {
            (map as any).on('update', updateModalPosition)
          }
          
          // Дополнительный таймер для обновления позиции при изменениях
          const positionUpdateInterval = setInterval(updateModalPosition, 500)
          
          // Сохраняем интервал для очистки
          mapInstanceRef.current._positionUpdateInterval = positionUpdateInterval
          
        } catch (error) {
          console.warn('Не удалось подписаться на события карты:', error)
        }

        mapInstanceRef.current = map
        mapStore.setMapLoaded(true)
        mapStore.setMapLoading(false)
        mapStore.setError(null)

        // Дополнительная проверка что карта действительно отрендерилась
        setTimeout(() => {
          const container = mapContainer || document.getElementById('yandex-map-container')
          
          // Если контейнер пустой, попробуем еще раз
          if (container && container.children.length === 0) {
            setTimeout(() => {
              handleRetry()
            }, 1000)
          }
        }, 1000)

      } catch (error) {
        mapStore.setError(`Ошибка ymaps3: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
        mapStore.setMapLoading(false)
        
        // Автоматическая повторная попытка через 2 секунды
        setTimeout(() => {
          handleRetry()
        }, 2000)
      }
    }

  useEffect(() => {
    // Если API еще не загружен, ждем
    if (!isApiLoaded) {
      return
    }

    // Дополнительная проверка готовности DOM
    if (document.readyState === 'loading') {
      const handleDOMReady = () => {
        document.removeEventListener('DOMContentLoaded', handleDOMReady)
        // Небольшая задержка и повторная попытка
        setTimeout(() => {
          if (isApiLoaded) {
            mapStore.setMapLoading(true)
            initializeMap()
          }
        }, 50)
      }
      document.addEventListener('DOMContentLoaded', handleDOMReady)
      return
    }

    mapStore.setMapLoading(true)
    initializeMap()

    // Cleanup при размонтировании
    return () => {
      if (mapInstanceRef.current) {
        // Очищаем интервал обновления позиции
        if (mapInstanceRef.current._positionUpdateInterval) {
          clearInterval(mapInstanceRef.current._positionUpdateInterval)
        }
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [isApiLoaded])


  const handleRetry = async () => {
    mapStore.setError(null)
    mapStore.setMapLoading(true)
    
    try {
      // Очищаем предыдущий экземпляр карты если есть
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy()
        } catch (e) {
          // Игнорируем ошибки при удалении
        }
        mapInstanceRef.current = null
      }

      // Пытаемся переинициализировать карту
      if (!window.ymaps3) {
        throw new Error('Yandex Maps API не загружен')
      }

      await window.ymaps3.ready

      // Ждем небольшую задержку
      await new Promise(resolve => setTimeout(resolve, 200))

      let mapContainer = mapRef.current || (document.getElementById('yandex-map-container') as HTMLDivElement)
      
      if (!mapContainer) {
        throw new Error('Контейнер карты недоступен')
      }

      // Очищаем контейнер
      mapContainer.innerHTML = ''

      const ymaps3 = window.ymaps3
      
      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;
      const { YMapDefaultMarker } = await ymaps3.import(['@yandex/ymaps3-markers@0.0.1']);

      const map = new YMap(mapContainer, {
        location: {
          center: MAPS_CONFIG.MOSCOW_CENTER,
          zoom: MAPS_CONFIG.DEFAULT_ZOOM
        },
        mode: 'vector'
      })

      map.addChild(new YMapDefaultSchemeLayer({}))
      map.addChild(new YMapDefaultFeaturesLayer({}))

      const marker = new YMapDefaultMarker({
        coordinates: MAPS_CONFIG.MOSCOW_CENTER,
        draggable: false,
        title: 'Центр Москвы!'
      })
      map.addChild(marker)

      // Добавляем ваш пользовательский объект и в функцию повтора
      const customMarkerRetry = new YMapDefaultMarker({
        coordinates: customObjectCoords,
        draggable: true,
        title: '🏢 Мой объект',
        subtitle: 'Пользовательская точка'
      })
      map.addChild(customMarkerRetry)

      mapInstanceRef.current = map
      mapStore.setMapLoaded(true)
      mapStore.setMapLoading(false)
      mapStore.setError(null)

    } catch (error) {
      mapStore.setError(`Ошибка повтора: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
      mapStore.setMapLoading(false)
    }
  }

  // Показываем ошибку API или карты
  if (apiError || mapStore.error) {
    const errorMessage = apiError || mapStore.error
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-2xl mb-4">🗺️ Проблема с картой</div>
          <div className="text-gray-700 mb-4 text-lg">{errorMessage}</div>
          
          <div className="text-gray-600 text-sm mb-6">
            <strong>Для работы карты необходимо:</strong>
            <ul className="list-disc text-left mt-2 ml-4">
              <li>Стабильное интернет-соединение</li>
              <li>Доступ к Yandex сервисам</li>
              <li>JavaScript включен в браузере</li>
              <li>API ключ Yandex Maps (для продакшена)</li>
            </ul>
          </div>
          
          <div className="space-x-3">
            <button 
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              🔄 Перезагрузить
            </button>
            <a 
              href="https://yandex.ru/maps-api/docs/js-api/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              📖 Документация
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Показываем только загрузку API, карту не блокируем
  if (isApiLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <div className="text-gray-700 text-xl font-medium mb-2">Загрузка карты Москвы...</div>
          <div className="text-gray-500 text-sm">
            Загрузка Yandex Maps API 3.0...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
      <div 
        ref={(el) => {
          if (el) {
            Object.assign(mapRef, { current: el })
          }
        }}
        className="h-full w-full"
        style={{ 
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          display: 'block'
        }}
        id="yandex-map-container"
      />


      {/* Индикатор загрузки карты поверх контейнера */}
      {mapStore.isMapLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <div className="text-gray-700 text-lg font-medium">
              {isApiReady ? 'Создание карты...' : 'Инициализация...'}
            </div>
          </div>
        </div>
      )}


      {/* Модальное окно с информацией о Кремле */}
      <KremlinModal 
        isVisible={isModalVisible}
        onClose={closeModal}
        position={markerPosition}
      />

      {/* Модальное окно для вашего пользовательского объекта */}
      <MarkerModal 
        isVisible={isCustomModalVisible}
        onClose={closeCustomModal}
        position={customMarkerPosition}
        className="max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              🏢 Мой объект
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="text-gray-700">
              <p className="text-sm leading-relaxed mb-3">
                Это ваш пользовательский объект на карте! Вы можете перетаскивать маркер 
                и настраивать его свойства.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="text-xs text-blue-800 space-y-1">
                  <div><strong>📍 Координаты:</strong></div>
                  <div>Долгота: {customObjectCoords[0].toFixed(6)}</div>
                  <div>Широта: {customObjectCoords[1].toFixed(6)}</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>🎯 <strong>Особенности:</strong></div>
                <div>• Перетаскиваемый маркер</div>
                <div>• Кастомное модальное окно</div>
                <div>• Умное позиционирование</div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button 
                onClick={() => {
                  console.log('Координаты объекта:', customObjectCoords)
                  alert('Координаты выведены в консоль браузера!')
                }}
                className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
              >
                📋 Скопировать координаты
              </button>
              <button 
                onClick={closeCustomModal}
                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </MarkerModal>
    </div>
  )
})

export default YandexMap
