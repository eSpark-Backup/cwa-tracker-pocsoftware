import { useEffect, useState } from "react";
import { AuthBox, Button, TextInput } from "../../../components";
import { useSignupMutation } from "../../../services/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";

const SignUp = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [singup, { isLoading, isError, error }] = useSignupMutation();
  const [form, setForm] = useState({
    name: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.name.length < 3) {
      toast.error("Please enter atleast 3 characters in name")
      return;
    }
    if (form.password.length < 6) {
      toast.error("Please enter atleast 6 characters in password")
      return;
    }
    await singup(form).then((res) => {
      if (res?.data) {
        setForm({
          name: "",
          email: "",
          password: "",
        });
        navigate(
          `/2fa?email=${res?.data?.email}&token=${res?.data?.token}&${res?.data?.name}`
        );
      }
    });
  };

  return (
    <AuthBox>
      <form onSubmit={handleSignup}>
        <p className="auth-heading">{t("sign_up")}</p>
        <TextInput
          label={t("name")}
          name="name"
          handleChange={handleChange}
          value={form.name}
          type="text"
          required
        />
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
          {t("sign_up")}
        </Button>
        <Link
          style={{ width: "100%", color: "#000", marginTop: "-20px" }}
          to="/sign-in"
        >
          {t("already_have_account")}
        </Link>
      </form>
    </AuthBox>
  );
};

export default SignUp;
