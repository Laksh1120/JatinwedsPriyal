import { createFileRoute } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Hand, Heart, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
const welcomeDinnerImageAsset = { url: "/media/welcome-dinner.webp" };
const ringCeremonyImageAsset = { url: "/media/ring-ceremony.webp" };
const haldiImageAsset = { url: "/media/haldi.webp" };
const baraatImageAsset = { url: "/media/baraat.webp" };
const receptionImageAsset = { url: "/media/reception.webp" };
const phereImageAsset = { url: "/media/mandap.webp" };
const introVideoWebm = { url: "/media/intro.webm" };
const introVideoMp4 = { url: "/media/intro.mp4" };
const ganpatiLogo = { url: "/media/ganpati-logo.svg" };
const lotusBottom = { url: "/media/lotus-bottom.png" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Priyal & Jatin — Wedding Invitation" },
      { name: "description", content: "Celebrate Priyal and Jatin at Praveg Lake Resort on December 12, 2026." },
      { property: "og:title", content: "Priyal & Jatin — Wedding Invitation" },
      { property: "og:description", content: "Celebrate Priyal and Jatin at Praveg Lake Resort on December 12, 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const welcomeDinnerImage = welcomeDinnerImageAsset.url;
const ringCeremonyImage = ringCeremonyImageAsset.url;
const haldiImage = haldiImageAsset.url;
const baraatImage = baraatImageAsset.url;
const receptionImage = receptionImageAsset.url;
const phereImage = phereImageAsset.url;

type EventItem = { image: string; alt: string; title: string; date: [string, string, string]; time: string; day: string; note?: string };

const eventDays: EventItem[] = [
  { image: welcomeDinnerImage, alt: "Lakeside welcome celebration", title: "Welcome Lunch", date: ["11", "12", "26"], time: "1 PM onwards", day: "Friday" },
  { image: ringCeremonyImage, alt: "Rings on a lavender cushion", title: "Ring Ceremony & Sangeet", date: ["11", "12", "26"], time: "5 PM onwards", day: "Friday", note: "Followed by Cocktail Party" },
  { image: haldiImage, alt: "Flower haldi seat with marigolds", title: "Phoolon Wali Haldi", date: ["12", "12", "26"], time: "10 AM onwards", day: "Saturday" },
  { image: baraatImage, alt: "Baraat procession with dhol", title: "Baraat", date: ["12", "12", "26"], time: "6 PM onwards", day: "Saturday" },
  { image: receptionImage, alt: "Candlelit reception by the lake", title: "Baraat Swagat & Reception", date: ["12", "12", "26"], time: "8 PM onwards", day: "Saturday" },
  { image: phereImage, alt: "Mandap by the lake at night", title: "Phere", date: ["12", "12", "26"], time: "11 PM onwards", day: "Saturday" },
];

const COUNTDOWN_TARGET = new Date("2026-12-12T00:00:00+05:30").getTime();
const ENVELOPE_SESSION_KEY = "priyal-jatin-envelope-opened";
const MUSIC_SRC = "/media/fade-into-you.mp3";
const MUSIC_VOLUME = 0.45; // 0-1, final loudness
const SCROLL_HINT_DELAY_MS = 3000; // idle time on page 1 before the "scroll down" hand appears
const MUSIC_FADE_MS = 4000; // fade-in length after the envelope tap

type IntroStep = "boot" | "envelope" | "opening" | "video" | "transition" | "final";

const IntroStepContext = createContext<IntroStep>("boot");
const TRANSITION_MS = 2600; // keep longer than the 2s ticket arrival so the hand-off never cuts it short
const TEXT_REVEAL_DELAY_MS = 1400; // invitation text appears this long after the ticket starts arriving

function createTicketPath(width: number, height: number) {
  const inset = Math.min(width * 0.08, 40);
  const radius = 22;
  return [
    `M ${inset + radius} 0`,
    `H ${width - inset - radius}`,
    `A ${radius} ${radius} 0 0 1 ${width - inset} ${radius}`,
    `A ${inset} ${inset} 0 0 0 ${width} ${radius + inset}`,
    `V ${height - radius - inset}`,
    `A ${inset} ${inset} 0 0 0 ${width - inset} ${height - radius}`,
    `A ${radius} ${radius} 0 0 1 ${width - inset - radius} ${height}`,
    `H ${inset + radius}`,
    `A ${radius} ${radius} 0 0 1 ${inset} ${height - radius}`,
    `A ${inset} ${inset} 0 0 0 0 ${height - radius - inset}`,
    `V ${radius + inset}`,
    `A ${inset} ${inset} 0 0 0 ${inset} ${radius}`,
    `A ${radius} ${radius} 0 0 1 ${inset + radius} 0 Z`,
  ].join(" ");
}

function InvitationExperience({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<IntroStep>("boot");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollHint, setScrollHint] = useState(false);
  const [ticketPath, setTicketPath] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<number | null>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef(0);
  const musicStartedRef = useRef(false);

  const fadeMusicIn = () => {
    const music = musicRef.current;
    if (!music) return;
    window.cancelAnimationFrame(fadeRef.current);
    music.volume = 0;
    const started = performance.now();
    const tick = () => {
      const progress = Math.min(Math.max((performance.now() - started) / MUSIC_FADE_MS, 0), 1);
      music.volume = MUSIC_VOLUME * progress;
      if (progress < 1) fadeRef.current = window.requestAnimationFrame(tick);
    };
    fadeRef.current = window.requestAnimationFrame(tick);
  };

  const startMusic = () => {
    const music = musicRef.current;
    if (!music) return;
    musicStartedRef.current = true;
    void music.play().then(fadeMusicIn).catch(() => undefined);
  };

  // Some browsers (notably iOS Safari) pause the song while the intro video plays or ends; keep it going.
  useEffect(() => {
    if (step !== "transition" && step !== "final") return;
    const music = musicRef.current;
    if (!music || !musicStartedRef.current || !music.paused) return;
    void music.play().catch(() => undefined);
  }, [step]);

  useEffect(() => () => window.cancelAnimationFrame(fadeRef.current), []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadyOpened = false;
    try {
      alreadyOpened = Boolean(window.sessionStorage.getItem(ENVELOPE_SESSION_KEY));
    } catch {
      // The opening still works when browser storage is unavailable.
    }
    setStep(reducedMotion || alreadyOpened ? "final" : "envelope");
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const updatePath = () => setTicketPath(createTicketPath(card.clientWidth, card.clientHeight));
    updatePath();
    const observer = new ResizeObserver(updatePath);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Nudge the guest to scroll if they are still on page 1 a few seconds after the invitation appears.
  useEffect(() => {
    if (step !== "final") return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    let dismissed = false;
    const onScroll = () => {
      if (scroller.scrollTop > 20) {
        dismissed = true;
        setScrollHint(false);
      }
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const timeout = window.setTimeout(() => {
      if (!dismissed && scroller.scrollTop <= 20) setScrollHint(true);
    }, SCROLL_HINT_DELAY_MS);
    return () => {
      window.clearTimeout(timeout);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [step]);

  useEffect(() => {
    if (step !== "transition") return;
    const timeout = window.setTimeout(() => setStep("final"), TRANSITION_MS);
    return () => window.clearTimeout(timeout);
  }, [step]);

  const openEnvelope = () => {
    if (step !== "envelope") return;
    try {
      window.sessionStorage.setItem(ENVELOPE_SESSION_KEY, "true");
    } catch {
      // A blocked storage write should not stop the opening.
    }
    startMusic();
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      void video.play().catch(() => undefined);
    }
    window.requestAnimationFrame(() => setStep("opening"));
    window.setTimeout(() => setStep("video"), 3100);
    fallbackRef.current = window.setTimeout(() => setStep("transition"), 4200);
  };

  const finishVideo = () => {
    if (step !== "opening" && step !== "video") return;
    if (fallbackRef.current !== null) window.clearTimeout(fallbackRef.current);
    const video = videoRef.current;
    if (video) video.pause();
    setStep("transition");
  };

  const showEnvelope = step === "envelope" || step === "opening";
  const showVideo = step !== "boot";
  const showCard = step === "transition" || step === "final";
  const clipPath = ticketPath ? `path('${ticketPath}')` : undefined;

  return (
    <IntroStepContext.Provider value={step}>
    <div className={`invitation-experience invitation-experience--${step}`}>
      <audio ref={musicRef} src={MUSIC_SRC} loop preload="none" />
      {showVideo && (
        <div className="intro-video-layer" aria-hidden={step === "final"}>
          <video
            ref={videoRef}
            className="intro-video"
            playsInline
            preload="auto"
            onEnded={finishVideo}
            onLoadedMetadata={(event) => {
              if (step === "final" && Number.isFinite(event.currentTarget.duration)) {
                event.currentTarget.currentTime = Math.max(0, event.currentTarget.duration - 0.05);
              }
            }}
          >
            <source src={introVideoWebm.url} type="video/webm" />
            <source src={introVideoMp4.url} type="video/mp4" />
          </video>
        </div>
      )}

      {showEnvelope && (
        <div
          className={`envelope-v2 fixed inset-0 z-[5] h-[100dvh] w-[100dvw] cursor-pointer overflow-hidden [--tip:50%] [perspective:1200px]${step === "opening" ? " envelope-v2--opening pointer-events-none" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation"
          onClick={openEnvelope}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openEnvelope();
            }
          }}
        >
          <style>{`
            .envelope-v2__paper{background:#F3EDE2 url("/assets/envelope.jpg") center/cover no-repeat}
            .envelope-v2__flap{transform-origin:top center;transform-style:preserve-3d}
            .envelope-v2__face{backface-visibility:hidden;-webkit-backface-visibility:hidden}
            .envelope-v2__back{transform:rotateX(180deg);background:linear-gradient(to bottom,#EFE6D6,#F6F0E4)}
            .envelope-v2--opening .envelope-v2__flap{will-change:transform;animation:envelope-v2-flap 1.3s cubic-bezier(.45,0,.2,1) forwards}
            .envelope-v2--opening .envelope-v2__pocket{will-change:transform;animation:envelope-v2-pocket 2.2s cubic-bezier(.65,0,.35,1) .9s forwards}
            .envelope-v2__tap{animation:envelope-v2-tap-in 1s ease-out both}
            .envelope-v2--opening .envelope-v2__tap{opacity:0;animation:none;transition:opacity .25s ease}
            @keyframes envelope-v2-tap-in{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
            @keyframes envelope-v2-flap{to{transform:rotateX(-180deg)}}
            @keyframes envelope-v2-pocket{to{transform:translate3d(0,105%,0)}}
          `}</style>

          <div className="envelope-v2__flap fixed inset-0 z-[3] h-[100dvh] w-[100dvw]" aria-hidden="true">
            <div className="envelope-v2__face envelope-v2__paper absolute inset-0 [clip-path:polygon(0_0,100%_0,50%_var(--tip))]" />
            <div className="envelope-v2__face envelope-v2__back absolute inset-0 [clip-path:polygon(0_0,100%_0,50%_var(--tip))]" />
          </div>

          <div className="envelope-v2__pocket envelope-v2__paper fixed inset-0 z-[1] h-[100dvh] w-[100dvw] [clip-path:polygon(0_0,50%_var(--tip),100%_0,100%_100%,0_100%)]" aria-hidden="true" />
          <p className="envelope-v2__tap pointer-events-none fixed left-1/2 top-[68%] z-[4] whitespace-nowrap font-script text-[clamp(1.5rem,7vw,2rem)] text-[#7A4B4B]" aria-hidden="true">Tap to open</p>
        </div>
      )}

      <div
        ref={cardRef}
        className={`framed-invitation${showCard ? " framed-invitation--visible" : ""}`}
        style={{ clipPath }}
        aria-hidden={!showCard}
      >
        <div className="framed-invitation__paper" />
        <div ref={scrollRef} className="framed-invitation__scroll"><div className="framed-invitation__content">{children}</div></div>
        <div className={`scroll-hint${scrollHint ? " scroll-hint--visible" : ""}`} aria-hidden="true"><Hand className="scroll-hint__hand" /><span>Scroll down</span></div>
      </div>
      {showCard && ticketPath && (
        <>
          <svg className="ticket-glow" viewBox={`0 0 ${cardRef.current?.clientWidth ?? 1} ${cardRef.current?.clientHeight ?? 1}`} preserveAspectRatio="none" aria-hidden="true"><path d={ticketPath} /></svg>
          <svg className="ticket-border" viewBox={`0 0 ${cardRef.current?.clientWidth ?? 1} ${cardRef.current?.clientHeight ?? 1}`} preserveAspectRatio="none" aria-hidden="true">
            <path className="ticket-border__pink" d={ticketPath} />
            <path className="ticket-border__cream" d={ticketPath} />
          </svg>
        </>
      )}
    </div>
    </IntroStepContext.Provider>
  );
}

function getRemaining() {
  const diff = COUNTDOWN_TARGET - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    arrived: diff <= 0,
    days: Math.floor(clamped / 86400000),
    hours: Math.floor(clamped / 3600000) % 24,
    minutes: Math.floor(clamped / 60000) % 60,
    seconds: Math.floor(clamped / 1000) % 60,
  };
}

function Countdown() {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // "static" = visible (SSR / no JS), "armed" = hidden and waiting, "shown" = flipping in one after another
  const [flip, setFlip] = useState<"static" | "armed" | "shown">("static");

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;
    setFlip("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setFlip("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setRemaining(getRemaining());
    const id = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [
    { label: "Days", value: remaining ? String(remaining.days) : "--" },
    { label: "Hours", value: remaining ? pad(remaining.hours) : "--" },
    { label: "Minutes", value: remaining ? pad(remaining.minutes) : "--" },
    { label: "Seconds", value: remaining ? pad(remaining.seconds) : "--" },
  ];

  return (
    <div className="animate-fade-in">
      <div ref={gridRef} className={`count-grid count-grid--${flip} grid grid-cols-2 gap-3 lg:grid-cols-4`}>
        {units.map((unit, index) => (
          <div key={unit.label} className="count-card" style={{ "--i": index } as React.CSSProperties}>
            <span className="num" aria-hidden="true">{unit.value}</span>
            <span className="rule" aria-hidden="true" />
            <span className="lbl">{unit.label}</span>
            <span className="sr-only">{unit.value} {unit.label.toLowerCase()}</span>
          </div>
        ))}
      </div>
      {remaining?.arrived && <p className="text-center font-display text-xl italic text-foreground/80 md:text-2xl">Today is the day — the lake is waiting.</p>}
    </div>
  );
}

function Flourish({ dark = false }: { dark?: boolean }) {
  return <div className={`flourish ${dark ? "flourish--dark" : ""}`} aria-hidden="true"><span /><Heart className="size-3" /><span /></div>;
}

function SectionHeading({ eyebrow, title, tone = "light" }: { eyebrow?: string; title: string; tone?: "light" | "dark" }) {
  return <div className="section-heading text-center">{eyebrow && <p className="font-body text-sm uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>}<h2 className="mt-3 font-display text-5xl font-normal text-foreground md:text-7xl">{title}</h2><Flourish dark={tone === "dark"} /></div>;
}

const LOTUS_TOP = [
  { id: "left", src: "/assets/lotus-top-left.png", left: 0, width: 40.8, delay: "0s" },
  { id: "center", src: "/assets/lotus-top-center.png", left: 40.8, width: 33.3, delay: "-1.7s" },
  { id: "right", src: "/assets/lotus-top-right.png", left: 74, width: 26, delay: "-3.4s" },
] as const;

const LOTUS_DRAG_LIMIT = 35; // degrees
const LOTUS_FOLLOW = 0.35; // 0-1, higher = snappier follow while held
const LOTUS_STIFFNESS = 90; // spring k
const LOTUS_DAMPING = 7; // spring c (lower = more bounce)
const LOTUS_TAP_KICK = 90; // deg/s given to a quick tap

type LotusState = { angle: number; velocity: number; target: number; held: boolean; grab: number; last: number; raf: number };

// Shared drag + damped-spring behaviour. `pivot` is where the stems meet the page edge.
function useLotusDrag(pivot: "top" | "bottom") {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const imgRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const states = useRef<Record<string, LotusState>>({});
  const pivotXs = useRef<Record<string, number>>({});

  useEffect(() => {
    const current = states.current;
    return () => {
      Object.values(current).forEach((state) => window.cancelAnimationFrame(state.raf));
    };
  }, []);

  const getState = (id: string) =>
    (states.current[id] ??= { angle: 0, velocity: 0, target: 0, held: false, grab: 0, last: 0, raf: 0 });

  const apply = (id: string, angle: number) => {
    const img = imgRefs.current[id];
    if (img) img.style.transform = angle ? `rotate(${angle}deg)` : "";
  };

  const pointerAngle = (id: string, event: React.PointerEvent) => {
    const item = itemRefs.current[id];
    const parent = item?.offsetParent as HTMLElement | null;
    if (!item || !parent) return 0;
    const box = parent.getBoundingClientRect();
    const dx = event.clientX - (box.left + item.offsetLeft + item.offsetWidth * (pivotXs.current[id] ?? 0.5));
    if (pivot === "top") {
      const dy = Math.max(event.clientY - (box.top + item.offsetTop), 12);
      return -(Math.atan2(dx, dy) * 180) / Math.PI;
    }
    const dy = Math.max(box.top + item.offsetTop + item.offsetHeight - event.clientY, 12);
    return (Math.atan2(dx, dy) * 180) / Math.PI;
  };

  const run = (id: string) => {
    const state = getState(id);
    window.cancelAnimationFrame(state.raf);
    state.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - state.last) / 1000, 1 / 30);
      state.last = now;
      if (state.held) {
        const next = state.angle + (state.target - state.angle) * LOTUS_FOLLOW;
        state.velocity = dt ? (next - state.angle) / dt : 0;
        state.angle = next;
      } else {
        state.velocity += (-LOTUS_STIFFNESS * state.angle - LOTUS_DAMPING * state.velocity) * dt;
        state.angle += state.velocity * dt;
        if (Math.abs(state.angle) < 0.05 && Math.abs(state.velocity) < 0.5) {
          state.angle = 0;
          state.velocity = 0;
          apply(id, 0);
          itemRefs.current[id]?.classList.remove("lotus-item--held");
          return;
        }
      }
      apply(id, state.angle);
      state.raf = window.requestAnimationFrame(tick);
    };
    state.raf = window.requestAnimationFrame(tick);
  };

  const onDown = (id: string) => (event: React.PointerEvent<HTMLImageElement>) => {
    const state = getState(id);
    event.currentTarget.setPointerCapture(event.pointerId);
    itemRefs.current[id]?.classList.add("lotus-item--held");
    state.held = true;
    state.grab = pointerAngle(id, event) - state.angle;
    state.target = state.angle;
    state.velocity = 0;
    run(id);
  };

  const onMove = (id: string) => (event: React.PointerEvent<HTMLImageElement>) => {
    const state = getState(id);
    if (!state.held) return;
    state.target = Math.max(-LOTUS_DRAG_LIMIT, Math.min(LOTUS_DRAG_LIMIT, pointerAngle(id, event) - state.grab));
  };

  const onUp = (id: string) => (event: React.PointerEvent<HTMLImageElement>) => {
    const state = getState(id);
    if (!state.held) return;
    state.held = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.angle = 0;
      state.velocity = 0;
    } else if (Math.abs(state.angle) < 2) {
      state.velocity = LOTUS_TAP_KICK;
    }
    run(id);
  };

  const bind = (id: string, pivotX = 0.5) => {
    pivotXs.current[id] = pivotX;
    return {
    item: { ref: (node: HTMLDivElement | null) => { itemRefs.current[id] = node; } },
    img: {
      ref: (node: HTMLImageElement | null) => { imgRefs.current[id] = node; },
      draggable: false,
      onPointerDown: onDown(id),
      onPointerMove: onMove(id),
      onPointerUp: onUp(id),
      onPointerCancel: onUp(id),
    },
    };
  };

  return bind;
}

function InvitationFlorals() {
  const bind = useLotusDrag("top");

  return (
    <div className="lotus-top" aria-hidden="true">
      {LOTUS_TOP.map(({ id, src, left, width, delay }) => {
        const { item, img } = bind(id);
        return (
          <div
            key={id}
            {...item}
            className="lotus-top__item lotus-item"
            style={{ "--l": left, "--w": width, "--delay": delay } as React.CSSProperties}
          >
            <img {...img} className="lotus-top__img lotus-img" src={src} alt="" />
          </div>
        );
      })}
    </div>
  );
}

const LOTUS_BOTTOM = [
  { id: "left", clip: "inset(0 59.2% 0 0)", origin: "18%", delay: "-1s" },
  { id: "center", clip: "inset(0 26% 0 40.8%)", origin: "64%", delay: "-2.8s" },
  { id: "right", clip: "inset(0 0 0 74%)", origin: "97%", delay: "-4.2s" },
] as const;

function InvitationLotusBottom() {
  const bind = useLotusDrag("bottom");

  return (
    <>
      {LOTUS_BOTTOM.map(({ id, clip, origin, delay }) => {
        const { item, img } = bind(`bottom-${id}`, parseFloat(origin) / 100);
        return (
          <div
            key={id}
            {...item}
            className="lotus-bottom lotus-item"
            style={{ "--clip": clip, "--ox": origin, "--delay": delay } as React.CSSProperties}
            aria-hidden="true"
          >
            <img {...img} className="lotus-bottom__img lotus-img" src={lotusBottom.url} alt="" />
          </div>
        );
      })}
    </>
  );
}

const PAINT_COLOR = "#F2EADC"; // the page background as rendered (sampled from the live page)
const PAINT_RUB_DELAY_MS = 300; // pause (paint fully visible) before the rubbing starts
const PAINT_RUB_MS = 1100; // how long the automatic rubbing takes to clear the page

type PaintDirection = "down" | "up" | "right" | "left";
const PAINT_DIRECTIONS: PaintDirection[] = ["down", "up", "right", "left"];
let paintBag: PaintDirection[] = [];
// Random rub direction per event page, drawn from a shuffled bag so neighbouring pages rarely repeat.
function takePaintDirection(): PaintDirection {
  if (paintBag.length === 0) paintBag = [...PAINT_DIRECTIONS].sort(() => Math.random() - 0.5);
  return paintBag.pop() as PaintDirection;
}

// Flat cover in exactly the page's background colour, so the paint is the same colour as every other page. The
// removed edge reads as paint thanks to the soft shadow on `.event-paint`, not a different tint.
function paintSurface(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
}

// A canvas of paint (the page's background colour) over the whole event page that is rubbed away automatically (a zig-zag
// swipe from top to bottom), revealing the page underneath.
function PaintCover({ color, rub, direction, onDone }: { color: string; rub: boolean; direction: PaintDirection; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    const ctx = canvas.getContext("2d");
    if (ctx) paintSurface(ctx, canvas.width, canvas.height, color);
  }, [color]);

  useEffect(() => {
    if (!rub) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      onDone();
      return;
    }
    const w = canvas.width;
    const h = canvas.height;
    // Sweep rows run across the page; the sweep advances along `length` (top→bottom, bottom→top, left→right or right→left).
    const vertical = direction === "down" || direction === "up";
    const reversed = direction === "up" || direction === "left";
    const length = vertical ? h : w;
    const across = vertical ? w : h;
    const brush = Math.max(length / 5, 120);
    const rows = Math.ceil(length / (brush * 0.75));
    let start: number | null = null;
    let prev: { x: number; y: number } | null = null;
    let raf = 0;
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "#000"; // opaque, so each swipe removes the paint completely (not just a fraction)
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush;
    const tick = (now: number) => {
      if (start === null) start = now + PAINT_RUB_DELAY_MS;
      const t = Math.min(Math.max((now - start) / PAINT_RUB_MS, 0), 1);
      if (t > 0) {
        const f = t * rows;
        const row = Math.min(rows - 1, Math.floor(f));
        const u = f - row;
        const along = -brush * 0.3 + (row % 2 === 0 ? u : 1 - u) * (across + brush * 0.6);
        let advance = ((row + 0.5) / rows) * length + Math.sin(u * Math.PI * 2 + row) * brush * 0.2;
        if (reversed) advance = length - advance;
        const x = vertical ? along : advance;
        const y = vertical ? advance : along;
        if (prev) {
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        prev = { x, y };
      }
      if (t < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        onDone();
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [rub, direction, onDone]);

  return <canvas ref={canvasRef} className="event-paint" aria-hidden="true" />;
}

// Each event page starts covered in its theme-coloured paint, which rubs away on its own when the page scrolls
// into view.
function EventCard({ item }: { item: EventItem }) {
  const cardRef = useRef<HTMLElement>(null);
  // "static" = no paint (SSR / no JS / reduced motion), "armed" = painted and waiting, "shown" = rubbing, "done" = clear
  const [phase, setPhase] = useState<"static" | "armed" | "shown" | "done">("static");
  const [timeNum, ...timeRestArr] = item.time.split(" ");
  const timeRest = timeRestArr.join(" ");
  const art = item.image.split("/").pop()?.replace(/\.\w+$/, "");
  const [direction, setDirection] = useState<PaintDirection>("down");
  const finish = useCallback(() => setPhase("done"), []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;
    setDirection(takePaintDirection());
    setPhase("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setPhase("shown");
      },
      { threshold: 0.35 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={cardRef} className="event-card foil-frame w-full mx-0">
      <div className={`event-img-wrap${item.image.endsWith(".webp") ? " event-img-wrap--art" : ""}`}>
        <img src={item.image} alt={item.alt} data-art={art} loading="lazy" width={896} height={1024} />
      </div>
      <div className="event-text relative px-6 text-center md:px-8">
        <h3 className="event-title font-script text-4xl font-normal text-primary md:text-5xl">{item.title}</h3>
        <div className="mx-auto mt-3 mb-4 h-px w-16 bg-gold-soft/60" />
        <p className="event-time text-[#A8862F]"><span className="event-time__num">{timeNum}</span> {timeRest}</p>
        <p className="mt-3 font-invitation text-2xl text-foreground md:text-3xl">
          {item.date[0]} <span className="mx-2 text-gold">|</span> {item.date[1]} <span className="mx-2 text-gold">|</span> {item.date[2]}
        </p>
        <p className="mt-3 font-script text-3xl text-[#A8862F]">{item.day}</p>
        {item.note && <p className="mt-3 text-sm uppercase tracking-[0.16em] text-muted-foreground">{item.note}</p>}
      </div>
      {(phase === "armed" || phase === "shown") && <PaintCover color={PAINT_COLOR} rub={phase === "shown"} direction={direction} onDone={finish} />}
    </article>
  );
}

const FOOTER_LINES = [
  "With hearts full of joy, we invite you to join us in celebrating love, laughter, and the start of a beautiful new chapter.",
  "Your presence and blessings will make this celebration truly memorable.",
];
const FOOTER_REVEAL_THRESHOLD = 0.3; // fraction of the footer visible before the text rises in

function InvitationFooter() {
  const footerRef = useRef<HTMLElement>(null);
  // "static" = visible (SSR / no JS), "armed" = hidden and waiting, "shown" = revealed
  const [phase, setPhase] = useState<"static" | "armed" | "shown">("static");

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;
    setPhase("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { threshold: FOOTER_REVEAL_THRESHOLD },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="foil-frame checker-footer page-pin relative overflow-hidden px-5 text-center">
      <InvitationFlorals />
      <InvitationLotusBottom />
      <div className={`footer-note footer-note--${phase} relative z-[3]`}>
        {FOOTER_LINES.map((line, index) => (
          <p key={line} className="footer-note__line" style={{ "--i": index } as React.CSSProperties}>
            {line}
          </p>
        ))}
      </div>
    </footer>
  );
}

function InvitationHero() {
  const step = useContext(IntroStepContext);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (step === "final") {
      setTextVisible(true);
      return;
    }
    if (step !== "transition") return;
    const timeout = window.setTimeout(() => setTextVisible(true), TEXT_REVEAL_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [step]);

  // Text reveals in three beats, STAGE_GAP_S apart: Ganesh + family, Jatin (with "with"), then Priyal.
  const stage = (base: string, n: 0 | 1 | 2) => ({
    className: `${base} invitation-stage${textVisible ? " invitation-stage--in" : ""}`,
    style: { "--stage": n } as React.CSSProperties,
  });

  return (
    <header id="home" className="invitation-hero">
      <div className="invitation-grain" aria-hidden="true" />
      <div className="invitation-card">
        <div className="invitation-damask" aria-hidden="true" />
        <InvitationFlorals />
        <InvitationLotusBottom />
        <div className="invitation-copy">
          <div {...stage("invitation-logo-zone", 0)}>
            <img src={ganpatiLogo.url} alt="" aria-hidden="true" className="h-auto w-12" />
            <p className="invitation-blessing">|| Shri Ganeshay Namah ||</p>
          </div>
          <div className="invitation-text-area">
          <div {...stage("invitation-intro", 0)}><p className="invitation-family-title">Mulchandani Family</p><p>Awaits your presence for the wedding celebrations of their beloved son</p></div>
          <div {...stage("invitation-person", 1)}>
            <h1 className="invitation-name">Jatin</h1>
            <div className="invitation-family">
              <p>(Grand s/o Late Shri Hiranand<br />&amp; Smt. Ganeshidevi Mulchandani)</p>
              <p>S/o Mr. Shyam &amp; Mrs. Aarti Mulchandani</p>
            </div>
          </div>
          <div {...stage("invitation-ampersand", 1)}>with</div>
          <div {...stage("invitation-person", 2)}>
            <h2 className="invitation-name invitation-name--groom">Priyal</h2>
            <div className="invitation-family">
              <p>(Grand d/o Late Shri Shankerlalji<br />&amp; Smt. Sitadevi Bang)</p>
              <p>D/o of Mr. Dinesh &amp; Mrs. Meenakshi Bang</p>
            </div>
          </div>
          <div className="invitation-lotus-spacer" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}

function Index() {
  return (
    <InvitationExperience>
      <main className="overflow-hidden bg-background text-foreground">
      {/* PAGE: Invitation / Hero — pinned to --page-len (850px). Pending cosmetic tweaks (client notes):
          T1 bottom lotuses get clipped → make fully visible · T2 top lotuses: bring down + longer stem (preview first)
          · T3 move Ganesh symbol down so lowered lotuses don't cover it · T4 Jatin's family line in brackets like
          Priyal's · T5 Jatin block: '&' starts a new line, width matches Priyal · T6 reduce space above/below "with". */}
      <InvitationHero />

       {/* PAGE: Countdown — pinned to --page-len (850px), content centred. No other client cosmetic notes yet. */}
       <section id="event" className="foil-frame checker-section page-pin px-5 md:px-10"><div className="relative mx-auto max-w-5xl"><SectionHeading title="Counting the days..." />
        <Countdown />
         <div className="mt-10 overflow-hidden rounded-lg border border-blush bg-card/60"><div className="px-3 py-7 text-center"><p className="whitespace-nowrap font-invitation text-[1.2rem]">11<sup className="ordinal">th</sup> &amp; 12<sup className="ordinal">th</sup> December, 2026</p></div></div>
      </div></section>

       {/* PAGES: Events — one 850px page per event (photo fills leftover space, object-fit:contain), pages butt
           directly (gap-0). The "The Events" title band is intentionally excluded from the 850px rule. */}
       <section id="events" className="foil-frame events-section px-0">
         <div className="relative mx-auto w-full max-w-none">
           <div className="px-5"><SectionHeading title="The Events" tone="dark" /></div>
           <div className="grid gap-0">
             {eventDays.map((item) => <EventCard key={item.title} item={item} />)}
           </div>
        </div>
      </section>

        {/* PAGE: Venue — pinned to --page-len (850px), content centred. No other client cosmetic notes yet. */}
        <section id="venue" className="foil-frame page-pin relative bg-transparent px-5 text-foreground md:px-10"><div className="relative mx-auto max-w-6xl"><SectionHeading title="The Venue" tone="dark" />
         <div><p className="whitespace-nowrap text-center font-display text-[clamp(1.9rem,10.5cqw,3rem)] text-primary">Praveg Lake Resort</p><p className="mt-2 text-center font-display text-[1.563rem] font-bold tracking-[0.2em] text-foreground">Daman</p><div className="mt-6 flex justify-center"><Button asChild variant="outline" className="h-12 rounded-lg border-primary bg-primary px-7 uppercase tracking-[0.16em] text-primary-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground"><a href="https://share.google/wXPgCUtC4Ho5l4KOc" target="_blank" rel="noopener noreferrer"><MapPin /> Get Directions</a></Button></div><div className="mt-8 py-4"><strong className="block text-[1.05rem] uppercase tracking-[0.18em] text-primary">Getting There</strong><ul className="mt-3 list-disc space-y-2 pl-5 text-left text-base text-muted-foreground"><li>Approximately 6 km from Vapi Railway Station</li><li>127 km from Surat International Airport via NH&nbsp;48</li><li>164 km from Mumbai International Airport</li></ul><div className="mt-[2.0625rem]"><strong className="block text-[1.05rem] uppercase tracking-[0.18em] text-primary">Accommodation</strong><p className="mt-2 text-lg text-muted-foreground">Check-in: 11/12/2026, 1 PM<br />Check-out: 13/12/2026, 10 AM</p></div></div></div>
      </div></section>

        {/* PAGE: Footer — pinned to --page-len (850px); the note is centred, so it sits in a tall panel. */}
        <InvitationFooter />
      </main>
    </InvitationExperience>
  );
}
