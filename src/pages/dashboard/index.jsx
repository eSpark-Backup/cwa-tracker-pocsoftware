import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [trackers, setTrackers] = useState([]);
  const [selectedTracker, setSelectedTracker] = useState();
  const [selectedLayer, setSelectedLayer] = useState("");
  const [zoom, setZoom] = useState(5)
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
        navigate("/sign-in")
      } else {
        toast.error(error?.data?.message || "Something went wrong");
      }
      return;
    }
  }, [isError]);

  const fetchDevices = async (trackers) => {
    await getDevices().then((res) => {
      if (res?.data) {
        const formattedData = res?.data?.items.map((item) => { return { id: item?.deviceId, name: item?.deviceName, position: { lat: item?.location?.coordinates[0], lng: item?.location?.coordinates[1] } } })
        if (JSON.stringify(trackers) === JSON.stringify(formattedData)) return;
        setTrackers(formattedData)
        if (!trackers) {
          setSelectedTracker(formattedData[0].id)
          setCenter(formattedData[0].position)
        }
      }
    })
  }

  useEffect(() => {
    fetchDevices();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDevices(trackers);
    }, 120000);

    return () => clearInterval(interval);
  }, [trackers])

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
          {useMemo(() => (
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
          ), [trackers, selectedTracker])}
        </div>

        <div className="map-box">
          {useMemo(() => (
            <TrackerMap
              isLoading={isLoading}
              selectedLayer={selectedLayer}
              trackers={trackers}
              setSelectedTracker={setSelectedTracker}
              selectedTracker={selectedTracker}
              containerStyle={containerStyle}
              center={center}
              setCenter={setCenter}
              zoom={zoom}
              setZoom={setZoom}
            />
          ), [trackers, selectedLayer, selectedTracker, containerStyle, center, zoom])}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
