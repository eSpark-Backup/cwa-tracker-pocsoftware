import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  L.heatLayer(data, {
    radius: 25,
    blur: 25,
    maxZoom: 10,
  }).addTo(map);

  return null;
};

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

  return (
    <MapContainer center={center} zoom={13} style={containerStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <HeatmapLayer data={heatData} />
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
