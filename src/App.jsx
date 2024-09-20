import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import Header from "./layout/header";
import Routes from "./route/index";
import "./language/i18n";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <div className="main-layout">
          <Header />
          <div className="layout">
            <Routes />
          </div>
        </div>
      </Provider>
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
