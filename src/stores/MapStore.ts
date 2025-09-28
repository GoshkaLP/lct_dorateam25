import { makeAutoObservable } from 'mobx'

export interface MapCenter {
  lat: number
  lng: number
}

class MapStore {
  // Координаты центра Москвы
  center: MapCenter = {
    lat: 55.7558,
    lng: 37.6176
  }

  zoom: number = 10
  isMapLoaded: boolean = false
  isMapLoading: boolean = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setCenter = (center: MapCenter) => {
    this.center = center
  }

  setZoom = (zoom: number) => {
    this.zoom = zoom
  }

  setMapLoaded = (loaded: boolean) => {
    this.isMapLoaded = loaded
  }

  setMapLoading = (loading: boolean) => {
    this.isMapLoading = loading
  }

  setError = (error: string | null) => {
    this.error = error
  }

  // Действие для центрирования карты на Москве
  centerOnMoscow = () => {
    this.setCenter({
      lat: 55.7558,
      lng: 37.6176
    })
    this.setZoom(10)
  }
}

export const mapStore = new MapStore()
