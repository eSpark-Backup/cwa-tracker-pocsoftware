import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./layout/header";
import Routes from "./route/index";
import "./language/i18n";
import { useSelector } from "react-redux";

const App = () => {
  const language = useSelector(state => state.language)
  return (
    <>
      <div className={`main-layout ${language}`}>
        <Header />
        <div className="layout">
          <Routes />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition:Bounce
      />
    </>
  );
};

export default App;
