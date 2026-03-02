import { useParams } from "react-router-dom";
import Chat from "../Chat.jsx";
import { useEffect } from "react";

export default function ChatPage({ chats, onSendMessage, typing, theme, toggleTheme }) {
  const { id } = useParams();
  const chat = chats.find(c => c.id === Number(id));

  useEffect(() => {
    document.body.classList.add("chat-open");
    return () => document.body.classList.remove("chat-open");
  }, []);

  return (
    <div className="chat-area">
      <Chat
        chat={chat}
        onSendMessage={onSendMessage}
        typing={typing}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}