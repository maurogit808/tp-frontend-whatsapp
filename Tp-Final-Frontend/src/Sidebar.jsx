function Sidebar({ chats, onSelectChat, selectedChatId, searchQuery, setSearchQuery }) {
  // Ordenar chats: primero los no leídos
  const sortedChats = [...chats].sort((a, b) => {
    if (a.unread > 0 && b.unread === 0) return -1;
    if (a.unread === 0 && b.unread > 0) return 1;
    return 0;
  });

  return (
    <div className="sidebar">

      {/* Header */}
      <div className="sidebar-header">
        Chats
      </div>

      {/* Buscador */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Buscar chats"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sidebar-search-input"
        />
      </div>

      {/* Lista de chats */}
      <div className="sidebar-list">
        {sortedChats.map(chat => {
          const lastMsg = chat.messages[chat.messages.length - 1];

          return (
            <div
              key={chat.id}
              className={`sidebar-item ${chat.id === selectedChatId ? "active" : ""}`}
              onClick={() => onSelectChat(chat.id)}
            >
              {/* Avatar */}
              <img
                src={chat.avatar}
                alt={chat.name}
                className="sidebar-avatar"
              />

              {/* Nombre + último mensaje */}
              <div className="sidebar-chat-info">
                <div className="sidebar-chat-name">{chat.name}</div>

                <div className="sidebar-chat-lastmsg">
                  {lastMsg?.text || (lastMsg?.audio ? "Audio" : "")}
                </div>
              </div>

              {/* Hora del último mensaje */}
              <div className="sidebar-chat-time">
                {lastMsg?.time}
              </div>

              {/* Badge de mensajes no leídos */}
              {chat.unread > 0 && (
                <div className="unread-badge">{chat.unread}</div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Sidebar;