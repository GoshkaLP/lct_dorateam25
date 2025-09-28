import React, { useMemo } from 'react'
import { MarkerModalProps } from '../hooks'

/**
 * Универсальный компонент модального окна, прикрепляемого к маркеру на карте
 * 
 * @example
 * ```tsx
 * const { isVisible, position, closeModal } = useMarkerModal({
 *   mapInstance: mapRef.current,
 *   coordinates: [37.617635, 55.755814]
 * })
 * 
 * <MarkerModal isVisible={isVisible} onClose={closeModal} position={position}>
 *   <div>Контент модального окна</div>
 * </MarkerModal>
 * ```
 */
const MarkerModal: React.FC<MarkerModalProps> = ({ 
  isVisible, 
  onClose, 
  position, 
  className = '',
  children 
}) => {
  if (!isVisible) return null

  // Вычисляем оптимальную позицию модального окна с учетом границ экрана
  const modalStyles = useMemo(() => {
    if (!position?.x || !position.y) {
      // Если позиция не определена, показываем в центре экрана
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        marginTop: '0',
        arrowPosition: 'none' as const
      }
    }

    const modalWidth = 384 // примерная ширина модального окна
    const modalHeight = 300 // примерная высота модального окна
    const offset = 15 // отступ от маркера
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = position.x
    let top = position.y - modalHeight - offset
    let transform = 'translate(-50%, 0)'
    let arrowPosition: 'top' | 'bottom' | 'none' = 'bottom'
    
    // Проверяем, помещается ли модальное окно сверху
    if (top < 10) {
      // Если не помещается сверху, размещаем снизу
      top = position.y + offset
      arrowPosition = 'top'
    }
    
    // Проверяем горизонтальное позиционирование
    if (left - modalWidth/2 < 10) {
      // Если модальное окно выходит за левую границу
      left = modalWidth/2 + 10
    } else if (left + modalWidth/2 > viewportWidth - 10) {
      // Если модальное окно выходит за правую границу
      left = viewportWidth - modalWidth/2 - 10
    }
    
    // Проверяем, помещается ли модальное окно по высоте
    if (top + modalHeight > viewportHeight - 10) {
      // Если не помещается, размещаем в центре экрана
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        marginTop: '0',
        arrowPosition: 'none' as const
      }
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      transform,
      marginTop: '0',
      arrowPosition
    }
  }, [position])

  return (
    <>
      {/* Полупрозрачный фон */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Модальное окно */}
      <div 
        className={`absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm ${className}`}
        style={modalStyles}
      >
        {/* Стрелочка указывающая на маркер */}
        {position?.x && position?.y && modalStyles.arrowPosition && modalStyles.arrowPosition !== 'none' && (
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 ${
              modalStyles.arrowPosition === 'bottom' 
                ? 'bottom-0 translate-y-full' 
                : 'top-0 -translate-y-full'
            }`}
            style={{
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              ...(modalStyles.arrowPosition === 'bottom' 
                ? { borderTop: '8px solid white' }
                : { borderBottom: '8px solid white' }
              ),
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        )}
        
        {/* Контент модального окна */}
        <div className="relative">
          {/* Кнопка закрытия по умолчанию */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none z-10"
            aria-label="Закрыть"
          >
            ×
          </button>
          
          {/* Пользовательский контент */}
          {children}
        </div>
      </div>
    </>
  )
}

export default MarkerModal
