import { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import initialChats from "./initialChats.js";

import Home from "./pages/Home.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Login from "./pages/login.jsx";
import LoginQR from "./pages/loginQR.jsx";
import Connecting from "./pages/connecting.jsx";
import LoadingMessages from "./pages/loadingmessages.jsx";

import "./styles/login.css";
import "./styles/loginQR.css";

function App() {
  const [chats, setChats] = useState(initialChats);
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () =>
    setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const sendSound = useRef(null);
  const receiveSound = useRef(null);
  const lastActivityRef = useRef(Date.now()); // <--- AGREGAR ESTA LÍNEA

  const initSounds = () => {
    if (!sendSound.current) {
      sendSound.current = new Audio("/sounds/send.mp3");
      receiveSound.current = new Audio("/sounds/receive.mp3");
    }
  };

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSelectChat = (id) => {
  initSounds();
  setSelectedChatId(id);

  setLoadingChat(true);

  setTimeout(() => {
    setLoadingChat(false);
    navigate(`/chat/${id}`);
  }, 1000);

  setChats(prev =>
    prev.map(chat =>
      chat.id === id
        ? {
            ...chat,
            unread: 0, // ← limpia los no leídos al abrir el chat
            lastSeen: new Date().toISOString(),
            messages: chat.messages.map(msg =>
              msg.from === "me" ? { ...msg, read: true } : msg
            )
          }
        : chat
    )
  );
};

  /* -----------------------------------------
     DETECCIÓN DE INTENCIÓN (ARGENTINA)
  ----------------------------------------- */

  function detectIntent(text) {
    const msg = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const has = (w) => msg.includes(w);

    // SALUDOS
    if (
      has("hola") || has("buenas") || has("buen dia") ||
      has("buenas tardes") || has("buenas noches") ||
      has("que onda") || has("como va") || has("todo bien") ||
      has("que tal") || has("que haces") || has("que contas") ||
      has("que andas")
    ) {
      if (has("como estas") || has("como andas") || has("como va eso"))
        return "pregunta_estado";
      return "saludo";
    }

    // PREGUNTA DE ESTADO
    if (
  has("como estas") || has("como andas") || has("como andan") ||
  has("como va eso") || has("todo bien?") ||
  (has("todo bien") && msg.includes("?")) ||
  has("como venis") || has("como la llevas") || has("como seguis")
) {
  return "pregunta_estado";
}

    // PREGUNTA DE ACTIVIDAD
    if (
      has("que haces") || has("que estas haciendo") ||
      has("que andas haciendo") || has("en que andas")
    ) {
      return "pregunta_actividad";
    }

    // AGRADECIMIENTO
    if (has("gracias") || has("mil gracias") || has("te re agradezco"))
      return "agradecimiento";

    // DESPEDIDA
    if (
      has("chau") || has("nos vemos") || has("me voy") ||
      has("despues hablamos") || has("hasta luego") || has("hasta mañana")
    ) {
      return "despedida";
    }

    // DISCULPA
    if (has("perdon") || has("perdoname") || has("disculpa") || has("disculpame"))
      return "disculpa";

    // AFIRMACION
    if (
      has("si") || has("obvio") || has("de una") || has("dale") ||
      has("joya") || has("genial") || has("perfecto") || has("ok")
    ) {
      return "afirmacion";
    }

    // NEGACION
    if (has("no") || has("ni ahi") || has("ni en pedo") || has("olvidate"))
      return "negacion";

    // PREGUNTA GENERAL
    if (msg.includes("?")) return "pregunta";

    return "general";
  }
    /* -----------------------------------------
     MEMORIA CONTEXTUAL
  ----------------------------------------- */

  function updateMemory(chat, text) {
    const msg = text.toLowerCase();
    const memories = [...chat.memory];
    const add = (m) => { if (!memories.includes(m)) memories.push(m); };

    if (msg.includes("cansado") || msg.includes("cansada")) add("cansancio");
    if (msg.includes("triste")) add("tristeza");
    if (msg.includes("dolor") || msg.includes("cabeza")) add("dolor_cabeza");
    if (msg.includes("enfermo") || msg.includes("enferma")) add("enfermedad");
    if (msg.includes("parcial") || msg.includes("examen")) add("parcial");
    if (msg.includes("familia")) add("familia");
    if (msg.includes("trabajo")) add("trabajo_estres");

    return memories;
  }
// -----------------------------------------
// PERSONALIDADES PROFUNDAS — COMPLETO
// -----------------------------------------
const PERSONALIDADES = {
  mama: {
    tono: "cálido, protector, preocupado",
    energia: "lento, suave, frases largas",
    muletillas: ["mi amor", "mi vida", "hijo", "cariño"],
    intereses: ["familia", "comida", "salud"],
    estilo: (msg) => msg + " ❤️",
    reaccionEmocional: {
      tristeza: "Ay mi amor… ¿querés hablar un poquito?",
      cansancio: "Tenés que descansar más, hijo.",
      enfermedad: "¿Te estás cuidando bien? Me preocupás.",
      parcial: "No te pongas nervioso, vas a estar bien mi vida."
    }
  },

  abuela: {
    tono: "dulce, nostálgico",
    energia: "lento, tierno",
    muletillas: ["mi cielo", "mi vida", "tesoro"],
    intereses: ["familia", "recuerdos", "comida casera"],
    estilo: (msg) => "Ay mi cielo, " + msg,
    reaccionEmocional: {
      tristeza: "Ay mi vida, vení que te hago una torta.",
      cansancio: "Tenés que dormir más, mi amor.",
      enfermedad: "Abrigate bien, por favor.",
      parcial: "Vos sos muy inteligente, te va a ir bien."
    }
  },

  profe: {
    tono: "formal, directo",
    energia: "corto, preciso",
    muletillas: ["correcto", "bien"],
    intereses: ["estudio", "orden"],
    estilo: (msg) => msg.replace("vos", "usted"),
    reaccionEmocional: {
      parcial: "Confíe en su preparación. Revise los puntos clave.",
      cansancio: "Descanse un poco antes de seguir estudiando."
    }
  },

  trabajo: {
    tono: "formal, seco",
    energia: "corto",
    muletillas: ["recibido", "correcto"],
    intereses: ["orden", "responsabilidad"],
    estilo: (msg) => "Recibido. " + msg,
    reaccionEmocional: {
      cansancio: "Tómese un descanso si lo necesita.",
      enfermedad: "Avise si necesita ausentarse."
    }
  },

  justi: {
    tono: "cariñoso, juguetón",
    energia: "rápido, emojis",
    muletillas: ["bb", "amor", "mi vida"],
    intereses: ["salir", "charlar", "mimos"],
    estilo: (msg) => msg + " 😘",
    reaccionEmocional: {
      tristeza: "Ay amor, vení que te abrazo.",
      cansancio: "Dormí un poquito bb.",
      parcial: "Te va a ir re bien, confío en vos bb."
    }
  },

  carla: {
    tono: "amiga copada",
    energia: "divertida",
    muletillas: ["rey", "boludo", "jajaja"],
    intereses: ["salidas", "chismes", "charlar"],
    estilo: (msg) => msg + " rey",
    reaccionEmocional: {
      tristeza: "Ay rey, ¿qué pasó?",
      cansancio: "Dormí un toque, te va a hacer bien.",
      parcial: "Tranqui rey, te va a ir bien."
    }
  },

  lucas: {
    tono: "relajado, callejero",
    energia: "chill",
    muletillas: ["bro", "hermano", "rey"],
    intereses: ["fútbol", "juntadas", "música"],
    estilo: (msg) => msg + " hermano",
    reaccionEmocional: {
      tristeza: "Tranqui bro, acá estoy.",
      cansancio: "Tomate un respiro rey.",
      parcial: "Vos podés bro, metele."
    }
  },

  juan: {
    tono: "amigo cercano, buena onda",
    energia: "relajado",
    muletillas: ["bro", "rey", "amigo"],
    intereses: ["juntadas", "charlar", "música"],
    estilo: (msg) => msg + " bro",
    reaccionEmocional: {
      tristeza: "Uh bro, ¿qué pasó?",
      cansancio: "Dormí un toque rey.",
      parcial: "Tranqui bro, te va a ir bien."
    }
  },

  matias: {
    tono: "amigo chill",
    energia: "tranqui",
    muletillas: ["bro", "rey", "amigo"],
    intereses: ["fútbol", "juntadas"],
    estilo: (msg) => msg + " bro",
    reaccionEmocional: {
      tristeza: "Tranqui amigo, acá estoy.",
      cansancio: "Descansá un toque rey.",
      parcial: "Te va a ir bien amigo."
    }
  },

  tio: {
    tono: "colgado, gracioso",
    energia: "irregular",
    muletillas: ["sobrino", "a ver si entiendo…"],
    intereses: ["asados", "fútbol", "anécdotas"],
    estilo: (msg) => "A ver si entiendo… " + msg,
    reaccionEmocional: {
      tristeza: "Uh sobrino… vení que te cuento algo para distraerte.",
      cansancio: "Tomate un mate y descansá un poco.",
      parcial: "Vos sos inteligente, sobrino, te va a ir bien."
    }
  },

  grupo: {
    tono: "caótico, divertido",
    energia: "rápido, varios hablando",
    muletillas: ["jajaja", "boludo", "amigo"],
    intereses: ["salidas", "comida", "planes"],
    estilo: null,
    reaccionEmocional: {
      tristeza: "uhh amigo vení al grupo que te levantamos el ánimo",
      cansancio: "descansá un toque amigo",
      parcial: "dale que aprobás amigo"
    }
  },

    grupo_lauti: {
    tono: "bardero, gracioso, espontáneo",
    energia: "rápido, impulsivo",
    muletillas: ["boludo", "jajaja", "amigo", "mal"],
    intereses: ["juntadas", "fútbol", "boludear"],
    estilo: (msg) => msg + " jajaja",
    reaccionEmocional: {
      tristeza: "uhh amigo venite que te levantamos el ánimo",
      cansancio: "dormite un rato boludo",
      parcial: "dale que aprobás amigo"
    }
  },

  grupo_mili: {
    tono: "dulce, tranquila, sensata",
    energia: "calmada, respuestas suaves",
    muletillas: ["jajaja", "ay", "posta", "mmm"],
    intereses: ["charlar", "salidas tranqui", "comida"],
    estilo: (msg) => msg,
    reaccionEmocional: {
      tristeza: "ay amigo, ¿qué pasó?",
      cansancio: "descansá un toque",
      parcial: "te va a ir bien, en serio"
    }
  },

  grupo_tomi: {
    tono: "exagerado, gracioso, intenso",
    energia: "alta, respuestas largas",
    muletillas: ["amigo", "rey", "boludo", "daleee"],
    intereses: ["salir", "comer", "hacer planes"],
    estilo: (msg) => msg + " amigo",
    reaccionEmocional: {
      tristeza: "noo amigo vení que te levantamos el ánimo",
      cansancio: "tomate un café amigo",
      parcial: "vos podés rey"
    }
  },
  
};


// -----------------------------------------
// MOTOR CONVERSACIONAL V2 (usa contexto)
// -----------------------------------------
function smartReplyWithContext(chat, lastMessage) {
  const { personality, memory, lastReply, messages } = chat;
  const text = lastMessage.text || "";
  const persona = PERSONALIDADES[personality];

  // Historial reciente
  const history = messages.slice(-10);

  const userTurns = history
    .filter(m => m.from === "me" && typeof m.text === "string")
    .map(m => m.text.toLowerCase());

  const lastUserBefore = userTurns[userTurns.length - 2] || "";
  const repeatedTopic =
    lastUserBefore &&
    text.length > 5 &&
    (text.includes(lastUserBefore.slice(0, 5)) ||
      lastUserBefore.includes(text.slice(0, 5)));

  // Llamamos a tu motor original
  const baseReply = generateSmartReply(text, personality, memory, lastReply);

  // Si es audio o grupo, no tocamos nada
  if (Array.isArray(baseReply)) return baseReply;
  if (typeof baseReply === "object" && baseReply.audio) return baseReply;

  let reply = baseReply;

  // Conectores si sigue el mismo tema
  if (repeatedTopic && typeof reply === "string") {
    const conectores = [
      "Como te decía antes, ",
      "Recién hablábamos de eso, ",
      "Siguiendo con lo que venías diciendo, ",
      "Volviendo a eso, "
    ];
    reply = conectores[Math.floor(Math.random() * conectores.length)] + reply;
  }

  // Reacción emocional profunda
  if (persona && persona.reaccionEmocional) {
    for (const key of memory) {
      if (persona.reaccionEmocional[key]) {
        reply = persona.reaccionEmocional[key];
      }
    }
  }

  // Muletillas
  if (persona && persona.muletillas && Math.random() < 0.4) {
    reply += " " + persona.muletillas[Math.floor(Math.random() * persona.muletillas.length)];
  }

  // Estilo final
  if (persona && persona.estilo) {
    reply = persona.estilo(reply);
  }
    // Si es grupo → usar motor especial
  if (personality === "grupo") {
    const intent = detectIntent(text);
    return generateGroupReply(intent, memory);
  }
  return reply;
}
  
// -----------------------------------------
// MOTOR ESPECIAL PARA GRUPO (Lauti, Mili, Tomi)
// -----------------------------------------
function generateGroupReply(intent, memory) {
  const personas = [
    { name: "Lauti", p: PERSONALIDADES.grupo_lauti },
    { name: "Mili", p: PERSONALIDADES.grupo_mili },
    { name: "Tomi", p: PERSONALIDADES.grupo_tomi }
  ];

  const respuestas = personas.map(({ name, p }) => {
    // Base según intención
    const base = generateSmartReply("placeholder", "general", [], null);

    let reply = base;

    // Reacción emocional
    for (const key of memory) {
      if (p.reaccionEmocional[key]) {
        reply = p.reaccionEmocional[key];
      }
    }

    // Muletillas
    if (p.muletillas && Math.random() < 0.5) {
      reply += " " + p.muletillas[Math.floor(Math.random() * p.muletillas.length)];
    }

    // Estilo
    if (p.estilo) reply = p.estilo(reply);

    return `${name}\n${reply}`;
  });

  // Dinámicas internas (contradicciones, chistes)
  const variantes = [
    respuestas,
    [respuestas[1], respuestas[0], respuestas[2]],
    [respuestas[2], respuestas[0], respuestas[1]],
    [
      respuestas[0],
      "Mili\nay no sé si da eso",
      respuestas[2]
    ],
    [
      respuestas[2],
      "Lauti\njajaja callate boludo",
      respuestas[1]
    ]
  ];

  return variantes[Math.floor(Math.random() * variantes.length)];
}
  /* -----------------------------------------
     IA NIVEL C — RESPUESTAS REALISTAS
  ----------------------------------------- */

  function generateSmartReply(text, personality, memory, lastReply) {
    const intent = detectIntent(text);

    const pick = (arr) => {
      const filtered = arr.filter(r => r !== lastReply);
      return filtered[Math.floor(Math.random() * filtered.length)] || arr[0];
    };
      // 30% de probabilidad de que el bot responda con audio
  if (Math.random() < 0.30) {
    const randomSeconds = Math.floor(Math.random() * 12) + 4; // entre 4 y 15 seg
    const duration = `0:${randomSeconds.toString().padStart(2, "0")}`;

    return {
      audio: true,
      duration
    };
  }

    const followUps = [
      "¿Y vos qué pensás?",
      "¿Y cómo te sentís con eso?",
      "¿Qué vas a hacer ahora?",
      "¿Y qué pasó después?",
      "¿Y eso te preocupa?"
    ];

  const intentReplies = {
  saludo: [
    "Hola Mauro, ¿todo bien?",
    "Holaaa, ¿cómo va eso?",
    "Buenas Mauro, ¿qué onda?",
    "Ey Mauro, ¿cómo andás?",
    "Qué hacés Mauro, todo tranqui?",
    "Buenas buenas, ¿cómo venís?",
    "Holaaa rey, ¿todo piola?",
    "Qué onda Mauro, ¿todo en orden?",
    "Buenas Mauro, ¿qué contás?",
    "Holaaa, ¿cómo pinta?"
  ],

  pregunta_estado: [
    "Todo bien Mauro, ¿vos?",
    "Tranqui acá, ¿vos cómo venís?",
    "Bien rey, medio cansado pero bien, ¿vos?",
    "Todo piola Mauro, ¿qué onda vos?",
    "Bien acá, recién me siento, ¿vos?",
    "Todo tranqui, ¿vos cómo andás?",
    "Bien Mauro, ¿vos qué contás?",
    "Todo en orden, ¿vos?",
    "Bien, ¿vos cómo la llevás?",
    "Re bien, ¿vos qué onda?"
  ],

  pregunta_actividad: [
    "Acá boludeando Mauro, ¿vos?",
    "Nada importante, ¿vos qué hacés?",
    "Acá tranqui, ¿vos qué onda?",
    "Re chill Mauro, ¿vos?",
    "Acá en casa, ¿vos qué andás haciendo?",
    "Nada, descansando un toque, ¿vos?",
    "Acá Mauro, ¿vos qué onda?",
    "Acá al pedo mal, ¿vos?",
    "Nada, viendo qué hacer, ¿vos?",
    "Acá tranqui, ¿vos qué pintás?"
  ],

  plan_del_dia: [
    "Y Mauro, si quieren hacemos algo.",
    "Podemos juntarnos si pintan.",
    "Yo estoy para hacer algo Mauro.",
    "Si quieren armamos algo tranqui.",
    "Pinta juntada Mauro?",
    "Yo me prendo si ustedes quieren.",
    "Podemos salir o hacer algo chill.",
    "Si quieren hacemos algo más tarde.",
    "Estoy libre Mauro, ustedes digan.",
    "Yo estoy para lo que pinten."
  ],

  comida: [
    "Podemos pedir algo Mauro.",
    "Pizza siempre va.",
    "Si quieren pedimos algo tranqui.",
    "Estoy para comer algo, ¿ustedes?",
    "Podemos pedir empanadas o pizza.",
    "Yo como lo que sea Mauro.",
    "Si quieren pedimos ahora.",
    "Estoy para una pizza fuerte.",
    "Podemos cocinar algo también.",
    "Lo que pinten Mauro, yo me sumo."
  ],

  salida: [
    "Estoy para salir Mauro.",
    "Si quieren vamos a tomar algo.",
    "Yo salgo de una.",
    "Podemos ir a un bar tranqui.",
    "Estoy para una salida chill.",
    "Si pintan, vamos.",
    "Yo me prendo Mauro.",
    "Podemos ir al centro.",
    "Estoy libre si quieren salir.",
    "Vamos Mauro, yo me sumo."
  ],

  lugar: [
    "Podemos ir ahí Mauro.",
    "Si quieren vamos a ese lugar.",
    "Me queda bien, vamos.",
    "Estoy para ir ahí.",
    "Vamos Mauro, me sirve.",
    "Si quieren vamos todos.",
    "Ese lugar está bueno.",
    "Vamos ahí tranqui.",
    "Yo me prendo Mauro.",
    "Vamos, me copa."
  ],

  tiempo: [
    "A la tarde puedo Mauro.",
    "Más tarde estoy libre.",
    "Yo puedo tipo a la noche.",
    "Cuando quieran Mauro.",
    "Digan hora y voy.",
    "Estoy libre después.",
    "A la tarde me sirve.",
    "Más tarde estoy.",
    "Yo puedo ahora o más tarde.",
    "Cuando pinten Mauro."
  ],

  agradecimiento: [
    "De nada Mauro.",
    "Todo bien rey.",
    "No hay drama.",
    "Tranqui Mauro.",
    "Obvio papá.",
    "No pasa nada.",
    "Todo bien.",
    "Dale Mauro.",
    "No hay problema.",
    "Todo piola."
  ],

  despedida: [
    "Nos vemos Mauro.",
    "Hablamos después.",
    "Dale rey, nos vemos.",
    "Cuídate Mauro.",
    "Hablamos más tarde.",
    "Nos vemos papá.",
    "Dale, hablamos.",
    "Nos vemos bro.",
    "Hablamos Mauro.",
    "Cuídate rey."
  ],

  afirmacion: [
    "De una Mauro.",
    "Sí obvio.",
    "Dale rey.",
    "Perfecto.",
    "Me sirve.",
    "Sí sí.",
    "Obvio Mauro.",
    "Dale papá.",
    "Sí bro.",
    "Re sí."
  ],

  negacion: [
    "Ni ahí Mauro.",
    "No creo.",
    "Mmm no me pinta.",
    "No estoy para eso.",
    "Hoy no Mauro.",
    "No bro.",
    "No me sirve.",
    "No puedo.",
    "No da.",
    "Naaa Mauro."
  ],

  pregunta: [
    "Mmm buena pregunta Mauro.",
    "No sé rey, ¿vos qué decís?",
    "Puede ser Mauro.",
    "No estoy seguro, ¿vos qué pensás?",
    "Y… puede ser.",
    "No sé, ¿qué opinás vos?",
    "Puede ser, no estoy seguro.",
    "Depende Mauro, ¿vos qué harías?",
    "No sé bro, ¿vos qué onda?",
    "Puede ser rey."
  ],

  general: [
    "Te entiendo Mauro.",
    "Ajá… contame más.",
    "Posta Mauro.",
    "Qué flash.",
    "Tranqui rey.",
    "Entiendo bro.",
    "Mirá vos.",
    "Ahh ok.",
    "Bueno bueno.",
    "Dale Mauro."
  ]
};

    const styles = {
      mama: (msg) => msg + " ❤️",
      profe: (msg) => msg.replace("vos", "usted"),
      grupo: (msg) => msg + " jajaja",
      justi: (msg) => msg + " 😘",
      abuela: (msg) => "Ay mi amor, " + msg,
      tio: (msg) => "A ver si entiendo… " + msg,
      trabajo: (msg) => "Recibido. " + msg,
      carla: (msg) => msg + " rey",
      lucas: (msg) => msg + " hermano",
      juan: (msg) => msg + " bro",
      matias: (msg) => msg + " bro"
    };

/* -----------------------------------------
   GRUPO — MÚLTIPLES INTEGRANTES (INTERACCIÓN REAL)
----------------------------------------- */

if (personality === "grupo") {
  const replies = [];

  // RESPUESTAS BASE POR INTENCIÓN
  const lauti = {
    saludo: [
      "jajaja holaaa",
      "holaaa Mauro",
      "eyy Mauro todo piola?"
    ],
    pregunta_estado: [
      "jajaja todo piola, vos?",
      "bien acá boludo, ¿vos?",
      "todo tranqui Mauro"
    ],
    pregunta_actividad: [
      "aca boludo, sin hacer nada jajaja",
      "al pedo mal Mauro",
      "acá tirado, ¿vos?"
    ],
    plan_del_dia: [
      "jajaja yo estoy para hacer algo, que pintaaa",
      "si quieren hacemos algo",
      "yo me prendo de una"
    ],
    comida: [
      "pizza siempre va jajaja",
      "pidamos algo Mauro",
      "yo como lo que sea"
    ],
    salida: [
      "yo salgo de unaaa",
      "vamos a tomar algo dale",
      "yo estoy para salir"
    ],
    lugar: [
      "si quieren vamos ahi",
      "me sirve ese lugar",
      "vamos vamos"
    ],
    tiempo: [
      "tipo a la tarde estoy libre",
      "más tarde puedo",
      "yo puedo a la noche"
    ],
    agradecimiento: [
      "jajaja de nada boludo",
      "todo bien Mauro",
      "no hay drama"
    ],
    despedida: [
      "nos vemoss",
      "hablamos Mauro",
      "chauu"
    ],
    afirmacion: [
      "de unaaa",
      "sii obvio",
      "dale dale"
    ],
    negacion: [
      "ni ahi boludo",
      "noo jajaja",
      "ni en pedo"
    ],
    pregunta: [
      "jajaja no se, vos que decis?",
      "mmm puede ser",
      "y no se Mauro"
    ],
    general: [
      "jajaja posta",
      "mal boludo",
      "que flash"
    ]
  };

  const mili = {
    saludo: [
      "hola Mauro",
      "holaaa",
      "eyy"
    ],
    pregunta_estado: [
      "todo bien, vos?",
      "bien Mauro, ¿vos?",
      "todo tranqui"
    ],
    pregunta_actividad: [
      "aca tranqui, vos?",
      "nada Mauro, ¿vos?",
      "acá chill"
    ],
    plan_del_dia: [
      "si quieren hacemos algo tranqui",
      "yo me prendo si ustedes quieren",
      "podemos juntarnos"
    ],
    comida: [
      "dale, pero sin aceitunas pls",
      "pizza me sirve",
      "podemos pedir algo"
    ],
    salida: [
      "mmm yo salgo si ustedes salen",
      "si quieren vamos",
      "yo me prendo"
    ],
    lugar: [
      "si quieren vamos ahi, me queda bien",
      "me sirve ese lugar",
      "vamos"
    ],
    tiempo: [
      "yo puedo tipo más tarde",
      "a la tarde estoy",
      "más tarde me sirve"
    ],
    agradecimiento: [
      "de nadaa",
      "todo bien",
      "no hay drama"
    ],
    despedida: [
      "nos vemos",
      "hablamos",
      "chauu"
    ],
    afirmacion: [
      "si, obvio",
      "dale",
      "siii"
    ],
    negacion: [
      "mmm no creo",
      "no me pinta",
      "noo"
    ],
    pregunta: [
      "no se, puede ser",
      "mmm puede ser",
      "y no se Mauro"
    ],
    general: [
      "te re entiendo",
      "mal",
      "posta"
    ]
  };

  const tomi = {
    saludo: [
      "holaaa amigo",
      "ey Mauro",
      "holaaa rey"
    ],
    pregunta_estado: [
      "re bien amigo, vos?",
      "todo piola Mauro, ¿vos?",
      "bien rey, ¿vos?"
    ],
    pregunta_actividad: [
      "aca amigo, al pedo mal",
      "nada amigo, ¿vos?",
      "acá tirado"
    ],
    plan_del_dia: [
      "amiga digo amigo yo me prendo de unaaaa",
      "yo estoy para juntarnos",
      "hagamos algo dale"
    ],
    comida: [
      "pidamos grande mitad muzza mitad napo daleee",
      "pizza siempre amigo",
      "yo como lo que sea"
    ],
    salida: [
      "vamos a tomar algo daleee",
      "yo salgo amigo",
      "vamos al centro"
    ],
    lugar: [
      "si quieren vamos ahi yo me prendo",
      "me sirve ese lugar",
      "vamos amigo"
    ],
    tiempo: [
      "yo puedo tipo a la noche",
      "más tarde estoy",
      "cuando quieran"
    ],
    agradecimiento: [
      "obviooo amigo",
      "todo bien rey",
      "no hay drama"
    ],
    despedida: [
      "daleee amigo, hablamos",
      "chau rey",
      "nos vemos"
    ],
    afirmacion: [
      "daleeeee amigo",
      "siii",
      "de una"
    ],
    negacion: [
      "ni en pedo amigo",
      "noo",
      "ni ahi"
    ],
    pregunta: [
      "amigo no tengo idea jajaja",
      "mmm puede ser",
      "y no se amigo"
    ],
    general: [
      "amigo que flash",
      "posta",
      "mal"
    ]
  };

  // ELEGIR INTENCIÓN
  const intentKey = intent in lauti ? intent : "general";

  // INTERACCIÓN ENTRE ELLOS
  const lautiMsg = lauti[intentKey][Math.floor(Math.random() * lauti[intentKey].length)];
  const miliMsg = mili[intentKey][Math.floor(Math.random() * mili[intentKey].length)];
  const tomiMsg = tomi[intentKey][Math.floor(Math.random() * tomi[intentKey].length)];

  // DINÁMICA REALISTA
  const interactions = [
    [`Lauti\n${lautiMsg}`, `Mili\n${miliMsg}`, `Tomi\n${tomiMsg}`],
    [`Mili\n${miliMsg}`, `Lauti\n${lautiMsg}`, `Tomi\n${tomiMsg}`],
    [`Tomi\n${tomiMsg}`, `Lauti\n${lautiMsg}`, `Mili\n${miliMsg}`],
    // uno contradice a otro
    [`Lauti\n${lautiMsg}`, `Mili\nche no sé si da`, `Tomi\n${tomiMsg}`],
    [`Mili\n${miliMsg}`, `Tomi\nnaaa amigo`, `Lauti\n${lautiMsg}`],
    [`Tomi\n${tomiMsg}`, `Lauti\njajaja callate boludo`, `Mili\n${miliMsg}`]
  ];

  return interactions[Math.floor(Math.random() * interactions.length)];
}   
/* -----------------------------------------
   RESPUESTAS ESPECIALES POR PERSONALIDAD (MEJORADAS)
----------------------------------------- */

if (personality === "mama") {
  const mama = {
    saludo: [
      "Hola mi amor ❤️ ¿cómo estás vos?",
      "Hola hijo querido ❤️",
      "Hola Mauro, ¿cómo amaneciste?",
      "Hola mi vida ❤️ ¿todo bien?"
    ],
    pregunta_estado: [
      "Bien mi amor, ¿vos cómo estás?",
      "Todo bien hijo, ¿vos?",
      "Acá estoy Mauro, ¿vos cómo venís?",
      "Bien mi vida, ¿vos cómo la llevás?"
    ]
  };
  if (intent in mama) return pick(mama[intent]);
}

if (personality === "abuela") {
  const abuela = {
    saludo: [
      "Ay mi amor, hola ❤️ ¿cómo estás?",
      "Hola mi cielo ❤️",
      "Hola mi vida, qué alegría verte escribir",
      "Hola tesoro ❤️"
    ],
    pregunta_estado: [
      "Bien mi cielo, ¿vos cómo estás?",
      "Bien mi amor, ¿vos?",
      "Acá estoy Mauro, ¿vos cómo venís?",
      "Bien mi vida, ¿vos cómo amaneciste?"
    ]
  };
  if (intent in abuela) return pick(abuela[intent]);
}

if (personality === "profe") {
  const profe = {
    saludo: [
      "Hola. ¿En qué puedo ayudarlo?",
      "Buenas. ¿Qué necesita?",
      "Hola Mauro. ¿Qué consulta tiene?",
      "Hola. ¿Cómo puedo asistirlo?"
    ],
    pregunta_estado: [
      "Bien. ¿Necesita algo?",
      "Todo en orden. ¿Usted?",
      "Bien. ¿Cuál es su duda?",
      "Correcto. ¿Qué necesita Mauro?"
    ],
    agradecimiento: [
      "De nada. Recuerde estudiar.",
      "No hay problema. Siga practicando.",
      "De nada. Avise si necesita algo más.",
      "Con gusto. No olvide repasar."
    ]
  };
  if (intent in profe) return pick(profe[intent]);
}

if (personality === "trabajo") {
  const trabajo = {
    saludo: [
      "Buen día. ¿En qué puedo asistirlo?",
      "Hola Mauro. ¿Qué necesita?",
      "Buen día. ¿Cómo puedo ayudarlo?",
      "Hola. ¿Qué consulta tiene?"
    ],
    pregunta_estado: [
      "Todo en orden. ¿Usted?",
      "Bien. ¿Cómo viene con lo suyo?",
      "Correcto. ¿Necesita algo?",
      "Bien. ¿En qué lo ayudo?"
    ],
    agradecimiento: [
      "Recibido. Queda asentado.",
      "Perfecto. Gracias por avisar.",
      "Anotado. Gracias.",
      "De acuerdo. Gracias Mauro."
    ]
  };
  if (intent in trabajo) return pick(trabajo[intent]);
}

if (personality === "justi") {
  const justi = {
    saludo: [
      "Holaaa 😘 ¿cómo andás?",
      "Hola Mauro 😘",
      "Holaaa amor 😘",
      "Ey 😘 ¿todo bien?"
    ],
    pregunta_estado: [
      "Bien bb 😘 ¿y vos?",
      "Todo bien amor 😘 ¿vos?",
      "Re bien 😘 ¿vos cómo venís?",
      "Bien mi vida 😘 ¿vos?"
    ]
  };
  if (intent in justi) return pick(justi[intent]);
}

if (personality === "tio") {
  const tio = {
    saludo: [
      "Eh hola… ¿cómo era? Ah sí, hola!",
      "Mauro querido, ¿cómo va?",
      "Buenas sobrino, ¿todo bien?",
      "Hola Mauro, ¿qué contás?"
    ],
    pregunta_estado: [
      "Y… acá ando, tratando de entender.",
      "Todo bien Mauro, ¿vos?",
      "Bien, sobreviviendo jaja. ¿Vos?",
      "Bien sobrino, ¿vos cómo venís?"
    ]
  };
  if (intent in tio) return pick(tio[intent]);
}

if (personality === "carla") {
  const carla = {
    saludo: [
      "Holaaa rey, ¿cómo andás?",
      "Hola Mauro, ¿todo bien?",
      "Ey rey, ¿qué onda?",
      "Holaaa, ¿cómo pinta?"
    ],
    pregunta_estado: [
      "Bien rey, ¿vos?",
      "Todo tranqui Mauro, ¿vos?",
      "Bien acá, ¿vos cómo venís?",
      "Todo piola rey, ¿vos?"
    ]
  };
  if (intent in carla) return pick(carla[intent]);
}

if (personality === "lucas") {
  const lucas = {
    saludo: [
      "Qué hacés hermano?",
      "Ey bro, ¿todo bien?",
      "Qué onda Mauro?",
      "Holaaa hermano"
    ],
    pregunta_estado: [
      "Todo piola bro, ¿vos?",
      "Bien rey, ¿vos?",
      "Todo tranqui hermano, ¿vos?",
      "Bien bro, ¿qué onda vos?"
    ]
  };
  if (intent in lucas) return pick(lucas[intent]);
}

if (personality === "juan") {
  const juan = {
    saludo: [
      "Holaaa bro, ¿todo bien?",
      "Qué onda Mauro?",
      "Ey bro, ¿cómo andás?",
      "Holaaa rey"
    ],
    pregunta_estado: [
      "Bien bro, ¿vos?",
      "Todo tranqui Mauro, ¿vos?",
      "Bien rey, ¿vos cómo venís?",
      "Todo piola bro, ¿vos?"
    ]
  };
  if (intent in juan) return pick(juan[intent]);
}

if (personality === "matias") {
  const matias = {
    saludo: [
      "Holaaa bro, ¿cómo va?",
      "Qué onda Mauro?",
      "Ey rey, ¿todo bien?",
      "Holaaa hermano"
    ],
    pregunta_estado: [
      "Todo tranqui, ¿vos?",
      "Bien Mauro, ¿vos?",
      "Todo piola bro, ¿vos cómo venís?",
      "Bien rey, ¿vos?"
    ]
  };
  if (intent in matias) return pick(matias[intent]);
}
    /* -----------------------------------------
       MEMORIA CONTEXTUAL
    ----------------------------------------- */

    if (memory.includes("tristeza") && intent === "saludo")
      return styles[personality]("¿Estás un poquito mejor hoy?");

    if (memory.includes("cansancio") && intent === "pregunta_estado")
      return styles[personality]("¿Dormiste algo? Ayer estabas cansado.");

    if (memory.includes("parcial") && intent === "pregunta")
      return styles[personality]("¿Es por el parcial? No te preocupes, te va a ir bien.");

    if (memory.includes("dolor_cabeza"))
      return styles[personality]("¿Seguís con dolor de cabeza?");

    if (memory.includes("enfermedad"))
      return styles[personality]("¿Te estás cuidando?");

    /* -----------------------------------------
       RESPUESTA BASE
    ----------------------------------------- */

    let base = pick(intentReplies[intent]);

    if (Math.random() < 0.2) {
      base += " " + pick(followUps);
    }

    if (styles[personality]) {
      base = styles[personality](base);
    }

    return base;
  }

  /* -----------------------------------------
     ENVÍO DE MENSAJE
  ----------------------------------------- */

  const handleSendMessage = (chatId, content) => {
  initSounds();
  sendSound.current?.play();

  const chat = chats.find(c => c.id === chatId);

  // Si es texto → actualizar memoria
  const updatedMemory =
    typeof content === "string"
      ? updateMemory(chat, content)
      : chat.memory;

  setChats(prev =>
    prev.map(c =>
      c.id === chatId
        ? {
            ...c,
            memory: updatedMemory,
            messages: [
              ...c.messages,
              {
                id: c.messages.length + 1,
                from: "me",
                text: typeof content === "string" ? content : null,
                audio: content.audio || false,
                duration: content.duration || null,
                time: new Date().toTimeString().slice(0, 5),
                date: new Date().toISOString().split("T")[0],
                read: false
              }
            ]
          }
        : c
    )
  );
};



  


useEffect(() => {
  const chat = chats.find(c => c.id === selectedChatId);
  if (!chat) return;

  const lastMessage = chat.messages[chat.messages.length - 1];
  if (!lastMessage) return;

  // ⛔ Si el último mensaje NO es texto → no generar respuesta
  if (lastMessage.from !== "me" || typeof lastMessage.text !== "string") return;

  const reply = smartReplyWithContext(chat, lastMessage);

  setTyping(true);

  setTimeout(() => {
    setTyping(false);
    receiveSound.current?.play();

    setChats(prev =>
      prev.map(c => {
        if (c.id !== selectedChatId) return c;

        // GRUPO: múltiples mensajes (solo texto)
        if (Array.isArray(reply)) {
          const newMessages = reply.map((text, idx) => ({
            id: c.messages.length + 1 + idx,
            from: "other",
            text,
            audio: false,
            duration: null,
            time: new Date().toTimeString().slice(0, 5),
            date: new Date().toISOString().split("T")[0],
            read: false
          }));

          return {
            ...c,
            lastReply: reply[reply.length - 1],
            unread: c.unread + reply.length,
            messages: [...c.messages, ...newMessages]
          };
        }

        // RESPUESTA NORMAL (texto o audio)
        const isAudio = typeof reply === "object" && reply.audio;

        return {
          ...c,
          lastReply: typeof reply === "string" ? reply : null,
          unread: c.unread + 1,
          messages: [
            ...c.messages,
            {
              id: c.messages.length + 1,
              from: "other",
              text: isAudio ? null : reply,
              audio: isAudio ? true : false,
              duration: isAudio ? reply.duration : null,
              time: new Date().toTimeString().slice(0, 5),
              date: new Date().toISOString().split("T")[0],
              read: false
            }
          ]
        };
      })
    );
  }, 1200);
}, [chats, selectedChatId]);

  /* -----------------------------------------
     RUTAS
  ----------------------------------------- */

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"}>
      <div className="app-container">

        <Routes>

  <Route
    path="/login"
    element={<Login onLogin={() => navigate("/login/qr")} />}
  />

  <Route
    path="/login/qr"
    element={
      <LoginQR
        onConfirm={() => {
          setLoggedIn(true);
          setConnecting(true);
          navigate("/");
          setTimeout(() => {
            setConnecting(false);
            navigate("/home");
          }, 1500);
        }}
      />
    }
  />

  <Route
    path="/"
    element={
      loggedIn
        ? connecting
          ? <Connecting />
          : <Navigate to="/home" />
        : <Navigate to="/login" />
    }
  />

  <Route
    path="/home"
    element={
      loggedIn ? (
        <div className="home-layout">
          <Sidebar
            chats={chats.filter(chat =>
              chat.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChatId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Home />
        </div>
      ) : (
        <Navigate to="/login" />
      )
    }
  />

  <Route
    path="/chat/:id"
    element={
      !loggedIn ? (
        <Navigate to="/login" />
      ) : loadingChat ? (
        <LoadingMessages />
      ) : (
        <div className="home-layout">
          <Sidebar
            chats={chats.filter(chat =>
              chat.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChatId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ChatPage
            chats={chats}
            onSendMessage={handleSendMessage}
            typing={typing}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      )
    }
  />

</Routes>

      </div>
    </div>
  );
}

export default App;