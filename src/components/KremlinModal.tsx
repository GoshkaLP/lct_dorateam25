import React, { useMemo } from 'react'

interface KremlinModalProps {
  isVisible: boolean
  onClose: () => void
  position?: { x: number; y: number }
}

const KremlinModal: React.FC<KremlinModalProps> = ({ isVisible, onClose, position }) => {
  if (!isVisible) return null

  // Вычисляем оптимальную позицию модального окна с учетом границ экрана
  const modalStyles = useMemo(() => {
    if (!position?.x || !position.y) {
      // Если позиция не определена, показываем в центре экрана
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        marginTop: '0'
      }
    }

    const modalWidth = 384 // max-w-sm (24rem = 384px)
    const modalHeight = 300 // примерная высота модального окна
    const offset = 15 // отступ от маркера
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let left = position.x
    let top = position.y - modalHeight - offset
    let transform = 'translate(-50%, 0)'
    let arrowPosition = 'bottom' // где располагается стрелочка
    
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
        arrowPosition: 'none'
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
        id="kremlin-modal"
        className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm"
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
      
      {/* Заголовок с кнопкой закрытия */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">🏰 Московский Кремль</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
      
      {/* Содержимое */}
      <div className="p-4">
        <div className="text-gray-700 text-sm leading-relaxed space-y-2">
          <p>
            Московский Кремль — крепость в центре Москвы и древнейшая её часть, 
            главный общественно-политический и историко-художественный комплекс города.
          </p>
          <p>
            Расположен на высоком левом берегу Москвы-реки — Боровицком холме, 
            при впадении в неё реки Неглинной, занимает площадь 27,5 гектара.
          </p>
          <p>
            В настоящее время является резиденцией Президента Российской Федерации 
            и включён в список объектов Всемирного наследия ЮНЕСКО.
          </p>
        </div>
        
        {/* Дополнительная информация */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>📍 Красная площадь, 1</span>
            <span>🕐 1147 г.</span>
          </div>
          {/* Отладочная информация о позиции */}
          <div className="mt-2 text-xs text-gray-400">
            Позиция: x={position?.x?.toFixed(0) || 'не определена'}, y={position?.y?.toFixed(0) || 'не определена'}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default KremlinModal
