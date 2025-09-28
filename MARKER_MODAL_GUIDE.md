# Руководство по привязке модальных окон к маркерам

Этот проект предоставляет готовую систему для привязки модальных окон к маркерам на Яндекс картах. Система включает в себя умное позиционирование, автоматическое отслеживание изменений карты и простое API для интеграции.

## Компоненты системы

### 1. Хук `useMarkerPosition`
Отслеживает пиксельную позицию маркера на экране и обновляет её при изменении карты.

### 2. Хук `useMarkerModal` 
Универсальный хук для управления состоянием модального окна, привязанного к маркеру.

### 3. Компонент `MarkerModal`
Универсальный компонент модального окна с умным позиционированием.

## Быстрый старт

### Базовое использование

```tsx
import React from 'react'
import { useMarkerModal, MarkerModal } from './hooks'

const MyMapComponent = () => {
  const mapRef = useRef<any>(null)

  // Создаем модальное окно для маркера
  const { isVisible, position, openModal, closeModal, handleMarkerClick } = useMarkerModal({
    mapInstance: mapRef.current,
    coordinates: [37.617635, 55.755814], // [долгота, широта]
    autoOpenOnClick: true
  })

  // При создании маркера привязываем обработчик клика
  useEffect(() => {
    if (mapRef.current) {
      const marker = new YMapDefaultMarker({
        coordinates: [37.617635, 55.755814]
      })
      
      marker.addEventListener('click', handleMarkerClick)
      mapRef.current.addChild(marker)
    }
  }, [handleMarkerClick])

  return (
    <div>
      {/* Ваша карта */}
      <div ref={mapRef} />
      
      {/* Модальное окно */}
      <MarkerModal isVisible={isVisible} onClose={closeModal} position={position}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Заголовок</h3>
          <p>Содержимое модального окна</p>
        </div>
      </MarkerModal>
    </div>
  )
}
```

### Продвинутое использование

```tsx
import React from 'react'
import { useMarkerModal } from './hooks'

const AdvancedMapComponent = () => {
  const mapRef = useRef<any>(null)

  // Маркер 1 - Кремль
  const kremlinModal = useMarkerModal({
    mapInstance: mapRef.current,
    coordinates: [37.617635, 55.755814],
    autoOpenOnClick: true
  })

  // Маркер 2 - Красная площадь  
  const redSquareModal = useMarkerModal({
    mapInstance: mapRef.current,
    coordinates: [37.6205, 55.7539],
    autoOpenOnClick: true
  })

  return (
    <div>
      <div ref={mapRef} />
      
      {/* Модальное окно для Кремля */}
      <MarkerModal 
        isVisible={kremlinModal.isVisible} 
        onClose={kremlinModal.closeModal} 
        position={kremlinModal.position}
        className="w-96"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3">🏰 Московский Кремль</h3>
          <p className="text-gray-700">Резиденция Президента РФ</p>
        </div>
      </MarkerModal>

      {/* Модальное окно для Красной площади */}
      <MarkerModal 
        isVisible={redSquareModal.isVisible} 
        onClose={redSquareModal.closeModal} 
        position={redSquareModal.position}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">🟥 Красная площадь</h3>
          <p className="text-sm text-gray-600">Главная площадь Москвы</p>
        </div>
      </MarkerModal>
    </div>
  )
}
```

## API

### `useMarkerModal(options)`

**Параметры:**
- `mapInstance` - экземпляр карты Yandex Maps
- `coordinates` - координаты маркера `[долгота, широта]`
- `autoOpenOnClick?` - автоматически открывать при клике (по умолчанию `true`)
- `autoCloseOnOutsideClick?` - автоматически закрывать при клике вне окна (по умолчанию `true`)

**Возвращает:**
- `isVisible` - открыто ли модальное окно
- `position` - позиция окна `{x: number, y: number}`
- `openModal()` - функция открытия
- `closeModal()` - функция закрытия
- `toggleModal()` - функция переключения
- `handleMarkerClick()` - обработчик для маркера

### `MarkerModal` компонент

**Пропы:**
- `isVisible` - открыто ли окно
- `onClose` - функция закрытия
- `position?` - позиция окна
- `className?` - дополнительные CSS классы
- `children` - контент окна

## Особенности

### Умное позиционирование
- Автоматически размещает окно сверху или снизу от маркера
- Учитывает границы экрана
- Корректирует позицию при выходе за края
- Fallback в центр экрана при невозможности позиционирования

### Отслеживание изменений карты
- Автоматически обновляет позицию при зуме
- Реагирует на перемещение карты  
- Слушает изменения размера окна
- Поддерживает прокрутку страницы

### Адаптивность
- Responsive дизайн
- Поддержка мобильных устройств
- Корректная работа на разных разрешениях

## Стилизация

Модальные окна используют Tailwind CSS классы. Можно кастомизировать:

```tsx
<MarkerModal 
  className="w-80 bg-blue-50 border-blue-200"
  // ...другие пропы
>
  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
    <h3>Кастомный стиль</h3>
  </div>
</MarkerModal>
```

## Советы по использованию

1. **Множественные маркеры**: Создавайте отдельный хук для каждого маркера
2. **Производительность**: Используйте `React.memo` для тяжелого контента
3. **Доступность**: Добавляйте `aria-label` и клавиатурную навигацию
4. **Мобильные устройства**: Тестируйте на разных размерах экрана

## Пример с реальными данными

```tsx
const CitiesMap = () => {
  const cities = [
    { id: 1, name: 'Москва', coords: [37.617635, 55.755814] },
    { id: 2, name: 'СПб', coords: [30.3609, 59.9311] },
    { id: 3, name: 'Казань', coords: [49.1221, 55.7887] }
  ]

  const modals = cities.map(city => ({
    city,
    modal: useMarkerModal({
      mapInstance: mapRef.current,
      coordinates: city.coords
    })
  }))

  return (
    <div>
      <div ref={mapRef} />
      
      {modals.map(({ city, modal }) => (
        <MarkerModal key={city.id} {...modal}>
          <div className="p-4">
            <h3>{city.name}</h3>
            <button onClick={() => loadCityData(city.id)}>
              Загрузить данные
            </button>
          </div>
        </MarkerModal>
      ))}
    </div>
  )
}
```

## Отладка

Для отладки позиционирования в компоненте `KremlinModal` есть информация о координатах:

```tsx
<div className="mt-2 text-xs text-gray-400">
  Позиция: x={position?.x?.toFixed(0)}, y={position?.y?.toFixed(0)}
</div>
```

Также можно включить дополнительные логи в консоли браузера.
