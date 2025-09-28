import { useState, useCallback } from 'react'
import { useMarkerPosition } from './useMarkerPosition'

interface UseMarkerModalOptions {
  /** Экземпляр карты */
  mapInstance: any
  /** Координаты маркера [долгота, широта] */
  coordinates: [number, number]
  /** Автоматически открывать модальное окно при клике на маркер */
  autoOpenOnClick?: boolean
  /** Автоматически закрывать при клике вне модального окна */
  autoCloseOnOutsideClick?: boolean
}

interface UseMarkerModalReturn {
  /** Открыто ли модальное окно */
  isVisible: boolean
  /** Позиция модального окна относительно маркера */
  position: { x: number; y: number }
  /** Функция для открытия модального окна */
  openModal: () => void
  /** Функция для закрытия модального окна */
  closeModal: () => void
  /** Функция для переключения состояния модального окна */
  toggleModal: () => void
  /** Обработчик клика на маркер (для удобства подключения) */
  handleMarkerClick: () => void
}

/**
 * Универсальный хук для привязки модальных окон к маркерам на Yandex Maps
 * 
 * @example
 * ```tsx
 * const { isVisible, position, openModal, closeModal, handleMarkerClick } = useMarkerModal({
 *   mapInstance: mapRef.current,
 *   coordinates: [37.617635, 55.755814],
 *   autoOpenOnClick: true
 * })
 * 
 * // При создании маркера
 * marker.addEventListener('click', handleMarkerClick)
 * 
 * // При рендере модального окна
 * <Modal isVisible={isVisible} onClose={closeModal} position={position} />
 * ```
 */
export const useMarkerModal = ({
  mapInstance,
  coordinates,
  autoOpenOnClick = true,
}: UseMarkerModalOptions): UseMarkerModalReturn => {
  const [isVisible, setIsVisible] = useState(false)
  
  // Получаем позицию маркера с помощью существующего хука
  const position = useMarkerPosition(mapInstance, coordinates)

  const openModal = useCallback(() => {
    setIsVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsVisible(false)
  }, [])

  const toggleModal = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const handleMarkerClick = useCallback(() => {
    if (autoOpenOnClick) {
      openModal()
    }
  }, [autoOpenOnClick, openModal])

  return {
    isVisible,
    position,
    openModal,
    closeModal,
    toggleModal,
    handleMarkerClick
  }
}

/**
 * Интерфейс для универсального модального компонента, совместимого с useMarkerModal
 */
export interface MarkerModalProps {
  /** Открыто ли модальное окно */
  isVisible: boolean
  /** Функция закрытия модального окна */
  onClose: () => void
  /** Позиция модального окна относительно маркера */
  position?: { x: number; y: number }
  /** Дополнительные CSS классы */
  className?: string
  /** Контент модального окна */
  children?: React.ReactNode
}
