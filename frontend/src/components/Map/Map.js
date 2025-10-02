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
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { useEventHandlers } from "@react-leaflet/core";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./Map.css";
import useForceUpdateGeoJson from "./useForceUpdateGeoJson";
import HoverCard from "../MapHoverCard/HoverCard";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import useFetch from "../../hooks/useFetch";
import MarkerClusterGroup from "../MarkerClusterGroup/MarkerClusterGroup";
import { useData } from "../Filters/components/DataContext/DataContext";
import TabBar from "../TabBar";
import MKDPopup from "../MKDPopup";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

// Status color mapping for regions
const STATUS_COLORS = {
  Зеленый: "#28a745", // Green
  Оранжевый: "#fd7e14", // Orange
  Желтый: "#F6C84E", // Yellow (matching original ITP_yellow)
};

// Removed hardcoded points - now using dynamic regions data
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
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [onChange]);
  useEventHandlers({ instance: parentMap }, handlers);

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />;
}

function MinimapControl({ position, zoom }) {
  const parentMap = useMap();
  const mapZoom = zoom || 8;

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
    [parentMap, mapZoom]
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
  // const { setRegions } = useData();
  // Fetch regions data from API
  const itpData = useFetch("http://5.129.195.176:8080/api/region/itp");
  const mkdData = useFetch("http://5.129.195.176:8080/api/region/mkd");

  console.log(itpData.data);
  console.log(mkdData.data);
  // setRegions(regions);
  const dataKey = useForceUpdateGeoJson(data);
  // Removed unused state variables
  const [rectangle, setRectangle] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    itp: true,
    mkd: false
  });

  const handleLayerToggle = (layer) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // Function to create colored marker icons similar to ITP_yellow
  const createColoredIcon = (status) => {
    const color = STATUS_COLORS[status] || "#6c757d"; // Default gray for unknown status

    // Get status letter for the icon
    const statusLetter =
      {
        Зеленый: "З", // Green
        Оранжевый: "О", // Orange
        Желтый: "Ж", // Yellow
      }[status] || "?";

    // Create SVG-based marker similar to ITP_yellow
    const svgIcon = `
      <svg width="32" height="42" viewBox="0 0 50 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 7C0 4.79086 1.79086 3 4 3H46C48.2091 3 50 4.79086 50 7V53C50 55.2091 48.2091 57 46 57H34.6569C33.596 57 32.5786 57.4214 31.8284 58.1716L27.8284 62.1716C26.2663 63.7337 23.7337 63.7337 22.1716 62.1716L18.1716 58.1716C17.4214 57.4214 16.404 57 15.3431 57H4C1.79086 57 0 55.2091 0 53V7Z" fill="${color}"/>
        <text x="25" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${statusLetter}</text>
      </svg>
    `;

    return new L.DivIcon({
      className: "custom-svg-icon",
      html: svgIcon,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  };

  // Function to create house icons for MKD
  const createHouseIcon = () => {
    const svgIcon = `
      <svg width="32" height="42" viewBox="0 0 50 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 7C0 4.79086 1.79086 3 4 3H46C48.2091 3 50 4.79086 50 7V53C50 55.2091 48.2091 57 46 57H34.6569C33.596 57 32.5786 57.4214 31.8284 58.1716L27.8284 62.1716C26.2663 63.7337 23.7337 63.7337 22.1716 62.1716L18.1716 58.1716C17.4214 57.4214 16.404 57 15.3431 57H4C1.79086 57 0 55.2091 0 53V7Z" fill="#4facfe"/>
        <path d="M25 15L15 23V40H20V32H30V40H35V23L25 15Z" fill="white"/>
        <path d="M22 26H28V30H22V26Z" fill="#4facfe"/>
      </svg>
    `;

    return new L.DivIcon({
      className: "custom-svg-icon",
      html: svgIcon,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  };

  // Removed customIcon - now using createColoredIcon function
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

  // Removed unused toggle functions

  const onCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "rectangle") {
      const bounds = layer.getBounds();
      console.log("Rectangle created with bounds:", bounds);
      setRectangle(bounds);
      // Удаляем исходный прямоугольник, так как мы будем рендерить его через компонент Rectangle
      e.layer.remove();
    }
  };

  const handleDeleteRectangle = () => {
    setRectangle(null);
  };

  return (
    <>
      <TabBar activeLayers={activeLayers} onLayerToggle={handleLayerToggle} />
      {rectangle && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleDeleteRectangle}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Удалить прямоугольник
          </button>
        </div>
      )}
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
        {/* <MinimapControl position="topright" /> */}
        {/* <LocationMarker setCoordinatesPoint={setCoordinatesPoint} /> */}
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
        {/* Render ITP markers with clustering */}
        {activeLayers.itp && itpData.data && itpData.data.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            removeOutsideVisibleBounds={true}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              const markers = cluster.getAllChildMarkers();

              // Determine cluster color based on status distribution
              const statusCounts = markers.reduce((acc, marker) => {
                const status = marker.options.status || "unknown";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
              }, {});

              // Get the most common status
              const dominantStatus = Object.keys(statusCounts).reduce((a, b) =>
                statusCounts[a] > statusCounts[b] ? a : b
              );

              const clusterColor = STATUS_COLORS[dominantStatus] || "#6c757d";

              return new L.DivIcon({
                html: `<div style="
                  background-color: ${clusterColor};
                  border: 3px solid white;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">${count}</div>`,
                className: "custom-cluster-icon",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });
            }}
          >
            {itpData.data.map((region) => (
              <Marker
                key={region.id}
                position={[region.latitude, region.longitude]}
                icon={createColoredIcon(region.status)}
                status={region.status}
              >
                <Popup>
                  <div>
                    <h4>{region.region}</h4>
                    <p>
                      <strong>Район:</strong> {region.district}
                    </p>
                    <p>
                      <strong>Диспетчер:</strong> {region.dispatcher}
                    </p>
                    <p>
                      <strong>Статус:</strong>{" "}
                      <span style={{ color: STATUS_COLORS[region.status] }}>
                        {region.status}
                      </span>
                    </p>
                    <p>
                      <strong>ID:</strong> {region.id}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}

        {/* Render MKD markers with clustering */}
        {activeLayers.mkd && mkdData.data && mkdData.data.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            removeOutsideVisibleBounds={true}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();

              return new L.DivIcon({
                html: `<div style="
                  background-color: #4facfe;
                  border: 3px solid white;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">${count}</div>`,
                className: "custom-cluster-icon",
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });
            }}
          >
            {mkdData.data.map((mkd) => (
              <Marker
                key={mkd.id}
                position={[mkd.latitude, mkd.longitude]}
                icon={createHouseIcon()}
              >
                <Popup>
                  <MKDPopup mkdData={mkd} />
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
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
