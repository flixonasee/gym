import React, { useState, useEffect, useCallback } from "react";
import { Check, RotateCcw, Dumbbell } from "lucide-react";

/* ---------------------------------------------------------------
   PALETTE — solo questi 5 colori, nessun altro
--------------------------------------------------------------- */

const YELLOW = "#F3D97E";
const OLIVE = "#8E9868";
const TERRACOTTA = "#E1927E";
const BLUE = "#7DA4DC";
const BLUSH = "#EDDBD1";
const LAVENDER = "#A6ACDB";
const GREEN_GAMBE = "rgb(183, 248, 54)";
const BG = "#E5E4E8";
const CARD = "#EDDBD1";
const BUTTON = "#FFFFFF";
const INK = "#3A3742"; // neutro scuro, indispensabile per il testo leggibile — non fa parte della palette ma serve da inchiostro

const PALETTE_CYCLE = [TERRACOTTA, YELLOW, LAVENDER, BLUE, OLIVE, BLUSH];

function inkFor() {
  return INK;
}

const CATEGORY_ORDER = [
  "petto",
  "spalle",
  "bicipiti",
  "tricipiti",
  "dorso",
  "gambe",
  "addominali",
];
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
  CATEGORY_ORDER.map((key, i) => [
    key,
    {
      label: CATEGORY_LABELS[key],
      color: PALETTE_CYCLE[i % PALETTE_CYCLE.length],
    },
  ])
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
      {
        name: "Curl bicipiti seduto su panca",
        sets: 3,
        reps: "10",
        cat: "bicipiti",
      },
      {
        name: "Curl bicipiti su panca Scott",
        sets: 2,
        reps: "10",
        cat: "bicipiti",
      },
      {
        name: "Total abdominal machine",
        sets: 4,
        reps: "10-12",
        cat: "addominali",
      },
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
      {
        name: "Total abdominal machine",
        sets: 4,
        reps: "10-12",
        cat: "addominali",
      },
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
      {
        name: "Total abdominal machine",
        sets: 4,
        reps: "10-12",
        cat: "addominali",
      },
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
      {
        name: "Curl bicipiti seduto su panca",
        sets: 3,
        reps: "10",
        cat: "bicipiti",
      },
      {
        name: "Pushdown tricipiti ai cavi",
        sets: 3,
        reps: "10",
        cat: "tricipiti",
      },
      {
        name: "Total abdominal machine",
        sets: 4,
        reps: "10-12",
        cat: "addominali",
      },
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

/* ---------------------------------------------------------------
   STORAGE
--------------------------------------------------------------- */

const hasCloudStorage =
  typeof window !== "undefined" &&
  window.storage &&
  typeof window.storage.get === "function";

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

/* ---------------------------------------------------------------
   BUBBLE CLUSTER — riepilogo settimanale, ispirato alle bolle
   di statistiche dell'immagine di riferimento
--------------------------------------------------------------- */

function BubbleCluster({ days, history, weekStart }) {
  return (
    <div className="flex justify-between gap-2">
      {days.map((d) => {
        const doneRecently = (history[d.id] || []).some(
          (dt) => dt >= weekStart
        );
        const bg = doneRecently ? d.color : "rgba(142,137,143,0.14)";
        const ink = doneRecently ? INK : "rgba(58,55,66,0.35)";
        return (
          <div
            key={d.id}
            className="rounded-full flex items-center justify-center font-semibold flex-1"
            style={{
              aspectRatio: "1 / 1",
              background: bg,
              color: ink,
              fontSize: "14px",
            }}
          >
            {d.short}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------- */

export default function SchedaGianmaria() {
  const [dayIdx, setDayIdx] = useState(0);
  const day = DAYS[dayIdx];

  const [progress, setProgress] = useState(() => emptyProgress(DAYS[0]));
  const [history, setHistory] = useState({});
  const [loaded, setLoaded] = useState(false);

  const loadDay = useCallback(async (d) => {
    const raw = await storeGet(`day-progress:${d.id}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.date === todayISO() && Array.isArray(parsed.completedSets)) {
          setProgress(parsed.completedSets);
          return;
        }
      } catch {
        /* fall through */
      }
    }
    setProgress(emptyProgress(d));
  }, []);

  const loadHistory = useCallback(async () => {
    const next = {};
    for (const d of DAYS) {
      const raw = await storeGet(`history:${d.id}`);
      try {
        next[d.id] = raw ? JSON.parse(raw) : [];
      } catch {
        next[d.id] = [];
      }
    }
    setHistory(next);
  }, []);

  useEffect(() => {
    (async () => {
      await loadDay(DAYS[0]);
      await loadHistory();
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    loadDay(day);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayIdx, loaded]);

  const saveProgress = useCallback(async (d, next) => {
    await storeSet(
      `day-progress:${d.id}`,
      JSON.stringify({ date: todayISO(), completedSets: next })
    );
  }, []);

  const toggleSet = (exIdx, setIdx) => {
    const next = progress.map((row) => row.slice());
    const wasDone = next[exIdx][setIdx];
    next[exIdx][setIdx] = !wasDone;
    setProgress(next);
    saveProgress(day, next);

    if (!wasDone) {
      const allDone = next.every((row) => row.every(Boolean));
      if (allDone) recordCompletion(day);
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

  const resetDay = async () => {
    const fresh = emptyProgress(day);
    setProgress(fresh);
    saveProgress(day, fresh);

    // rimuove anche la data odierna dallo storico, se presente,
    // cosi il riepilogo settimanale non mostra piu il giorno come completato
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
      // pulisce lo storico di completamento della settimana corrente
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

      // azzera anche le serie segnate di OGNI giorno, non solo di quello aperto
      const freshSets = emptyProgress(d);
      await storeSet(
        `day-progress:${d.id}`,
        JSON.stringify({ date: todayISO(), completedSets: freshSets })
      );
      if (d.id === day.id) {
        setProgress(freshSets);
      }
    }
  };

  const done = progress.reduce((a, row) => a + row.filter(Boolean).length, 0);
  const total = totalSets(day);
  const dayComplete = total > 0 && done === total;

  const weekStart = startOfWeekISO();
  const sessionsThisWeek = Object.values(history)
    .flat()
    .filter((d) => d >= weekStart).length;

  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: BG, fontFamily: "'Google Sans Flex', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700;800;900&display=swap');
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div
        className="w-full max-w-md px-4 pb-10"
        style={{ minHeight: "100vh" }}
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between pt-6 pb-5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: INK }}
          >
            <Dumbbell size={17} color="#FFFFFF" />
          </div>
          <button
            onClick={resetDay}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: BUTTON }}
            aria-label="Reset giorno"
          >
            <RotateCcw size={16} color={INK} />
          </button>
        </div>

        {/* HEADLINE */}
        <div className="mb-6">
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "rgba(58,55,66,0.55)", letterSpacing: "0.02em" }}
          >
            Technogym · 5 giorni
          </p>
          <h1
            className="leading-tight"
            style={{ color: INK, fontSize: "32px" }}
          >
            <span style={{ fontWeight: 400 }}>Scheda di </span>
            <span style={{ fontWeight: 800 }}>Gianmaria</span>
          </h1>
        </div>

        {/* DAY PILLS */}
        <div
          className="flex gap-2 mb-5 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {DAYS.map((d, i) => {
            const active = i === dayIdx;
            return (
              <button
                key={d.id}
                onClick={() => setDayIdx(i)}
                className="flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm active:scale-95 transition-transform"
                style={{
                  background: active ? INK : BUTTON,
                  color: active ? "#FFFFFF" : INK,
                }}
              >
                {d.short}
              </button>
            );
          })}
        </div>

        {/* HERO DAY CARD */}
        <div
          className="rounded-3xl p-6 mb-4 relative overflow-hidden"
          style={{ background: day.color }}
        >
          <img
            src={day.illustration}
            alt=""
            className="absolute pointer-events-none"
            style={{
              bottom: "0px",
              right: "-10px",
              width: "240px",
              height: "240px",
              opacity: 0.6,
            }}
          />
          <div className="flex items-start justify-between mb-6 relative">
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: INK, opacity: 0.65 }}
              >
                {day.focus}
              </p>
              <h2
                className="font-extrabold leading-none"
                style={{ color: INK, fontSize: "34px" }}
              >
                {day.title}
              </h2>
            </div>
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(255,255,255,1)", color: INK }}
            >
              {done}/{total}
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden relative"
            style={{
              background: "rgba(255,255,255,0.28)",
              marginBottom: "110px",
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${total ? (done / total) * 100 : 0}%`,
                background: INK,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* EXERCISES — pannello bianco sotto la hero card */}
        <div className="flex flex-col gap-2.5 mb-6">
          {day.exercises.map((ex, exIdx) => {
            const cat = CATEGORY[ex.cat];
            const row = progress[exIdx] || [];
            const rowDone = row.filter(Boolean).length;
            return (
              <div
                key={exIdx}
                className="rounded-2xl p-4"
                style={{
                  background: CARD,
                  boxShadow: "0 1px 0 rgba(58,55,66,0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ color: INK, background: cat.color }}
                  >
                    {cat.label}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "rgba(58,55,66,0.55)" }}
                  >
                    {ex.sets}×{ex.reps}
                  </span>
                </div>

                <p
                  className="text-base font-semibold mb-3"
                  style={{
                    color: rowDone === ex.sets ? "rgba(58,55,66,0.4)" : INK,
                  }}
                >
                  {ex.name}
                </p>

                <div className="flex gap-2">
                  {row.map((setDone, setIdx) => (
                    <button
                      key={setIdx}
                      onClick={() => toggleSet(exIdx, setIdx)}
                      className="flex-1 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                      style={{ background: setDone ? OLIVE : BUTTON }}
                      aria-label={`Serie ${setIdx + 1} di ${ex.name}`}
                    >
                      {setDone ? (
                        <Check size={19} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <span
                          className="text-sm font-bold"
                          style={{ color: INK }}
                        >
                          {setIdx + 1}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* WEEK SUMMARY — bubble cluster */}
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
            {sessionsThisWeek}{" "}
            {sessionsThisWeek === 1
              ? "sessione completata"
              : "sessioni completate"}
          </p>
          <BubbleCluster days={DAYS} history={history} weekStart={weekStart} />
        </div>
      </div>
    </div>
  );
}
