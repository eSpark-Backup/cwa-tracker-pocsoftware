import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginAction } from "../../../store/slices/auth";
import {
  useGenerateQRMutation,
  useVerifyTokenMutation,
} from "../../../services/auth";
import { AuthBox, Button, TextInput } from "../../../components";

const FAuth = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const [qrcode, setQrcode] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const authToken = searchParams.get("token");
  const name = searchParams.get("email");
  const [
    generate,
    { isLoading: isQRloading, isError: isQRerror, error: QRerror },
  ] = useGenerateQRMutation();

  useEffect(() => {
    if (isQRerror) {
      toast.error(QRerror?.data?.message || "Something went wrong");
      return;
    }
  }, [isQRerror]);

  useEffect(() => {
    const generateQR = async (email) => {
      const result = await generate({ email });
      if (result?.data) {
        setQrcode(result?.data?.qrCode);
      }
    };
    if (email) {
      generateQR(email);
    }
  }, [email]);

  const [verify, { isLoading, isError, error }] = useVerifyTokenMutation();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
      return;
    }
  }, [isError]);

  const handleVerify = async (e) => {
    e.preventDefault();
    await verify({ email, token: code }).then((res) => {
      if (res?.data) {
        const authObj = {
          user: {
            name,
            email,
          },
          token: authToken,
        };
        dispatch(loginAction(authObj));
        setCode("");
        toast.success("Login successfull");
        navigate("/dashboard");
      }
    });
  };

  return (
    <AuthBox>
      <form onSubmit={handleVerify}>
        <p className="auth-heading">{t("scan_code")}</p>
        {!isQRloading ? (
          qrcode ? (
            <img className="qr-code" src={qrcode} alt="qr-code" />
          ) : (
            <p>Error generating QR code</p>
          )
        ) : (
          <p>Generating QR code</p>
        )}
        <TextInput
          label={t("code")}
          handleChange={(val) => {
            setCode(val);
          }}
          value={code}
          type="text"
          required
        />
        <Button isLoading={isLoading} type="submit">
          {t("scan_code")}
        </Button>
      </form>
    </AuthBox>
  );
};

export default FAuth;
