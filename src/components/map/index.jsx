import {
  GoogleMap,
  HeatmapLayer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

const libraries = ["places", "visualization", "marker"];

const TrackerMap = ({
  isLoading,
  trackers,
  selectedTracker,
  setSelectedTracker,
  containerStyle,
  center,
  selectedLayer,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: libraries,
  });

  const markersRef = useRef([]);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    markersRef.current.forEach((marker) => marker.setMap(null));
    setMap(null);
  }, []);

  if (!isLoaded || typeof window.google === "undefined") {
    return <div>Loading...</div>;
  }

  const heatData = trackers.map((tracker) => ({
    location: new window.google.maps.LatLng(
      tracker.position.lat,
      tracker.position.lng
    ),
    weight: 1,
  }));

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        options={{
          minZoom: 3,
          maxZoom: 15,
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              east: 180,
              west: -180,
            },
            strictBounds: false,
          },
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
      >
        <HeatmapLayer data={heatData} options={{ radius: 20 }} />

        {!isLoading && trackers.map((tracker) => (
          <Marker
            onClick={() => setSelectedTracker(tracker.id)}
            key={tracker.id}
            position={tracker.position}
            icon={{
              url:
                selectedTracker === tracker.id
                  ? "/red-marker.png"
                  : "/blue-marker.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}
        <iframe
          src={`https://embed.windy.com/embed2.html?lat=${center.lat}&lon=${center.lng}&detailLat=${center.lat}&detailLon=${center.lng}&marker=false`}
          style={{
            display: selectedLayer === "weather" ? "block" : "none",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            border: "none",
          }}
        ></iframe>
      </GoogleMap>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default TrackerMap;
