import { useRef, useState } from "react";
import { arabicFlag, englishFlag } from "../assets";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../store/slices/lang";
import i18n from "i18next";
import { getInitial, useClickOutside } from "../utils";
import { logout } from "../store/slices/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentLanguage = useSelector((state) => state.language);
  const { user } = useSelector((state) => state.auth);

  const [openLang, setOpenLang] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(arabicFlag);

  const language = {
    ar: arabicFlag,
    en: englishFlag,
  };

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
    dispatch(changeLanguage(lng));
    setSelectedLang(language[lng]);
    setOpenLang(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  const popupRef = useRef();
  useClickOutside(popupRef, () => setOpenLang(false));

  const logoutRef = useRef();
  useClickOutside(logoutRef, () => setOpenLogout(false));

  return (
    <div className="header">
      <p className="logo">{t("logo")}</p>
      <div className="right-content">
        <div ref={popupRef} className="flag">
          <img
            onClick={() => setOpenLang(!openLang)}
            src={selectedLang}
            alt="flag"
          />
          <div
            style={{ display: openLang ? "flex" : "none" }}
            className="lang-popup"
          >
            <div
              style={{
                background:
                  currentLanguage === "ar" ? "#0000002b" : "transparent",
              }}
              onClick={() => switchLanguage("ar")}
              className="lang-box"
            >
              <img src={arabicFlag} alt="flag" />
              <p>Arabic</p>
            </div>
            <div
              style={{
                background:
                  currentLanguage === "en" ? "#0000002b" : "transparent",
              }}
              onClick={() => switchLanguage("en")}
              className="lang-box"
            >
              <img src={englishFlag} alt="flag" />
              <p>English</p>
            </div>
          </div>
        </div>
        {token && (
          <div
            style={{ position: "relative" }}
            onClick={() => setOpenLogout(!openLogout)}
            ref={logoutRef}
          >
            <p className="avatar">{getInitial(user?.name)}</p>
            <div
              style={{ display: openLogout ? "flex" : "none" }}
              className="logout-popup"
            >
              <p onClick={handleLogout}>Log Out</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
