const initialChats = [
  {
    id: 1,
    name: "mama",
    avatar: "https://i.pravatar.cc/150?img=47",
    personality: "mama",
    memory: [],
    unread: 1, // ← tiene un mensaje sin leer
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "me", text: "Hola ma!", time: "18:02", date: "2026-02-24", read: true },
      { id: 2, from: "other", text: "Hola hijo ❤️", time: "18:03", date: "2026-02-24" },
      { id: 3, from: "other", text: "¿A qué hora venís hoy?", time: "18:04", date: "2026-02-24" },
      { id: 4, from: "me", text: "Tipo 18:30", time: "18:05", date: "2026-02-24", read: true },
      { id: 5, from: "other", text: "Perfecto, te espero", time: "18:06", date: "2026-02-24" }
    ]
  },

  {
    id: 2,
    name: "juan",
    avatar: "https://i.pravatar.cc/150?img=12",
    personality: "juan",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Che, mañana vemos el TP?", time: "14:21", date: "2026-02-23" },
      { id: 2, from: "me", text: "Sí, obvio", time: "14:22", date: "2026-02-23", read: true },
      { id: 3, from: "other", text: "Buenísimo", time: "14:23", date: "2026-02-23" },
      { id: 4, from: "me", text: "Llevo la compu", time: "14:24", date: "2026-02-23", read: true },
      { id: 5, from: "other", text: "Dale, yo llevo mate", time: "14:25", date: "2026-02-23" }
    ]
  },

  {
    id: 3,
    name: "carla",
    avatar: "https://i.pravatar.cc/150?img=32",
    personality: "carla",
    memory: [],
    unread: 2, // ← dos mensajes sin leer
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Daleeee", time: "20:11", date: "2026-02-22" },
      { id: 2, from: "me", text: "😂😂😂", time: "20:12", date: "2026-02-22", read: true },
      { id: 3, from: "other", text: "¿Al final salimos hoy?", time: "20:13", date: "2026-02-22" },
      { id: 4, from: "me", text: "Sí, tipo 22", time: "20:14", date: "2026-02-22", read: true },
      { id: 5, from: "other", text: "Perfecto rey", time: "20:15", date: "2026-02-22" }
    ]
  },

  {
    id: 4,
    name: "lucas",
    avatar: "https://i.pravatar.cc/150?img=15",
    personality: "lucas",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "me", text: "Bro, viste el partido?", time: "17:40", date: "2026-02-21", read: true },
      { id: 2, from: "other", text: "Tremendo final", time: "17:41", date: "2026-02-21" },
      { id: 3, from: "me", text: "No lo podía creer", time: "17:42", date: "2026-02-21", read: true },
      { id: 4, from: "other", text: "Jajajaj posta", time: "17:43", date: "2026-02-21" }
    ]
  },

  {
    id: 5,
    name: "profe UTN",
    avatar: "https://i.pravatar.cc/150?img=68",
    personality: "profe UTN",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Mauro, recuerde entregar el práctico", time: "09:01", date: "2026-02-20" },
      { id: 2, from: "me", text: "Sí profe, ya lo estoy terminando", time: "09:03", date: "2026-02-20", read: true },
      { id: 3, from: "other", text: "Perfecto", time: "09:04", date: "2026-02-20" }
    ]
  },

  {
    id: 6,
    name: "grupo amigos",
    avatar: "https://i.pravatar.cc/150?img=24",
    personality: "grupo",
    memory: [],
    unread: 3, // ← tres mensajes sin leer
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Che, organizamos algo?", time: "16:10", date: "2026-02-19" },
      { id: 2, from: "other", text: "Yo puedo después de las 20", time: "16:11", date: "2026-02-19" },
      { id: 3, from: "me", text: "Yo también!", time: "16:12", date: "2026-02-19", read: true },
      { id: 4, from: "other", text: "Daleee", time: "16:13", date: "2026-02-19" }
    ]
  },

  {
    id: 7,
    name: "tio roberto",
    avatar: "https://i.pravatar.cc/150?img=14",
    personality: "tio roberto",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Mauro, ¿me ayudás con la compu?", time: "11:20", date: "2026-02-18" },
      { id: 2, from: "me", text: "Sí tío, decime qué pasó", time: "11:21", date: "2026-02-18", read: true },
      { id: 3, from: "other", text: "No me abre el correo", time: "11:22", date: "2026-02-18" }
    ]
  },

  {
    id: 8,
    name: "florencia",
    avatar: "https://i.pravatar.cc/150?img=29",
    personality: "florencia",
    memory: [],
    unread: 1, // ← un mensaje sin leer
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "¿Viste la serie que te dijee?", time: "22:01", date: "2026-02-17" },
      { id: 2, from: "me", text: "Sí! Tremenda", time: "22:03", date: "2026-02-17", read: true },
      { id: 3, from: "other", text: "Te dijeee", time: "22:04", date: "2026-02-17" }
    ]
  },

  {
    id: 9,
    name: "trabajo",
    avatar: "https://i.pravatar.cc/150?img=55",
    personality: "trabajo",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Mauro, reunión mañana 9 AM", time: "18:50", date: "2026-02-16" },
      { id: 2, from: "me", text: "Perfecto, ahí estaré", time: "18:51", date: "2026-02-16", read: true }
    ]
  },

  {
    id: 10,
    name: "justi",
    avatar: "https://i.pravatar.cc/150?img=36",
    personality: "justi",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "¿Vamos al gym hoy?", time: "15:30", date: "2026-02-15" },
      { id: 2, from: "me", text: "Sí, tipo 19", time: "15:31", date: "2026-02-15", read: true },
      { id: 3, from: "other", text: "Dale!", time: "15:32", date: "2026-02-15" }
    ]
  },

  {
    id: 11,
    name: "matias",
    avatar: "https://i.pravatar.cc/150?img=9",
    personality: "matias",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "me", text: "¿Jugamos algo hoy?", time: "19:10", date: "2026-02-14", read: true },
      { id: 2, from: "other", text: "Sí, más tarde", time: "19:11", date: "2026-02-14" },
      { id: 3, from: "me", text: "Avisame", time: "19:12", date: "2026-02-14", read: true }
    ]
  },

  {
    id: 12,
    name: "abuela",
    avatar: "https://i.pravatar.cc/150?img=49",
    personality: "abuela",
    memory: [],
    unread: 0,
    lastSeen: "2026-02-24T18:30:00",
    messages: [
      { id: 1, from: "other", text: "Mauro, ¿cómo estás?", time: "10:00", date: "2026-02-13" },
      { id: 2, from: "me", text: "Bien abue, vos?", time: "10:01", date: "2026-02-13", read: true },
      { id: 3, from: "other", text: "Muy bien mi amor", time: "10:02", date: "2026-02-13" }
    ]
  }
];

export default initialChats;