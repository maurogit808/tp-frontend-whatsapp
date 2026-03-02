import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function formatDateLabel(dateString) {
  const today = new Date();
  const date = new Date(dateString);

  const todayYMD = today.toISOString().split("T")[0];
  const msgYMD = date.toISOString().split("T")[0];

  if (msgYMD === todayYMD) return "Hoy";

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayYMD = yesterday.toISOString().split("T")[0];

  if (msgYMD === yesterdayYMD) return "Ayer";

  return date.toLocaleDateString("es-AR", { weekday: "long" });
}

function formatLastSeen(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  if (isNaN(date.getTime())) {
    return "última vez recientemente";
  }

  const ymd = date.toISOString().split("T")[0];
  const todayYMD = today.toISOString().split("T")[0];
  const time = date.toTimeString().slice(0, 5);

  if (ymd === todayYMD) {
    return `última vez hoy a las ${time}`;
  }

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayYMD = yesterday.toISOString().split("T")[0];

  if (ymd === yesterdayYMD) {
    return `última vez ayer a las ${time}`;
  }

  const weekday = date.toLocaleDateString("es-AR", { weekday: "long" });

  return `última vez el ${weekday} a las ${time}`;
}

export default function Chat({ chat, onSendMessage, typing, toggleTheme }) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
    // 🎤 Estados para la grabación (C2)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState("0:00");
  const [recordingSeconds, setRecordingSeconds] = useState(0);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (text.trim() === "") return;
    onSendMessage(chat.id, text);
    setText("");
  };

  // 🔊 Enviar audio simulado
  const handleSendAudio = () => {
    onSendMessage(chat.id, {
      audio: true,
      duration: "0:07"
    });
  };
  const startRecording = () => {
  setRecordingSeconds(0);
  setRecordingTime("0:00");
  setIsRecording(true);
};

const cancelRecording = () => {
  setIsRecording(false);
  setRecordingSeconds(0);
};

const sendRecording = () => {
  if (!isRecording) return;

  onSendMessage(chat.id, {
    audio: true,
    duration: recordingTime
  });

  setIsRecording(false);
};

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, typing]);
  useEffect(() => {
  if (!isRecording) return;

  const interval = setInterval(() => {
    setRecordingSeconds(prev => {
      const next = prev + 1;
      const m = Math.floor(next / 60);
      const s = (next % 60).toString().padStart(2, "0");
      setRecordingTime(`${m}:${s}`);
      return next;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [isRecording]);


  return (
    <>
      {/* HEADER */}
      <div className="chat-header">

        <span className="back-button" onClick={() => navigate("/home")}>
          ←
        </span>

        <img src={chat.avatar} alt={chat.name} />

        <div className="info">
          <div className="name">{chat.name}</div>

          {typing ? (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          ) : (
            <div className="last-seen">{formatLastSeen(chat.lastSeen)}</div>
          )}
        </div>

        <div className="icons">
          <i className="bi bi-telephone header-icon"></i>
          <i className="bi bi-camera-video header-icon"></i>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title="Cambiar tema"
          >
            🌓
          </button>

          <i className="bi bi-three-dots-vertical header-icon"></i>
        </div>
      </div>

      {/* MENSAJES */}
      <div className="chat-background">
        {chat.messages.map((msg, index) => {
          const prev = chat.messages[index - 1];
          const showDate = !prev || prev.date !== msg.date;

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="date-label">
                  {formatDateLabel(msg.date)}
                </div>
              )}

              <div
                className={`message-wrapper ${msg.from === "me" ? "right" : "left"}`}
              >
                <div className={`message ${msg.from === "me" ? "me" : "other"}`}>

   {msg.audio ? (
  <div
    className="audio-message"
    onClick={(e) => {
      const container = e.currentTarget;
      const btnIcon = container.querySelector(".audio-play-btn i");

      container.classList.toggle("playing");

      if (container.classList.contains("playing")) {
        btnIcon.classList.remove("bi-play-fill");
        btnIcon.classList.add("bi-pause-fill");
      } else {
        btnIcon.classList.remove("bi-pause-fill");
        btnIcon.classList.add("bi-play-fill");
      }
    }}
  >
    <button className="audio-play-btn">
      <i className="bi bi-play-fill"></i>
    </button>

    <div className="audio-center">
      <div className="audio-wave">
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
        <div className="wave-bar"></div>
      </div>

      <span
        className="audio-speed"
        onClick={(e) => {
          e.stopPropagation();
          const order = ["1x", "1.5x", "2x"];
          const current = e.currentTarget.innerText || "1x";
          const idx = order.indexOf(current);
          e.currentTarget.innerText = order[(idx + 1) % order.length];
        }}
      >
        1x
      </span>

      <span className="audio-duration">{msg.duration}</span>
    </div>
  </div>
) : (
  <>
    {chat.personality === "grupo" && msg.from === "other"
      ? msg.text.split("\n").map((line, index) =>
          index === 0 ? (
            <div key={index} style={{ fontWeight: "bold" }}>{line}</div>
          ) : (
            <div key={index}>{line}</div>
          )
        )
      : <div>{msg.text}</div>}
  </>
)}

                  <div className="message-time-container">
                    <span className="message-time">{msg.time}</span>

                    {msg.from === "me" && (
                      <span
                        className={msg.read ? "tick-blue" : ""}
                        dangerouslySetInnerHTML={{
                          __html: msg.read
                            ? `<svg viewBox="0 0 16 15" width="16" height="15" fill="#53bdeb"><path d="M15.01 3.316l-8.47 8.47-.707-.707 8.47-8.47z"/><path d="M5.646 11.076l-.707.707-4.242-4.243.707-.707z"/><path d="M12.01 3.316l-8.47 8.47-.707-.707 8.47-8.47z"/></svg>`
                            : `<svg viewBox="0 0 16 15" width="16" height="15" fill="#8696a0"><path d="M15.01 3.316l-8.47 8.47-.707-.707 8.47-8.47z"/><path d="M5.646 11.076l-.707.707-4.242-4.243.707-.707z"/><path d="M12.01 3.316l-8.47 8.47-.707-.707 8.47-8.47z"/></svg>`
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
        {isRecording && (
  <div className="recording-bar">
    <div className="recording-left">
      <div className="trash-icon" onClick={cancelRecording}>🗑️</div>
      <div className="recording-dot"></div>
      <span className="recording-time">{recordingTime}</span>
    </div>

    <div className="recording-wave">
      <div className="recording-wave-bar"></div>
      <div className="recording-wave-bar"></div>
      <div className="recording-wave-bar"></div>
      <div className="recording-wave-bar"></div>
    </div>

    <button className="recording-send" onClick={sendRecording}>
      ➤
    </button>
  </div>
)}

      <div className="input-area">
        <i className="bi bi-emoji-smile input-icon"></i>
        <i className="bi bi-paperclip input-icon"></i>

        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Escribí un mensaje..."
          className="input-box"
        />

        {/* 🔊 MIC */}
       <i
  className="bi bi-mic-fill input-icon"
  style={{ color: "#00a884" }}
  onClick={startRecording}
></i>
      </div>
    </>
  );
}