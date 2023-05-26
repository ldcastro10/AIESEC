import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = (props) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaValidated, setRecaptchaValidated] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState("");
  const [ip, setIp] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const isBlocked = localStorage.getItem("blocked");
    if (isBlocked === "true") {
      setBlocked(true);
      setBlockInfo("Usted ha sido bloqueado por IP. Por favor, contacte al administrador.");
    }
    const getDeviceInfo = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const ip = response.data.ip;
        setIp(ip)
        const device = isWindows10() ? "Windows 10" : navigator.platform;
        setDeviceInfo(`Dispositivo: ${device}, IP: ${ip}`);
      } catch (error) {
        console.error("Error al obtener información de dispositivo e IP:", error);
      }
    };
    getDeviceInfo();
  }, []);

  const isWindows10 = () => {
    const userAgent = navigator.userAgent;
    return userAgent.indexOf("Windows NT 10.0") !== -1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (correo === "luiscastro2000@outlook.com" && password === "ClienteMati987*") { 
      if (isWindows10() || ip === "191.156.151.88") {
        setShowCaptcha(true)
      }
      else if (!isWindows10() && ip === "191.156.151.88") {
        setBlocked(true);
        setBlockInfo("Usted ha sido bloqueado por IP. Por favor, contacte al administrador.");
        localStorage.setItem("blocked", "true");
      } else {
        sendConfirmationEmail();
      }
    } else {
      alert("Por favor, llene ambos campos")
    }
  };
  
  const handleRecaptchaChange = (value) => {
    if (value) {
      setRecaptchaValidated(true);
      sendConfirmationEmail();
      setShowCaptcha(false)
    }
  };

  const sendConfirmationEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3003/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Correo de confirmación enviado. Por favor, revise su bandeja de entrada.");
      } else {
        alert("Error al enviar correo de confirmación.");
      }
    } catch (error) {
      console.error("Error al enviar correo de confirmación:", error);
    } finally {
      setCorreo("");
      setPassword("");
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="form">
      {loading && <LoadingSpinner />}
      {blocked ? (
        <div className="error-mesage">{blockInfo}</div>
      ) : (
        <div className="form">
          <form onSubmit={handleSubmit}>
            {!showCaptcha && (
              <>
                <label htmlFor="email" className="input-label">Correo:</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="Correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
                <label htmlFor="password" className="input-label">Contraseña:</label>
                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="button" type="submit">
                  Ingresar
                </button>
              </>
            )}
            {showCaptcha && (
              <ReCAPTCHA
                sitekey="6LcSWTMlAAAAAAHdzDzMJLdXXTV4JpHWVsjgAFN_"
                onChange={handleRecaptchaChange}
              />
            )}
          </form>
          {deviceInfo && <div className="device-info">{deviceInfo}</div>}
        </div>
      )}
    </div>
  );

};

export default Login;
