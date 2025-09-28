// Типы для Yandex Maps API 3.0 согласно официальной документации

declare global {
  interface Window {
    ymaps3: YMaps3Namespace;
  }
}

export interface YMaps3Namespace {
  ready: Promise<void>;
  import: (modules: string[]) => Promise<any>;
  YMap: typeof YMap;
  YMapDefaultSchemeLayer: typeof YMapDefaultSchemeLayer;
  YMapDefaultFeaturesLayer: typeof YMapDefaultFeaturesLayer;
  YMapControls: typeof YMapControls;
  YMapControlButton: typeof YMapControlButton;
  YMapMarker: typeof YMapMarker;
  LngLat: typeof LngLat;
}

// Основной класс карты
export declare class YMap {
  constructor(container: HTMLElement, props: YMapProps, options?: YMapOptions);
  addChild(child: YMapChild): void;
  removeChild(child: YMapChild): void;
  update(props: Partial<YMapProps>): void;
  destroy(): void;
  setLocation(location: YMapLocation): void;
}

export interface YMapProps {
  location: YMapLocation;
  mode?: 'vector' | 'raster';
  theme?: 'light' | 'dark';
  behaviors?: string[];
}

export interface YMapOptions {
  restrictMapArea?: boolean;
  copyrights?: boolean;
}

export interface YMapLocation {
  center: LngLat | [number, number];
  zoom: number;
  azimuth?: number;
  tilt?: number;
}

// Слои карты
export declare class YMapDefaultSchemeLayer {
  constructor(props?: YMapDefaultSchemeLayerProps);
}

export interface YMapDefaultSchemeLayerProps {
  theme?: 'light' | 'dark';
}

export declare class YMapDefaultFeaturesLayer {
  constructor(props?: YMapDefaultFeaturesLayerProps);
}

export interface YMapDefaultFeaturesLayerProps {
  id?: string;
}

// Контролы
export declare class YMapControls {
  constructor(props: YMapControlsProps);
  addChild(child: YMapControl): void;
  removeChild(child: YMapControl): void;
}

export interface YMapControlsProps {
  position: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'top center' | 'bottom center';
  orientation?: 'horizontal' | 'vertical';
}

export declare class YMapControlButton {
  constructor(props: YMapControlButtonProps);
}

export interface YMapControlButtonProps {
  text?: string;
  icon?: string;
  onClick?: () => void;
  background?: string;
  color?: string;
}

// Маркеры
export declare class YMapMarker {
  constructor(props: YMapMarkerProps, children?: YMapMarkerChild[]);
}

export interface YMapMarkerProps {
  coordinates: LngLat | [number, number];
  draggable?: boolean;
  mapFollowsOnDrag?: boolean;
  zIndex?: number;
}

// Дефолтный маркер
export declare class YMapDefaultMarker {
  constructor(props: YMapDefaultMarkerProps);
}

export interface YMapDefaultMarkerProps {
  coordinates: LngLat | [number, number];
  draggable?: boolean;
  mapFollowsOnDrag?: boolean;
  zIndex?: number;
  title?: string;
  subtitle?: string;
  color?: string;
  size?: 'micro' | 'small' | 'normal' | 'large';
  iconName?: string;
}

// Координаты
export declare class LngLat {
  constructor(lng: number, lat: number);
  lng: number;
  lat: number;
}

// Общие типы
export type YMapChild = YMapDefaultSchemeLayer | YMapDefaultFeaturesLayer | YMapControls | YMapMarker | YMapDefaultMarker;
export type YMapControl = YMapControlButton;
export type YMapMarkerChild = HTMLElement | string;