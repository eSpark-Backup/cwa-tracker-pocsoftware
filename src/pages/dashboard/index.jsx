import { useState } from "react";
import { TrackerMap } from "../../components";
import { useTranslation } from "react-i18next";

const trackers = [
  { id: 1, name: "Tracker 1", position: { lat: 51.505, lng: -0.09 } },
  { id: 2, name: "Tracker 2", position: { lat: 51.515, lng: -0.1 } },
  { id: 3, name: "Tracker 3", position: { lat: 51.525, lng: -0.12 } },
  { id: 4, name: "Tracker 4", position: { lat: 51.535, lng: -0.14 } },
];

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 51.505,
  lng: -0.09,
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [selectedTracker, setSelectedTracker] = useState(trackers[0].id);

  return (
    <div className="main">
      <div className="list-box">
        <h3 className="heading">{t("trackers")}</h3>
        <ul>
          {trackers.map((tracker) => (
            <li
              key={tracker.id}
              onClick={() => setSelectedTracker(tracker.id)}
              className={selectedTracker === tracker.id ? "active" : ""}
            >
              {tracker.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="map-box">
        <TrackerMap
          trackers={trackers}
          selectedTracker={selectedTracker}
          containerStyle={containerStyle}
          center={center}
        />
      </div>
    </div>
  );
};

export default Dashboard;
