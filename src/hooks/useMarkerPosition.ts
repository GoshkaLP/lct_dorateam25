import { useState, useEffect, useCallback, useRef } from 'react'

interface MarkerPosition {
  x: number
  y: number
}

export const useMarkerPosition = (mapInstance: any, coordinates: [number, number]) => {
  const [position, setPosition] = useState<MarkerPosition>({ x: 0, y: 0 })
  const lastPositionRef = useRef<MarkerPosition>({ x: 0, y: 0 })

  const updatePosition = useCallback(() => {
    const container = document.getElementById('yandex-map-container')
    if (!container) return

    const rect = container.getBoundingClientRect()
    
    // Попытка получить реальные координаты маркера через Yandex Maps API 3.0
    let realCoords = null
    
    if (mapInstance && coordinates) {
      try {
        // Для Yandex Maps API 3.0 используем метод toScreenCoordinates
        if (mapInstance.projection && mapInstance.projection.toScreenCoordinates) {
          realCoords = mapInstance.projection.toScreenCoordinates(coordinates)
        }
        // Альтернативный способ через location API
        else if (mapInstance.getLocation) {
          const location = mapInstance.getLocation()
          if (location && location.toPx) {
            realCoords = location.toPx(coordinates)
          }
        }
        // Еще один способ через координатный конвертер
        else if (mapInstance.converter) {
          if (mapInstance.converter.coordinatesToPixels) {
            realCoords = mapInstance.converter.coordinatesToPixels(coordinates)
          } else if (mapInstance.converter.globalPixelsToContainerPixels) {
            const globalPixels = mapInstance.converter.worldToGlobalPixels(coordinates)
            realCoords = mapInstance.converter.globalPixelsToContainerPixels(globalPixels)
          }
        }
      } catch (error) {
        console.warn('Ошибка при получении координат маркера:', error)
      }
    }

    // Если удалось получить реальные координаты
    let newPosition: MarkerPosition
    if (realCoords && realCoords.length >= 2 && typeof realCoords[0] === 'number' && typeof realCoords[1] === 'number') {
      newPosition = {
        x: rect.left + realCoords[0],
        y: rect.top + realCoords[1]
      }
    } else {
      // Fallback: позиция в центре контейнера карты
      newPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
    }

    // Обновляем позицию только если она изменилась значительно (избегаем микро-обновлений)
    const threshold = 2 // пиксели
    if (Math.abs(newPosition.x - lastPositionRef.current.x) > threshold || 
        Math.abs(newPosition.y - lastPositionRef.current.y) > threshold) {
      lastPositionRef.current = newPosition
      setPosition(newPosition)
    }
  }, [mapInstance, coordinates])

  useEffect(() => {
    // Начальное обновление позиции
    updatePosition()

    // Обновляем позицию каждые 500мс (менее агрессивно)
    const interval = setInterval(updatePosition, 500)

    // Слушаем события изменения размера окна
    const handleResize = () => updatePosition()
    window.addEventListener('resize', handleResize)
    
    // Слушаем события прокрутки (если карта в прокручиваемом контейнере)
    const handleScroll = () => updatePosition()
    window.addEventListener('scroll', handleScroll)
    
    // Слушаем кастомное событие изменения карты
    const handleMapChanged = () => updatePosition()
    window.addEventListener('mapChanged', handleMapChanged)

    // Подписываемся на события карты для Yandex Maps API 3.0
    if (mapInstance) {
      const handleMapChange = () => updatePosition()
      
      try {
        // События Yandex Maps API 3.0
        const events = ['location-request', 'update', 'resize']
        
        events.forEach(event => {
          try {
            if (mapInstance.addEventListener) {
              mapInstance.addEventListener(event, handleMapChange)
            } else if (mapInstance.on) {
              mapInstance.on(event, handleMapChange)
            }
          } catch (e) {
            // Игнорируем если событие не поддерживается
          }
        })

        // Дополнительно пробуем подписаться на более общие события
        if (mapInstance.addChild && mapInstance.children) {
          // Следим за изменениями в дочерних элементах карты
          const observer = new MutationObserver(handleMapChange)
          const mapContainer = document.getElementById('yandex-map-container')
          if (mapContainer) {
            observer.observe(mapContainer, { childList: true, subtree: true })
          }
        }
      } catch (error) {
        console.warn('Ошибка подписки на события карты:', error)
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mapChanged', handleMapChanged)
      
      // Очищаем слушатели карты
      if (mapInstance) {
        try {
          const events = ['location-request', 'update', 'resize']
          events.forEach(event => {
            try {
              if (mapInstance.removeEventListener) {
                mapInstance.removeEventListener(event, updatePosition)
              } else if (mapInstance.off) {
                mapInstance.off(event, updatePosition)
              }
            } catch (e) {
              // Игнорируем ошибки
            }
          })
        } catch (error) {
          // Игнорируем ошибки
        }
      }
    }
  }, [mapInstance, coordinates])

  return position
}
