import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { TrackerMap } from "../../components";
import { getGregorianDate, getHijriDate } from "../../utils";
import { useGetDevicesMutation } from "../../services/devices";
import { logout } from "../../store/slices/auth";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [trackers, setTrackers] = useState([]);
  const [selectedTracker, setSelectedTracker] = useState();
  const [selectedLayer, setSelectedLayer] = useState("");
  const [center, setCenter] = useState({
    lat: 21.422510,
    lng: 39.826168,
  })

  const [getDevices, { isLoading, isError, error }] = useGetDevicesMutation();

  useEffect(() => {
    if (isError) {
      if (error?.status === 401) {
        toast.error("Session expired")
        dispatch(logout())
      } else {
        toast.error(error?.data?.message || "Something went wrong");
      }
      return;
    }
  }, [isError]);

  const fetchDevices = async () => {
    await getDevices().then((res) => {
      if (res?.data) {
        const formattedData = res?.data?.items.map((item) => { return { id: item?.deviceId, name: item?.deviceName, position: { lat: item?.location?.coordinates[0], lng: item?.location?.coordinates[1] } } })
        setTrackers(formattedData)
        setSelectedTracker(formattedData[0].id)
        setCenter(formattedData[0].position)
      }
    })
  }

  useEffect(() => {
    fetchDevices()
  }, [])

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
            className={selectedLayer === "weather" ? "active" : ""}
            onClick={
              selectedLayer === "weather"
                ? () => setSelectedLayer("")
                : () => setSelectedLayer("weather")
            }
          >
            {t("weather")}
          </div>
        </div>
      </div>
      <div className="grid">
        <div className="list-box">
          <h3 className="heading">{t("trackers")}</h3>
          <ul>
            {isLoading ? <p className="no-trackers">Loading</p> : trackers.length > 0 ? trackers.map((tracker) => (
              <li
                key={tracker.id}
                onClick={() => setSelectedTracker(tracker.id)}
                className={selectedTracker === tracker.id ? "active" : ""}
              >
                {tracker.name}
              </li>
            ))
              : <p className="no-trackers">No Devices Found</p>}
          </ul>
        </div>

        <div className="map-box">
          <TrackerMap
            isLoading={isLoading}
            selectedLayer={selectedLayer}
            trackers={trackers}
            setSelectedTracker={setSelectedTracker}
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
