// Classes used by Leaflet to position controls
import React, { useCallback, useMemo, useState } from "react";
import {
  MapContainer,
  Rectangle,
  TileLayer,
  useMap,
  useMapEvent,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
  FeatureGroup,
  Polyline,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { useEventHandlers } from "@react-leaflet/core";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./Map.css";
import Train from "../Train/Train";
import useForceUpdateGeoJson from "./useForceUpdateGeoJson";
import HoverCard from "../MapHoverCard/HoverCard";
import ReactDOMServer from "react-dom/server";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};
const points = [
  [55.7022, 37.4155],
  [55.795022, 37.962525],
  [55.608771, 37.616236],
];
const BOUNDS_STYLE = { weight: 1 };

function MinimapBounds({ parentMap, zoom }) {
  const minimap = useMap();

  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom());
    },
    [parentMap]
  );
  useMapEvent("click", onClick);

  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds());
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds());
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom);
  }, [minimap, parentMap, zoom]);

  // Listen to events on the parent map
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), []);
  useEventHandlers({ instance: parentMap }, handlers);

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />;
}

function MinimapControl({ position, zoom }) {
  const parentMap = useMap();
  const mapZoom = zoom || 0;

  // Memoize the minimap so it's not affected by position changes
  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    []
  );

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  );
}

function LocationMarker({ setCoordinatesPoint }) {
  const [position, setPosition] = useState([55.7022, 37.4155]); // const [position, setPosition] = useState(null)
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoordinatesPoint(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>{JSON.stringify(position)}</Popup>
    </Marker>
  );
}

function ReactControlExample({
  data,
  polygons,
  hexbin,
  handleTrainClick,
  handleMapClick,
  setCoordinatesPoint,
  selectedCrossingFilters,
  filterNames,
}) {
  const hexbinKey = useForceUpdateGeoJson(hexbin);
  const polygonsKey = useForceUpdateGeoJson(polygons);
  const dataKey = useForceUpdateGeoJson(data);
  const [isOpenHex, setIsOpenHex] = useState(false);
  const [isOpenPolygon, setIsOpenPolygon] = useState(true);
  const [rectangle, setRectangle] = useState(null);

  const style = (feature) => {
    return {
      fillColor: feature.properties.color,
      color: "transparent",
      fillOpacity: 0.5,
    };
  };
  const showInfoOnGeo = (feature, layer) => {
    const tooltipContent = ReactDOMServer.renderToString(
      <HoverCard
        featureProps={feature.properties}
        selectedCrossingFilters={selectedCrossingFilters}
        filterNames={filterNames}
      />
    );
    layer.bindTooltip(tooltipContent, { permanent: false });
  };

  const handleToggleHex = () => {
    setIsOpenHex(!isOpenHex);
  };

  const handleTogglePolygon = () => {
    setIsOpenPolygon(!isOpenPolygon);
  };

  const onCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "rectangle") {
      const bounds = layer.getBounds();
      console.log("Rectangle created with bounds:", bounds);
    }
    if (e.layerType === "rectangle") {
      setRectangle(null);
      setRectangle(e.layer.getBounds());
      e.layer.remove();
    }
  };

  return (
    <>
      <MapContainer
        style={{ height: "100vh", zIndex: 1 }}
        center={[55.7022, 37.4155]}
        zoom={12}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        {/* {Object.keys(polygons).length && isOpenPolygon ? <GeoJSON key={`polygon-${polygonsKey}`} attribution="&copy; credits due..." data={polygons} style={style} onEachFeature={showInfoOnGeo}/> : null}
                {Object.keys(hexbin).length && isOpenHex ? <GeoJSON key={`hexbin-${hexbinKey}`} attribution="&copy; credits due..." data={hexbin} style={style} onEachFeature={showInfoOnGeo} /> : null} */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        {data !== null && Object.keys(data).length ? (
          <GeoJSON
            key={`polygon-${dataKey}`}
            attribution="&copy; credits due..."
            data={data}
            style={style}
            onEachFeature={showInfoOnGeo}
          />
        ) : null}
        <MinimapControl position="topright" />
        <LocationMarker setCoordinatesPoint={setCoordinatesPoint} />
        <FeatureGroup>
          <EditControl
            position="bottomright"
            onCreated={onCreated}
            draw={{
              polyline: false,
              polygon: false,
              circle: false,
              marker: false,
              circlemarker: false,
              rectangle: true,
            }}
          />
        </FeatureGroup>
        {/* {trains.map((train) => {
                    return <Train key={train.train_index} train={train} onClick={handleTrainClick} onOutsideClick={handleMapClick} />
                })} */}
        {points.map((coords, idx) => (
          <Marker key={idx} position={coords}>
            <Popup>Точка {idx + 1}</Popup>
          </Marker>
        ))}
        {/* Линия между двумя первыми точками */}
        {points.length >= 2 && (
          <Polyline positions={[points[0], points[1]]} color="blue" />
        )}
        {rectangle && (
          <Rectangle bounds={rectangle} pathOptions={{ color: "blue" }} />
        )}
      </MapContainer>

      {/*<div className="button-container">*/}
      {/*  <button className={`map__button map__button_left ${isOpenHex ? "map__button_selected map__button_left_selected" : "" }`} type="button" onClick={handleToggleHex} />*/}
      {/*  <button className={`map__button map__button_right ${isOpenPolygon ? "map__button_selected map__button_right_selected" : "" }`} type="button" onClick={handleTogglePolygon} />*/}
      {/*</div>*/}
    </>
  );
}

export default ReactControlExample;
