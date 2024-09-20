import { useEffect, useState } from "react";
import { Button, TextInput } from "../../../components";
import { useLoginMutation } from "../../../services/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

const SignIn = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (val, name) => {
    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
      return;
    }
  }, [isError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result?.data) {
      toast.success("Login successfull");
      navigate("/dashboard");
      setForm({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-side">
          <p className="auth-logo">{t("logo")}</p>
          <p className="auth-text">{t("auth_login_text")}</p>
        </div>
        <div className="auth-form">
          <form onSubmit={handleLogin}>
            <p className="auth-heading">{t("sign_in")}</p>
            <TextInput
              label={t("email")}
              name="email"
              handleChange={handleChange}
              value={form.email}
              type="email"
              required
            />
            <TextInput
              label={t("password")}
              name="password"
              handleChange={handleChange}
              value={form.password}
              type="password"
              required
            />
            <Button loading={isLoading} type="submit">
              {t("sign_in")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
