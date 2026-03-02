import QRCode from "react-qr-code";
import "../styles/loginQR.css";

export default function LoginQR({ onConfirm }) {
  return (
    <div className="qr-container">

      {/* LADO IZQUIERDO */}
      <div className="qr-left">
        <h1 className="qr-title">Accedé a WhatsApp</h1>

        <ol className="qr-steps">
          <li>Escaneá el código QR con la cámara del teléfono.</li>
          <li>Tocá el enlace para abrir WhatsApp.</li>
          <li>Volvé a escanear el código QR para vincular tu cuenta.</li>
        </ol>

        <a className="qr-help" href="#">
          ¿Necesitás ayuda?
        </a>
      </div>

      {/* LADO DERECHO */}
      <div className="qr-right">
        <div className="qr-box">
          <div className="qr-code-wrapper">
            <div className="qr-wrapper-relative">
              <QRCode
                value="https://tu-app.com/login"
                size={260}
                bgColor="#ffffff"
                fgColor="#000000"
              />

              {/* LOGO SUPERPUESTO */}
              <img
                src="/images/logo-whatsapp.svg"
                alt="logo"
                className="qr-logo"
              />
            </div>
          </div>
        </div>

        <button className="qr-phone-login" onClick={onConfirm}>
          Iniciar sesión con número de teléfono
        </button>
      </div>

    </div>
  );
}