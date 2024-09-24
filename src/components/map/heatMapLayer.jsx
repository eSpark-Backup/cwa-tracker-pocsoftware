import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    const heatMapLayer = L.heatLayer(data, {
      radius: 25,
      blur: 25,
      maxZoom: 10,
    });

    heatMapLayer.addTo(map);

    return () => {
      map.removeLayer(heatMapLayer);
    };
  }, [data, map]);

  return null;
};

export default HeatmapLayer;
