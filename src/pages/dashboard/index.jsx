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
  const [enableEvent, setEnableEvent] = useState(false)
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
      } else if (error?.status === 404) {
        setEnableEvent(true)
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
        setEnableEvent(true)
      }
    })
  }

  useEffect(() => {
    fetchDevices();
  }, [])

  const token = localStorage.getItem("token")

  useEffect(() => {
    let reader;
    let retryTimeout;

    const fetchStream = async (trackers) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASEURL}/stream`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to connect to the stream.");
          return;
        }

        reader = response.body.getReader();
        const decoder = new TextDecoder();

        const processStream = ({ done, value }) => {
          if (done) {
            console.log("Stream has ended.");
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          const events = chunk.split("\n\n").filter(Boolean);

          events.forEach((event) => {
            if (event.startsWith("data: ")) {
              const jsonData = event.replace("data: ", "");
              const parsedData = JSON.parse(jsonData);

              const formattedDeviceData = {
                id: parsedData.device?.deviceId,
                name: parsedData.device?.deviceName,
                position: {
                  lat: parsedData.device?.location?.coordinates[0],
                  lng: parsedData.device?.location?.coordinates[1]
                }
              }
              if (parsedData.eventType === "device_created") {
                setTrackers([formattedDeviceData, ...trackers])
              } else if (parsedData.eventType === "location_update") {
                setTrackers(trackers.map(item => { if (item?.id === parsedData.device?.deviceId) { return formattedDeviceData } return item }))
              }
            }
          });

          reader.read().then(processStream);
        };

        reader.read().then(processStream);
      } catch (error) {
        console.error("Network error, attempting to reconnect...", error);
        retryTimeout = setTimeout(() => fetchStream(trackers), 5000);
      }
    };

    if (token && enableEvent) {
      fetchStream(trackers);
    }
  }, [token, trackers, enableEvent]);

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
