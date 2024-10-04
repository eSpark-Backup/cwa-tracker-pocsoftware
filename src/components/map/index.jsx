import {
  GoogleMap,
  HeatmapLayer,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";

const libraries = ["places", "visualization", "marker"];

const TrackerMap = ({
  isLoading,
  trackers,
  selectedTracker,
  setSelectedTracker,
  containerStyle,
  center,
  setCenter,
  zoom,
  setZoom,
  selectedLayer,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: libraries,
  });

  const markersRef = useRef([]);
  const [map, setMap] = useState(null);
  const windyInstance = useRef(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    loadWindyLayer();
  }, []);

  const onDragEnd = useCallback(() => {
    if (map) {
      const newCenter = map.getCenter().toJSON();
      setCenter(newCenter);
    }
  }, [map]);

  const onZoomChanged = useCallback(() => {
    if (map) {
      const newZoom = map.getZoom();
      setZoom(newZoom);
      const newCenter = map.getCenter().toJSON();
      setCenter(newCenter);
    }
  }, [map]);

  const loadWindyLayer = () => {
    const script = document.createElement("script");
    script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
    script.id = "windy-script";
    script.async = true;
    script.onload = () => {
      const options = {
        key: import.meta.env.VITE_WINDY_MAP_API,
        lat: center.lat,
        lon: center.lng,
        zoom: zoom,
      };
      window.windyInit(options, (windy) => {
        windyInstance.current = windy;
        windy.map.setView([center.lat, center.lng], zoom);
      });
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (selectedLayer === "weather" && windyInstance.current) {
      windyInstance.current.map.invalidateSize()
    }
  }, [windyInstance.current, selectedLayer])

  useEffect(() => {
    if (windyInstance.current && trackers.length > 0) {
      trackers.forEach(tracker => {
        const iconUrl = selectedTracker === tracker.id ? "/red-marker.png" : "/blue-marker.png";
        const customIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
        const marker = L.marker([tracker.position.lat, tracker.position.lng], { icon: customIcon }).addTo(windyInstance.current.map);
        markersRef.current.push(marker);

        marker.on('click', () => {
          setSelectedTracker(tracker.id);
        });
      });
    }
  }, [trackers, windyInstance.current, selectedTracker])

  useEffect(() => {
    if (selectedLayer === "weather" && windyInstance.current) {
      const windyMap = windyInstance.current.map;

      const updateCenter = () => {
        const newCenter = windyMap.getCenter();
        setCenter({ lat: newCenter.lat, lng: newCenter.lng });
      };

      const updateZoom = () => {
        setZoom(windyMap.getZoom());
      };

      windyMap.on('moveend', updateCenter);
      windyMap.on('zoomend', updateZoom);

      return () => {
        windyMap.off('moveend', updateCenter);
        windyMap.off('zoomend', updateZoom);
      };
    }
  }, [selectedLayer, windyInstance.current]);

  useEffect(() => {
    if (selectedLayer !== "weather" && windyInstance.current) {
      windyInstance.current.map.setView([center.lat, center.lng], zoom);
    }
  }, [selectedLayer, center, zoom]);

  const onUnmount = useCallback(function callback() {
    markersRef.current = [];
    setMap(null);
    windyInstance.current = null;
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
        onDragEnd={onDragEnd}
        onZoomChanged={onZoomChanged}
        zoom={zoom}
        options={{
          minZoom: 3,
          maxZoom: 25,
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
      </GoogleMap>
      <div id="windy" style={{
        display: selectedLayer === "weather" ? "block" : "none",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: 1,
        border: "none",
      }}></div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default TrackerMap;
