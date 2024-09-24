import { useState } from "react";
import { TrackerMap } from "../../components";
import { useTranslation } from "react-i18next";
import { getGregorianDate, getHijriDate } from "../../utils";

const trackers = [
  { id: 1, name: "Tracker 1", position: { lat: 51.505, lng: -0.09 } },
  { id: 2, name: "Tracker 2", position: { lat: 51.515, lng: -0.1 } },
  { id: 3, name: "Tracker 3", position: { lat: 51.525, lng: -0.12 } },
  { id: 4, name: "Tracker 4", position: { lat: 51.535, lng: -0.14 } },
];

const containerStyle = {
  width: "100%",
  height: "460px",
};

const center = {
  lat: 51.505,
  lng: -0.09,
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [selectedTracker, setSelectedTracker] = useState(trackers[0].id);
  const [selectedLayer, setSelectedLayer] = useState("");

  return (
    <div className="main">
      <div className="sub-header">
        <div className="dates">
          <div>
            <p>{t("gregorian_date")}: </p>
            <p>{getGregorianDate()}</p>
          </div>
          <div>
            <p>{t("hijri_date")}: </p>
            <p>{getHijriDate()}</p>
          </div>
        </div>
        <div className="weather-tabs">
        <div
            className={selectedLayer === "temp" ? "active" : ""}
            onClick={
              selectedLayer === "temp"
                ? () => setSelectedLayer("")
                : () => setSelectedLayer("temp")
            }
          >
            {t("temp")}
          </div>
          <div
            className={selectedLayer === "wind" ? "active" : ""}
            onClick={
              selectedLayer === "wind"
                ? () => setSelectedLayer("")
                : () => setSelectedLayer("wind")
            }
          >
            {t("wind")}
          </div>
        </div>
      </div>
      <div className="grid">
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
            selectedLayer={selectedLayer}
            trackers={trackers}
            selectedTracker={selectedTracker}
            containerStyle={containerStyle}
            center={center}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
