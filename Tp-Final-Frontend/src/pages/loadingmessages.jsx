export default function LoadingMessages() {
  return (
    <div style={{
      height: "100vh",
      width: "100%",
      background: "#111b21",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "20px",
      gap: "20px",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 9999
    }}>
      
      <div style={{
        width: "40px",
        height: "40px",
        border: "4px solid #2a3942",
        borderTop: "4px solid #00a884",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />

      <p>Cargando mensajes…</p>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}