import "../styles/login.css";
export default function Login({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Te damos la bienvenida a WhatsApp</h1>

        <p className="login-desc">
          Simple, confiable y privado. Enviá mensajes privados, hacé llamadas y compartí archivos con tus amigos, familiares y colegas.
        </p>

        <button className="login-btn" onClick={onLogin}>
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}