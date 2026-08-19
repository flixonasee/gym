import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check,
  RotateCcw,
  Dumbbell,
  Settings as SettingsIcon,
  ArrowLeft,
  Minus,
  Plus,
  X,
  ShoppingBag,
  Lock,
} from "lucide-react";

/* ---------------------------------------------------------------
   PALETTE — solo questi 5 colori, nessun altro
--------------------------------------------------------------- */

const YELLOW = "#FFE278";
const OLIVE = "#D7EE82";
const TERRACOTTA = "#FFA892";
const BLUE = "#92BFFF";
const BLUSH = "#FFECE1";
const LAVENDER = "#BDC5FF";
const GREEN_GAMBE = "rgb(183, 248, 54)";
const BG = "#E5E4E8";
const CARD = "#FFECE1";
const BUTTON = "#FFFFFF";
const INK = "#3A3742"; // neutro scuro, indispensabile per il testo leggibile — non fa parte della palette ma serve da inchiostro

const PALETTE_CYCLE = [TERRACOTTA, YELLOW, LAVENDER, BLUE, OLIVE, BLUSH];

const CATEGORY_ORDER = ["petto", "spalle", "bicipiti", "tricipiti", "dorso", "gambe", "addominali"];
const CATEGORY_LABELS = {
  petto: "Petto",
  spalle: "Spalle",
  bicipiti: "Bicipiti",
  tricipiti: "Tricipiti",
  dorso: "Dorso",
  gambe: "Gambe",
  addominali: "Addominali",
};
const CATEGORY = Object.fromEntries(
  CATEGORY_ORDER.map((key, i) => [key, { label: CATEGORY_LABELS[key], color: PALETTE_CYCLE[i % PALETTE_CYCLE.length] }])
);
CATEGORY.gambe.color = GREEN_GAMBE;

const DAYS = [
  {
    id: "g1",
    short: "G1",
    illustration: "/01.svg",
    title: "Giorno 1",
    focus: "Petto · Spalle · Bicipiti",
    color: TERRACOTTA,
    exercises: [
      { name: "Chest press", sets: 2, reps: "10", cat: "petto" },
      { name: "Chest press incline", sets: 2, reps: "10", cat: "petto" },
      { name: "Pectoral machine", sets: 2, reps: "10", cat: "petto" },
      { name: "Shoulder press", sets: 3, reps: "10", cat: "spalle" },
      { name: "Alzate laterali", sets: 3, reps: "10", cat: "spalle" },
      { name: "Curl bicipiti seduto su panca", sets: 3, reps: "10", cat: "bicipiti" },
      { name: "Curl bicipiti su panca Scott", sets: 2, reps: "10", cat: "bicipiti" },
      { name: "Total abdominal machine", sets: 4, reps: "10-12", cat: "addominali" },
    ],
  },
  {
    id: "g2",
    short: "G2",
    illustration: "/02.svg",
    title: "Giorno 2",
    focus: "Dorso · Tricipiti",
    color: OLIVE,
    exercises: [
      { name: "Lat machine", sets: 2, reps: "10", cat: "dorso" },
      { name: "Pulley", sets: 2, reps: "10", cat: "dorso" },
      { name: "Face pull ai cavi", sets: 2, reps: "10", cat: "dorso" },
      { name: "Pushdown tricipiti", sets: 3, reps: "10", cat: "tricipiti" },
      { name: "Overhead tricipiti", sets: 2, reps: "10", cat: "tricipiti" },
      { name: "Total abdominal machine", sets: 4, reps: "10-12", cat: "addominali" },
    ],
  },
  {
    id: "g3",
    short: "G3",
    illustration: "/03.svg",
    title: "Giorno 3",
    focus: "Gambe",
    color: BLUE,
    exercises: [
      { name: "Leg press", sets: 3, reps: "10", cat: "gambe" },
      { name: "Leg extension", sets: 3, reps: "10", cat: "gambe" },
      { name: "Hip thrust", sets: 3, reps: "10", cat: "gambe" },
      { name: "Leg curl", sets: 3, reps: "10", cat: "gambe" },
      { name: "Total abdominal machine", sets: 4, reps: "10-12", cat: "addominali" },
    ],
  },
  {
    id: "g4",
    short: "G4",
    illustration: "/04.svg",
    title: "Giorno 4",
    focus: "Petto · Dorso · Braccia",
    color: LAVENDER,
    exercises: [
      { name: "Chest press", sets: 3, reps: "10", cat: "petto" },
      { name: "Pectoral machine", sets: 3, reps: "10", cat: "petto" },
      { name: "Lat machine", sets: 3, reps: "10", cat: "dorso" },
      { name: "Pulley", sets: 3, reps: "10", cat: "dorso" },
      { name: "Curl bicipiti seduto su panca", sets: 3, reps: "10", cat: "bicipiti" },
      { name: "Pushdown tricipiti ai cavi", sets: 3, reps: "10", cat: "tricipiti" },
      { name: "Total abdominal machine", sets: 4, reps: "10-12", cat: "addominali" },
    ],
  },
  {
    id: "g5",
    short: "G5",
    illustration: "/05.svg",
    title: "Giorno 5",
    focus: "Gambe · Spalle",
    color: YELLOW,
    exercises: [
      { name: "Leg press", sets: 3, reps: "10", cat: "gambe" },
      { name: "Leg extension", sets: 3, reps: "10", cat: "gambe" },
      { name: "Hip thrust", sets: 3, reps: "10", cat: "gambe" },
      { name: "Leg curl", sets: 3, reps: "10", cat: "gambe" },
      { name: "Shoulder press", sets: 3, reps: "10", cat: "spalle" },
      { name: "Alzate laterali", sets: 2, reps: "10", cat: "spalle" },
    ],
  },
];

const BAG_ITEMS = [
  "Lucchetto",
  "Infradito",
  "Costume da bagno",
  "Cuffia piscina",
  "Asciugamano sauna",
  "Asciugamano doccia",
  "Asciugamanino attrezzi",
  "Cambio per uscire",
  "Acqua",
];

const REST_OPTIONS = [
  { label: "1 min", seconds: 60 },
  { label: "1,5 min", seconds: 90 },
  { label: "2 min", seconds: 120 },
];

// Chiave pubblica VAPID per le notifiche push — questa e' sicura da avere nel
// codice lato client (e' fatta apposta per essere pubblica). La chiave privata
// resta SOLO nelle variabili d'ambiente di Vercel, mai qui.
const VAPID_PUBLIC_KEY =
  "BKgMEgUmsVOcBKWUL5lLQ8luX5LUOMoFVuDbyVnryMPpNiLdQDSDIAeVc8kDJmR1uoKuf-ZVnupxhQbVnod0mJA";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });
    return true;
  } catch {
    return false;
  }
}

async function scheduleRestPush(seconds) {
  try {
    await fetch("/api/schedule-rest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seconds }),
    });
  } catch {
    /* se il backend non e' configurato, ignora: restano comunque suono/beep locali */
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function startOfWeekISO(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date.toISOString().slice(0, 10);
}

function emptyProgress(day) {
  return day.exercises.map((ex) => Array(ex.sets).fill(false));
}

function totalSets(day) {
  return day.exercises.reduce((a, ex) => a + ex.sets, 0);
}

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ---------------------------------------------------------------
   STORAGE
--------------------------------------------------------------- */

const hasCloudStorage =
  typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";

async function storeGet(key) {
  if (hasCloudStorage) {
    try {
      const res = await window.storage.get(key);
      return res && res.value ? res.value : null;
    } catch {
      return null;
    }
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

async function storeSet(key, value) {
  if (hasCloudStorage) {
    try {
      await window.storage.set(key, value);
      return;
    } catch {
      /* fall through */
    }
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* silent */
  }
}

async function storeDelete(key) {
  if (hasCloudStorage) {
    try {
      await window.storage.delete(key);
      return;
    } catch {
      /* fall through */
    }
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* silent */
  }
}

/* ---------------------------------------------------------------
   BUBBLE CLUSTER — riepilogo settimanale
--------------------------------------------------------------- */

function BubbleCluster({ days, history, weekStart }) {
  return (
    <div className="flex justify-between gap-2">
      {days.map((d) => {
        const doneRecently = (history[d.id] || []).some((dt) => dt >= weekStart);
        const bg = doneRecently ? d.color : "rgba(142,137,143,0.14)";
        const ink = doneRecently ? INK : "rgba(58,55,66,0.35)";
        return (
          <div
            key={d.id}
            className="rounded-full flex items-center justify-center font-semibold flex-1"
            style={{ aspectRatio: "1 / 1", background: bg, color: ink, fontSize: "14px" }}
          >
            {d.short}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------
   GYM BAG CHECKLIST
--------------------------------------------------------------- */

function GymBag({ checked, onToggle, nudge }) {
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const open = manuallyOpened || nudge;
  const done = checked.filter(Boolean).length;

  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{ background: CARD, boxShadow: nudge ? `0 0 0 2px ${TERRACOTTA}` : "none" }}
    >
      <button className="w-full flex items-center justify-between" onClick={() => setManuallyOpened((o) => !o)}>
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} color={INK} />
          <span className="text-sm font-semibold" style={{ color: INK }}>
            Borsa della palestra
          </span>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: done === BAG_ITEMS.length ? OLIVE : BUTTON, color: done === BAG_ITEMS.length ? "#FFFFFF" : INK }}
        >
          {done}/{BAG_ITEMS.length}
        </span>
      </button>

      {nudge && (
        <p className="text-xs font-semibold mt-2" style={{ color: TERRACOTTA }}>
          Completa la borsa per sbloccare gli esercizi
        </p>
      )}

      {open && (
        <div className="flex flex-col gap-2 mt-3">
          {BAG_ITEMS.map((item, i) => (
            <button
              key={item}
              onClick={() => onToggle(i)}
              className="flex items-center gap-2.5 active:scale-[0.98] transition-transform"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: checked[i] ? OLIVE : BUTTON }}
              >
                {checked[i] && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </span>
              <span
                className="text-sm text-left"
                style={{ color: checked[i] ? "rgba(58,55,66,0.4)" : INK, textDecoration: checked[i] ? "line-through" : "none" }}
              >
                {item}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


/* ---------------------------------------------------------------
   REST TIMER BAR
--------------------------------------------------------------- */

function RestTimerBar({ remaining, duration, onSkip }) {
  const pct = duration ? Math.max(0, Math.min(1, remaining / duration)) : 0;
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ background: INK }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>
          RECUPERO
        </span>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tabular-nums" style={{ color: "#FFFFFF" }}>
            {formatMMSS(remaining)}
          </span>
          <button onClick={onSkip} className="active:scale-90 transition-transform" aria-label="Salta recupero">
            <X size={16} color="rgba(255,255,255,0.7)" />
          </button>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.18)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, background: YELLOW, transition: "width 1s linear" }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SETTINGS PAGE
--------------------------------------------------------------- */

/* ---------------------------------------------------------------
   CELEBRAZIONE FINE GIORNATA
--------------------------------------------------------------- */

const CONFETTI_COLORS = [YELLOW, OLIVE, TERRACOTTA, BLUE, LAVENDER, GREEN_GAMBE];

function Celebration({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  const dots = Array.from({ length: 20 });

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-6"
      style={{ background: "rgba(58,55,66,0.5)" }}
      onClick={onDone}
    >
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-16px) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(170px) rotate(360deg); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        className="relative rounded-3xl px-8 py-10 text-center overflow-hidden w-full max-w-xs"
        style={{ background: BUTTON, animation: "popIn 0.4s ease" }}
      >
        {dots.map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: "-12px",
              left: `${(i / dots.length) * 100}%`,
              width: 7 + (i % 3) * 4,
              height: 7 + (i % 3) * 4,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animation: `confettiFall ${1.3 + (i % 5) * 0.15}s ease-in ${i * 0.05}s forwards`,
            }}
          />
        ))}
        <img
          src="/celebration.png"
          alt=""
          className="mx-auto mb-2 relative"
          style={{ width: "150px", height: "150px", objectFit: "contain" }}
        />
        <p className="font-extrabold" style={{ color: INK, fontSize: "22px" }}>
          Giornata completata!
        </p>
        <p className="text-sm mt-1.5" style={{ color: "rgba(58,55,66,0.6)" }}>
          Ottimo lavoro 💪
        </p>
      </div>
    </div>
  );
}

function SettingsPage({ restDuration, onChangeDuration, notifyEnabled, onToggleNotify, onBack }) {
  return (
    <div className="w-full max-w-md px-4 pb-10" style={{ minHeight: "100vh" }}>
      <div className="flex items-center gap-3 pt-6 pb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: BUTTON }}
          aria-label="Indietro"
        >
          <ArrowLeft size={18} color={INK} />
        </button>
        <h1 className="font-extrabold" style={{ color: INK, fontSize: "24px" }}>
          Impostazioni
        </h1>
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ background: CARD }}>
        <p className="text-sm font-semibold mb-1" style={{ color: INK }}>
          Timer di recupero
        </p>
        <p className="text-xs mb-4" style={{ color: "rgba(58,55,66,0.55)" }}>
          Durata del countdown dopo ogni serie completata
        </p>
        <div className="flex gap-2">
          {REST_OPTIONS.map((opt) => {
            const active = restDuration === opt.seconds;
            return (
              <button
                key={opt.seconds}
                onClick={() => onChangeDuration(opt.seconds)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                style={{ background: active ? INK : BUTTON, color: active ? "#FFFFFF" : INK }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: CARD }}>
        <p className="text-sm font-semibold mb-1" style={{ color: INK }}>
          Avviso a fine recupero
        </p>
        <p className="text-xs mb-4" style={{ color: "rgba(58,55,66,0.55)" }}>
          Suono e notifica quando il countdown finisce — funziona anche ad app chiusa se l'hai salvata sulla schermata Home. La vibrazione locale funziona solo su Android.
        </p>
        <button
          onClick={onToggleNotify}
          className="w-full py-3 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
          style={{ background: notifyEnabled ? OLIVE : BUTTON, color: notifyEnabled ? "#FFFFFF" : INK }}
        >
          {notifyEnabled ? "Attivo" : "Attiva avviso"}
        </button>
      </div>
    </div>
  );
}

function playBeep(ctx) {
  try {
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    /* audio non disponibile, ignora */
  }
}

function notifyRestOver(enabled, audioCtx) {
  playBeep(audioCtx);
  if (navigator.vibrate) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {
      /* ignora */
    }
  }
  if (enabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      new Notification("Recupero terminato", { body: "Pronto per la prossima serie 💪" });
    } catch {
      /* ignora */
    }
  }
}

/* ---------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------- */

export default function SchedaGianmaria() {
  const [view, setView] = useState("main"); // 'main' | 'settings'
  const [dayIdx, setDayIdx] = useState(0);
  const day = DAYS[dayIdx];

  const [progress, setProgress] = useState(() => emptyProgress(DAYS[0]));
  const [weights, setWeights] = useState({}); // { exIdx: { value, date } }
  const [history, setHistory] = useState({});
  const [bagChecked, setBagChecked] = useState(() => Array(BAG_ITEMS.length).fill(false));
  const [loaded, setLoaded] = useState(false);

  const [restDuration, setRestDuration] = useState(90);
  const [restEndAt, setRestEndAt] = useState(null);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [now, setNow] = useState(Date.now());
  const tickRef = useRef(null);
  const audioCtxRef = useRef(null);

  /* ---- caricamento iniziale: giorno corrente, storico, timer, borsa ---- */

  const loadDay = useCallback(async (d) => {
    const raw = await storeGet(`day-progress:${d.id}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.date === todayISO() && Array.isArray(parsed.completedSets)) {
          setProgress(parsed.completedSets);
        } else {
          setProgress(emptyProgress(d));
        }
      } catch {
        setProgress(emptyProgress(d));
      }
    } else {
      setProgress(emptyProgress(d));
    }

    // pesi salvati per esercizio (condivisi tra i giorni se il nome coincide,
    // es. "Total abdominal machine" ricorda lo stesso peso ovunque compaia)
    const w = {};
    for (let i = 0; i < d.exercises.length; i++) {
      const rawW = await storeGet(`weight:${d.exercises[i].name}`);
      if (rawW) {
        try {
          w[i] = JSON.parse(rawW);
        } catch {
          /* skip */
        }
      }
    }
    setWeights(w);
  }, []);

  useEffect(() => {
    (async () => {
      // storico di tutti i giorni
      const hist = {};
      for (const d of DAYS) {
        const raw = await storeGet(`history:${d.id}`);
        try {
          hist[d.id] = raw ? JSON.parse(raw) : [];
        } catch {
          hist[d.id] = [];
        }
      }
      setHistory(hist);

      // apri sul primo giorno non ancora completato questa settimana
      const ws = startOfWeekISO();
      let startIdx = DAYS.findIndex((d) => !(hist[d.id] || []).some((dt) => dt >= ws));
      if (startIdx === -1) startIdx = 0;
      setDayIdx(startIdx);
      await loadDay(DAYS[startIdx]);

      // borsa della palestra (si azzera ogni giorno)
      const rawBag = await storeGet(`gym-bag:${todayISO()}`);
      if (rawBag) {
        try {
          const parsed = JSON.parse(rawBag);
          if (Array.isArray(parsed) && parsed.length === BAG_ITEMS.length) setBagChecked(parsed);
        } catch {
          /* skip */
        }
      }

      // durata timer di recupero salvata
      const rawDur = await storeGet("rest-duration");
      if (rawDur) {
        const d = parseInt(rawDur, 10);
        if (!Number.isNaN(d)) setRestDuration(d);
      }

      // preferenza notifiche
      const rawNotify = await storeGet("notify-enabled");
      if (rawNotify === "1") setNotifyEnabled(true);

      // timer di recupero eventualmente ancora in corso
      const rawEnd = await storeGet("rest-end-at");
      if (rawEnd) {
        const end = parseInt(rawEnd, 10);
        if (!Number.isNaN(end) && end > Date.now()) {
          setRestEndAt(end);
        } else {
          storeDelete("rest-end-at");
        }
      }

      setLoaded(true);
    })();
  }, [loadDay]);

  useEffect(() => {
    if (!loaded) return;
    loadDay(day);
  }, [dayIdx, loaded, day, loadDay]);

  /* ---- ticking del timer di recupero, sopravvive a refresh/uscita ---- */

  useEffect(() => {
    if (restEndAt) {
      tickRef.current = setInterval(() => setNow(Date.now()), 500);
      return () => clearInterval(tickRef.current);
    }
  }, [restEndAt]);

  useEffect(() => {
    if (restEndAt && now >= restEndAt) {
      setRestEndAt(null);
      storeDelete("rest-end-at");
      notifyRestOver(notifyEnabled, audioCtxRef.current);
    }
  }, [now, restEndAt, notifyEnabled]);

  const restRemaining = restEndAt ? Math.max(0, Math.ceil((restEndAt - now) / 1000)) : 0;

  const startRestTimer = async () => {
    const end = Date.now() + restDuration * 1000;
    setRestEndAt(end);
    await storeSet("rest-end-at", String(end));
    if (notifyEnabled) {
      scheduleRestPush(restDuration);
    }
  };

  const skipRestTimer = async () => {
    setRestEndAt(null);
    await storeDelete("rest-end-at");
  };

  const changeRestDuration = async (seconds) => {
    setRestDuration(seconds);
    await storeSet("rest-duration", String(seconds));
  };

  const toggleNotify = async () => {
    // crea/sblocca l'AudioContext qui, dentro un tocco diretto dell'utente:
    // e' l'unico momento in cui iOS Safari permette di avviare l'audio
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        /* audio non disponibile su questo dispositivo */
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    // suono di conferma immediato, cosi si sente che e' andato a buon fine
    playBeep(audioCtxRef.current);

    if (!notifyEnabled) {
      if (typeof Notification !== "undefined") {
        try {
          const perm = await Notification.requestPermission();
          if (perm === "granted") {
            setNotifyEnabled(true);
            await storeSet("notify-enabled", "1");
            // iscrizione alle notifiche push vere (funzionano anche ad app chiusa,
            // solo se l'app e' installata sulla schermata Home)
            subscribeToPush();
            return;
          }
        } catch {
          /* ignora */
        }
      }
      // anche se le notifiche push non sono disponibili, attiviamo comunque
      // vibrazione (dove supportata) e suono, che non richiedono permesso
      setNotifyEnabled(true);
      await storeSet("notify-enabled", "1");
    } else {
      setNotifyEnabled(false);
      await storeSet("notify-enabled", "0");
    }
  };

  /* ---- progressi giornalieri ---- */

  const saveProgress = useCallback(async (d, next) => {
    await storeSet(`day-progress:${d.id}`, JSON.stringify({ date: todayISO(), completedSets: next }));
  }, []);

  const toggleSet = (exIdx, setIdx) => {
    if (!bagChecked.every(Boolean)) return; // la borsa deve essere completa prima di poter allenarsi

    const next = progress.map((row) => row.slice());
    const wasDone = next[exIdx][setIdx];
    next[exIdx][setIdx] = !wasDone;
    setProgress(next);
    saveProgress(day, next);

    if (!wasDone) {
      const setsAllDone = next.every((row) => row.every(Boolean));
      if (setsAllDone) {
        // hai finito gli esercizi: se un recupero della serie precedente
        // era ancora in corso, lo interrompiamo, non ha piu senso
        skipRestTimer();
        maybeCompleteDay(next, bagChecked);
      } else {
        startRestTimer();
      }
    }
  };

  const maybeCompleteDay = (setsArr, bagArr) => {
    const alreadyRecorded = (history[day.id] || []).includes(todayISO());
    if (alreadyRecorded) return;
    const setsAllDone = setsArr.every((row) => row.every(Boolean));
    const bagAllDone = bagArr.every(Boolean);
    if (setsAllDone && bagAllDone) {
      recordCompletion(day);
      setCelebrate(true);
    }
  };

  const recordCompletion = async (d) => {
    const raw = await storeGet(`history:${d.id}`);
    let arr = [];
    try {
      arr = raw ? JSON.parse(raw) : [];
    } catch {
      arr = [];
    }
    const today = todayISO();
    if (!arr.includes(today)) {
      const next = [today, ...arr].slice(0, 20);
      await storeSet(`history:${d.id}`, JSON.stringify(next));
      setHistory((h) => ({ ...h, [d.id]: next }));
    }
  };

  /* ---- peso per esercizio ---- */

  const changeWeight = (exIdx, delta) => {
    const exerciseName = day.exercises[exIdx].name;
    const current = weights[exIdx]?.value ?? 0;
    const next = Math.max(0, Math.round((current + delta) * 2) / 2);
    const entry = { value: next, date: todayISO() };
    setWeights((w) => ({ ...w, [exIdx]: entry }));
    storeSet(`weight:${exerciseName}`, JSON.stringify(entry));
  };

  /* ---- borsa della palestra ---- */

  const toggleBagItem = (i) => {
    const next = bagChecked.slice();
    next[i] = !next[i];
    setBagChecked(next);
    storeSet(`gym-bag:${todayISO()}`, JSON.stringify(next));
    maybeCompleteDay(progress, next);
  };

  /* ---- reset ---- */

  const resetDay = async () => {
    const fresh = emptyProgress(day);
    setProgress(fresh);
    saveProgress(day, fresh);

    const raw = await storeGet(`history:${day.id}`);
    let arr = [];
    try {
      arr = raw ? JSON.parse(raw) : [];
    } catch {
      arr = [];
    }
    const today = todayISO();
    if (arr.includes(today)) {
      const next = arr.filter((dt) => dt !== today);
      await storeSet(`history:${day.id}`, JSON.stringify(next));
      setHistory((h) => ({ ...h, [day.id]: next }));
    }
  };

  const resetWeek = async () => {
    const weekStartNow = startOfWeekISO();
    for (const d of DAYS) {
      const raw = await storeGet(`history:${d.id}`);
      let arr = [];
      try {
        arr = raw ? JSON.parse(raw) : [];
      } catch {
        arr = [];
      }
      const filtered = arr.filter((dt) => dt < weekStartNow);
      if (filtered.length !== arr.length) {
        await storeSet(`history:${d.id}`, JSON.stringify(filtered));
        setHistory((h) => ({ ...h, [d.id]: filtered }));
      }

      const freshSets = emptyProgress(d);
      await storeSet(`day-progress:${d.id}`, JSON.stringify({ date: todayISO(), completedSets: freshSets }));
      if (d.id === day.id) setProgress(freshSets);
    }
  };

  const done = progress.reduce((a, row) => a + row.filter(Boolean).length, 0);
  const total = totalSets(day);

  const weekStart = startOfWeekISO();
  const sessionsThisWeek = Object.values(history).flat().filter((d) => d >= weekStart).length;

  if (view === "settings") {
    return (
      <div className="min-h-screen w-full flex justify-center" style={{ background: BG, fontFamily: "'Google Sans Flex', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700;800;900&display=swap');
        `}</style>
        <SettingsPage
          restDuration={restDuration}
          onChangeDuration={changeRestDuration}
          notifyEnabled={notifyEnabled}
          onToggleNotify={toggleNotify}
          onBack={() => setView("main")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: BG, fontFamily: "'Google Sans Flex', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700;800;900&display=swap');
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div className="w-full max-w-md px-4 pb-10" style={{ minHeight: "100vh" }}>
        {/* TOP BAR */}
        <div className="flex items-center justify-between pt-6 pb-5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: INK }}>
            <Dumbbell size={17} color="#FFFFFF" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("settings")}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: BUTTON }}
              aria-label="Impostazioni"
            >
              <SettingsIcon size={16} color={INK} />
            </button>
            <button
              onClick={resetDay}
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: BUTTON }}
              aria-label="Reset giorno"
            >
              <RotateCcw size={16} color={INK} />
            </button>
          </div>
        </div>

        {/* HEADLINE */}
        <div className="mb-6">
          <p className="text-xs font-medium mb-1" style={{ color: "rgba(58,55,66,0.55)", letterSpacing: "0.02em" }}>
            Technogym · 5 giorni
          </p>
          <h1 className="leading-tight" style={{ color: INK, fontSize: "32px" }}>
            <span style={{ fontWeight: 400 }}>Scheda di </span>
            <span style={{ fontWeight: 800 }}>Gianmaria</span>
          </h1>
        </div>

        {/* REST TIMER (se attivo) */}
        {restEndAt && <RestTimerBar remaining={restRemaining} duration={restDuration} onSkip={skipRestTimer} />}

        {/* DAY PILLS */}
        <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {DAYS.map((d, i) => {
            const active = i === dayIdx;
            return (
              <button
                key={d.id}
                onClick={() => setDayIdx(i)}
                className="flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm active:scale-95 transition-transform"
                style={{ background: active ? INK : BUTTON, color: active ? "#FFFFFF" : INK }}
              >
                {d.short}
              </button>
            );
          })}
        </div>

        {/* BORSA DELLA PALESTRA */}
        <GymBag
          checked={bagChecked}
          onToggle={toggleBagItem}
          nudge={!bagChecked.every(Boolean)}
        />

        {/* HERO DAY CARD */}
        <div className="rounded-3xl p-6 mb-4 relative overflow-hidden" style={{ background: day.color }}>
          <img
            src={day.illustration}
            alt=""
            className="absolute pointer-events-none"
            style={{ bottom: "-4px", right: "-2px", width: "150px", height: "150px", opacity: 0.95 }}
          />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: INK, opacity: 0.65 }}>
                {day.focus}
              </p>
              <h2 className="font-extrabold leading-none" style={{ color: INK, fontSize: "34px" }}>
                {day.title}
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.5)", color: INK }}>
              {done}/{total}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.28)", marginBottom: "110px" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${total ? (done / total) * 100 : 0}%`, background: INK, transition: "width 0.3s ease" }}
            />
          </div>
        </div>

        {/* EXERCISES */}
        {!bagChecked.every(Boolean) && (
          <div className="rounded-2xl p-4 mb-2.5 flex items-center gap-2.5" style={{ background: CARD }}>
            <Lock size={15} color={TERRACOTTA} />
            <p className="text-xs font-semibold" style={{ color: TERRACOTTA }}>
              Completa la borsa qui sopra per iniziare gli esercizi
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2.5 mb-6">
          {day.exercises.map((ex, exIdx) => {
            const cat = CATEGORY[ex.cat];
            const row = progress[exIdx] || [];
            const rowDone = row.filter(Boolean).length;
            const w = weights[exIdx];
            const isToday = w && w.date === todayISO();
            const locked = !bagChecked.every(Boolean);

            return (
              <div
                key={exIdx}
                className="rounded-2xl p-4"
                style={{ background: CARD, boxShadow: "0 1px 0 rgba(58,55,66,0.08)", opacity: locked ? 0.5 : 1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: INK, background: cat.color }}>
                    {cat.label}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: "rgba(58,55,66,0.55)" }}>
                    {ex.sets}×{ex.reps}
                  </span>
                </div>

                <p className="text-base font-semibold mb-3" style={{ color: rowDone === ex.sets ? "rgba(58,55,66,0.4)" : INK }}>
                  {ex.name}
                </p>

                <div className="flex gap-2 mb-3">
                  {row.map((setDone, setIdx) => (
                    <button
                      key={setIdx}
                      onClick={() => toggleSet(exIdx, setIdx)}
                      disabled={locked}
                      className="flex-1 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                      style={{ background: setDone ? OLIVE : BUTTON, cursor: locked ? "not-allowed" : "pointer" }}
                      aria-label={`Serie ${setIdx + 1} di ${ex.name}`}
                    >
                      {setDone ? (
                        <Check size={19} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <span className="text-sm font-bold" style={{ color: INK }}>
                          {setIdx + 1}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* PESO */}
                <div className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.5)" }}>
                  <span className="text-xs font-medium" style={{ color: "rgba(58,55,66,0.6)" }}>
                    {w && !isToday ? `Ultima volta: ${w.value} kg` : "Peso"}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeWeight(exIdx, -2.5)}
                      className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                      style={{ background: BUTTON }}
                      aria-label="Diminuisci peso"
                    >
                      <Minus size={13} color={INK} />
                    </button>
                    <span className="text-sm font-bold tabular-nums" style={{ color: INK, minWidth: "40px", textAlign: "center" }}>
                      {(w?.value ?? 0)} kg
                    </span>
                    <button
                      onClick={() => changeWeight(exIdx, 2.5)}
                      className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                      style={{ background: BUTTON }}
                      aria-label="Aumenta peso"
                    >
                      <Plus size={13} color={INK} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* WEEK SUMMARY */}
        <div className="rounded-3xl p-5" style={{ background: CARD }}>
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-semibold" style={{ color: INK }}>
              Questa settimana
            </p>
            <button
              onClick={resetWeek}
              className="flex items-center gap-1 text-xs font-semibold active:scale-95 transition-transform"
              style={{ color: "rgba(58,55,66,0.55)" }}
            >
              <RotateCcw size={12} />
              Reset settimana
            </button>
          </div>
          <p className="text-xs mb-2" style={{ color: "rgba(58,55,66,0.55)" }}>
            {sessionsThisWeek} {sessionsThisWeek === 1 ? "sessione completata" : "sessioni completate"}
          </p>
          <BubbleCluster days={DAYS} history={history} weekStart={weekStart} />
        </div>
      </div>

      {celebrate && <Celebration onDone={() => setCelebrate(false)} />}
    </div>
  );
}
