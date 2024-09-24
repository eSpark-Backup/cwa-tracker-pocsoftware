import { useEffect } from "react";
import L from "leaflet";
import "leaflet-velocity";
import "leaflet/dist/leaflet.css";

const WindLayer = ({ map }) => {
  let windLayer;
  useEffect(() => {
    fetch("https://onaci.github.io/leaflet-velocity/wind-global.json")
      .then((response) => response.json())
      .then((data) => {
        windLayer = L.velocityLayer({
          displayValues: true,
          displayOptions: {
            velocityType: "wind",
            position: "bottomleft",
            emptyString: "",
          },
          data,
          maxVelocity: 0.6,
          velocityScale: 0.01,
          lineWidth: 2,
          colorScale: [
            "#3288bd",
            "#99d594",
            "#e6f598",
            "#fee08b",
            "#f46d43",
            "#d53e4f",
          ],
        });

        windLayer.addTo(map);
      })
      .catch((err) => console.log(err));

    return () => {
      map.removeLayer(windLayer);
    };
  }, [map]);
};

export default WindLayer;
