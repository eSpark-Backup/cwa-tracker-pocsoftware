import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import HeatmapLayer from "./heatMapLayer";
import WindLayer from "./windLayer";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const TrackerMap = ({
  trackers,
  selectedTracker,
  containerStyle,
  center,
  selectedLayer,
}) => {
  const heatData = trackers.map((tracker) => [
    tracker.position.lat,
    tracker.position.lng,
    1,
  ]);

  const mapRef = useRef(null);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={containerStyle}
      whenReady={(mapInstance) => {
        mapRef.current = mapInstance.target;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <HeatmapLayer data={heatData} />
      {selectedLayer === "wind" && <WindLayer map={mapRef.current} />}
      {selectedLayer === "temp" && (
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${
            import.meta.env.VITE_OPEN_WEATHER_API_KEY
          }`}
          attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        />
      )}
      {trackers.map((tracker) => (
        <Marker
          key={tracker.id}
          position={tracker.position}
          icon={L.divIcon({
            className:
              selectedTracker === tracker.id
                ? "selected-marker"
                : "default-marker",
            html: '<div style="width: 30px; height: 30px;"></div>',
          })}
        >
          <Popup>{tracker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TrackerMap;
