import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const TrackerMap = ({ trackers, selectedTracker, containerStyle, center }) => {
  return (
    <MapContainer center={center} zoom={13} style={containerStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
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
