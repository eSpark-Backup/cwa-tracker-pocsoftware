import { useTranslation } from "react-i18next";

const Button = ({ children, isLoading, type }) => {
  const { t } = useTranslation();
  return (
    <button disabled={isLoading} type={type} className="btn auth-btn">
      {isLoading ? t("loading") : children}
    </button>
  );
};

export default Button;
