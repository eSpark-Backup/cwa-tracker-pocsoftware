import { useEffect, useState } from "react";
import { AuthBox, Button, TextInput } from "../../../components";
import { useLoginMutation } from "../../../services/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAction } from "../../../store/slices/auth";

const SignIn = () => {
  const dispatch = useDispatch();
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
    await login(form).then((res) => {
      if (res?.data) {
        if (res?.data?.data?.is2FAEnabled) {
          const authObj = {
            user: {
              name: res?.data?.data?.name,
              email: res?.data?.data?.email,
            },
            token: res?.data?.data?.token,
          };
          dispatch(loginAction(authObj));
          setForm({
            email: "",
            password: "",
          });
          toast.success("Login successfull");
          navigate("/dashboard");
        } else {
          setForm({
            email: "",
            password: "",
          });
          navigate(
            `/2fa?email=${res?.data?.data?.email}&token=${res?.data?.data?.token}&name=${res?.data?.data?.name}`
          );
        }
      }
    });
  };

  return (
    <AuthBox>
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
        <Button isLoading={isLoading} type="submit">
          {t("sign_in")}
        </Button>
        <Link
          style={{ width: "100%", color: "#000", marginTop: "-20px" }}
          to="/sign-up"
        >
          {t("create_new_acc")}
        </Link>
      </form>
    </AuthBox>
  );
};

export default SignIn;
