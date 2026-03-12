/**
 * Deck — 14-Slide Fullscreen Pitch Deck (v3)
 *
 * Narrative: "Lovable helps create an app. StoaBase helps run an AI-native company."
 * SVG-first, minimal-text design. Navigate with ← → or swipe.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  School,
  Hospital,
  Check,
  Users,
  Shield,
  Brain,
  BarChart3,
  Layers,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Settings,
  Wrench,
  Building2,
  BookOpen,
  Lock,
  LineChart,
  Activity,
  Rocket,
  Link2,
  DollarSign,
  Smartphone,
  Database,
  Bot,
  LayoutDashboard,
  Monitor,
  CheckCircle,
  Eye,
  Unplug,
  Copy,
  ShieldOff,
  BrainCircuit,
  AlertTriangle,
  Clock,
  Mic,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Loader2,
  Headphones,
  FileText,
  UserCheck,
  Puzzle,
  Image,
  Cpu,
} from "lucide-react";
import s from "./Deck.module.css";
import { useDeckAudio, type DeckLang } from "./useDeckAudio";
import DeckWaveBackground from "./DeckWaveBackground";

const IMAGES = { logo: "./stoabase-logo.svg" };
const TOTAL_SLIDES = 14;

/* ── Prompt → Module highlight mapping ── */
const PROMPTS: { text: string; modules: string[] }[] = [
  {
    text: "Build an AI tutor platform with lesson plans, quizzes, and student analytics",
    modules: ["AI & LLM Services", "Knowledge Mgmt", "Unified Tracking", "User Management", "Advanced Features"],
  },
  {
    text: "Launch an employee onboarding portal with training docs, progress tracking and team roles",
    modules: ["User Management", "Document Parsing", "Knowledge Mgmt", "Unified Tracking", "Workflow Engine"],
  },
  {
    text: "Create a customer support copilot with knowledge search, ticket routing and voice",
    modules: ["AI & LLM Services", "Knowledge Mgmt", "Speech & VAD", "Workflow Engine", "Data Service"],
  },
  {
    text: "Ship a podcast studio with AI-generated episodes, show notes, and social sharing",
    modules: ["AI & LLM Services", "Speech & VAD", "Media Generation", "Social Feed", "Advanced Features"],
  },
  {
    text: "Deploy an internal research tool with document parsing, search and AI summaries",
    modules: ["Document Parsing", "Knowledge Mgmt", "AI & LLM Services", "Data Service", "Unified Tracking"],
  },
];

const MODULE_ITEMS: { Icon: React.ComponentType<any>; label: string; desc: string }[] = [
  { Icon: Activity, label: "Unified Tracking", desc: "Events, sessions, analytics" },
  { Icon: Brain, label: "AI & LLM Services", desc: "Routing, chat, agents, streaming, tools, memory" },
  { Icon: Database, label: "Data Service", desc: "KV storage, records" },
  { Icon: Settings, label: "Workflow Engine", desc: "Flow, MCP, tools orchestration" },
  { Icon: BookOpen, label: "Knowledge Mgmt", desc: "Sources, documents, search" },
  { Icon: FileText, label: "Document Parsing", desc: "PDF, URL, file processing" },
  { Icon: Headphones, label: "Speech & VAD", desc: "TTS, STT, voice detection" },
  { Icon: Monitor, label: "Game AI / 3D", desc: "Game creator, asset gen, 3D engine" },
  { Icon: Image, label: "Media Generation", desc: "Image, audio, video" },
  { Icon: UserCheck, label: "User Management", desc: "Profiles, roles, access" },
  { Icon: Globe, label: "Social Feed", desc: "Posts, comments, sharing" },
  { Icon: Puzzle, label: "Advanced Features", desc: "Podcasts, mind maps, quizzes" },
];

function PromptModuleDemo() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "highlight" | "pause">("typing");
  const [activeModules, setActiveModules] = useState<Set<string>>(new Set());

  const current = PROMPTS[promptIdx];
  const displayText = current.text.slice(0, charIdx);

  useEffect(() => {
    if (phase === "typing") {
      if (charIdx < current.text.length) {
        const speed = 28 + Math.random() * 22; // natural typing feel
        const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
        return () => clearTimeout(t);
      }
      // Done typing → trigger highlight
      setPhase("highlight");
      return;
    }

    if (phase === "highlight") {
      setActiveModules(new Set(current.modules));
      const t = setTimeout(() => setPhase("pause"), 2800);
      return () => clearTimeout(t);
    }

    if (phase === "pause") {
      const t = setTimeout(() => {
        setActiveModules(new Set());
        setCharIdx(0);
        setPromptIdx((i) => (i + 1) % PROMPTS.length);
        setPhase("typing");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [phase, charIdx, current]);

  return (
    <>
      {/* Prompt input box */}
      <div
        style={{
          marginTop: 16,
          position: "relative",
          width: "100%",
          maxWidth: 720,
        }}
      >
        <div
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 14,
            padding: "14px 20px",
            fontSize: "0.95rem",
            color: "#e2e8f0",
            minHeight: 48,
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span style={{ color: "#a78bfa", marginRight: 10, fontWeight: 700, fontSize: "1.1rem" }}>⚡</span>
          <span style={{ flex: 1, fontFamily: "inherit" }}>
            {displayText}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1.1em",
                background: phase === "typing" ? "#a78bfa" : "transparent",
                marginLeft: 1,
                verticalAlign: "text-bottom",
                animation: phase === "typing" ? "blink 0.8s steps(2) infinite" : "none",
              }}
            />
          </span>
          {/* Bottom glow when highlighting */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: phase === "highlight"
                ? "linear-gradient(90deg, transparent, #7c3aed, #a78bfa, #7c3aed, transparent)"
                : "transparent",
              borderRadius: "0 0 14px 14px",
              transition: "background 0.5s ease",
            }}
          />
        </div>
        {/* Small label */}
        <div
          style={{
            marginTop: 6,
            fontSize: "0.72rem",
            color: "#64748b",
            textAlign: "right",
            paddingRight: 4,
          }}
        >
          {promptIdx + 1} / {PROMPTS.length} — describe any app you need
        </div>
      </div>

      {/* Module grid with highlights */}
      <div className={s.grid4col} style={{ marginTop: 16, width: "100%", gap: 14 }}>
        {MODULE_ITEMS.map((item) => {
          const isActive = activeModules.has(item.label);
          return (
            <div
              key={item.label}
              style={{
                background: isActive ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.06)",
                border: `1px solid ${isActive ? "rgba(167,139,250,0.6)" : "rgba(124,58,237,0.15)"}`,
                borderRadius: 12,
                padding: "16px",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isActive ? "0 0 20px rgba(124,58,237,0.25), inset 0 0 12px rgba(124,58,237,0.08)" : "none",
                transform: isActive ? "scale(1.03)" : "scale(1)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: isActive ? "rgba(124,58,237,0.3)" : "rgba(124,58,237,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  transition: "background 0.5s ease",
                }}
              >
                <item.Icon
                  size={17}
                  style={{
                    color: isActive ? "#c4b5fd" : "#a78bfa",
                    transition: "color 0.5s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: isActive ? "#e2e8f0" : "#c4b5fd",
                  marginBottom: 4,
                  transition: "color 0.5s ease",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.5 }}>
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 20, color: "#a78bfa", fontWeight: 600, fontSize: "0.9rem" }}>
        This is not a future mockup. It is the product surface that emerged from powering real ventures.
      </p>
    </>
  );
}

function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);
  return (
    <div ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Deck() {
  const [current, setCurrent] = useState(0);
  const [activeOrg, setActiveOrg] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingSelf = useRef(false); // prevent observer feedback loop

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const goTo = useCallback((i: number) => {
    const idx = Math.max(0, Math.min(TOTAL_SLIDES - 1, i));
    setCurrent(idx);
    if (isMobile() && slideRefs.current[idx]) {
      isScrollingSelf.current = true;
      slideRefs.current[idx]!.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isScrollingSelf.current = false;
      }, 800);
    }
  }, []);

  const go = useCallback(
    (dir: number) =>
      setCurrent((c) => {
        const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, c + dir));
        if (isMobile() && slideRefs.current[next]) {
          isScrollingSelf.current = true;
          slideRefs.current[next]!.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isScrollingSelf.current = false;
          }, 800);
        }
        return next;
      }),
    [],
  );

  const [deckLang, setDeckLang] = useState<DeckLang>("en");
  const audio = useDeckAudio(goTo, deckLang);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  // Touch swipe (desktop-only — on mobile, scroll-snap handles navigation)
  useEffect(() => {
    if (isMobile()) return;
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5)
        go(diffX > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [go]);

  // IntersectionObserver: sync current slide indicator with scroll position on mobile
  useEffect(() => {
    if (!isMobile() || !wrapperRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingSelf.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = slideRefs.current.indexOf(
              entry.target as HTMLDivElement,
            );
            if (idx >= 0) setCurrent(idx);
          }
        }
      },
      { root: wrapperRef.current, threshold: 0.5 },
    );
    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const SLIDE_COLORS: [string, string, string][] = [
    ["#0f0c29", "#302b63", "#24243e"],
    ["#1a1a2e", "#16213e", "#0f3460"],
    ["#0d1117", "#161b22", "#21262d"],
    ["#2d1b69", "#11001c", "#1e0836"],
    ["#0c1021", "#1b2838", "#0d1b2a"],
  ];

  const [c1, c2, c3] = SLIDE_COLORS[current % 5];

  return (
    <div
      className={s.deckWrapper}
      ref={wrapperRef}
      style={{ "--bg-c1": c1, "--bg-c2": c2, "--bg-c3": c3 } as React.CSSProperties}
    >
      <DeckWaveBackground
        isSpeaking={audio.isPlaying}
        speaker={audio.currentSegment?.speaker ?? "denny"}
      />
      <div
        className={s.slidesTrack}
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {/* ── S1: Cover ─────────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          className={s.slide}
        >
          <div
            className={s.bgOrb}
            style={{
              width: 500,
              height: 500,
              background: "#7c3aed",
              top: -120,
              right: -120,
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(100px)",
              opacity: 0.12,
            }}
          />
          <div
            className={s.slideContent}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <img src={IMAGES.logo} alt="StoaBase" style={{ height: 48 }} />
            <h1 className={s.slideTitle}>
              The <span className={s.slideTitleAccent}>Runtime</span>
              <br />
              for AI-Native Businesses
            </h1>
            <p
              style={{
                color: "#a78bfa",
                fontWeight: 600,
                fontSize: "1.4rem",
                lineHeight: 1.7,
              }}
            >
              One workspace. Many apps. Shared context and skills.
            </p>
            <p
              className={s.slideSubtitle}
              style={{ fontSize: "1rem", maxWidth: 660 }}
            >
              Every customer gets a private AI workspace where every app shares
              <br />
              users, permissions, knowledge, memory, and analytics.
            </p>
          </div>
        </div>

        {/* ── S2: The Insight We Earned ───────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[1] = el;
          }}
          className={s.slide}
        >
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>THE INSIGHT WE EARNED</div>
              <h2 className={s.sectionTitle}>
                From co-building real AI-focused ventures
              </h2>
              <p className={s.sectionDesc}>
                We co-built <strong style={{ color: "#60a5fa" }}>R{"'"}ODYSSEY</strong> and{" "}
                <strong style={{ color: "#34d399" }}>iOMICS</strong> with business founders in the past year, and both are already getting traction.
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 12 }}>
                The realization: any business launching with AI will need the same foundational requirements.
              </p>
              <p style={{ marginTop: 18, padding: "14px 18px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, color: "#a78bfa", fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.6 }}>
                Two ventures. Two industries. <strong style={{ color: "#e2e8f0" }}>One repeated stack.</strong>
              </p>
            </div>
            <div className={s.splitVisual}>
              <svg viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
                <rect width="360" height="300" rx="14" fill="#0f172a" opacity="0.4" />
                {/* R'ODYSSEY */}
                <rect x="20" y="20" width="150" height="80" rx="12" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="95" y="42" textAnchor="middle" fontSize="10" fontWeight="700" fill="#60a5fa">R{"'"}ODYSSEY</text>
                <text x="95" y="58" textAnchor="middle" fontSize="8" fill="#94a3b8">AI Education</text>
                <text x="95" y="72" textAnchor="middle" fontSize="8" fill="#94a3b8">10 schools · 1,000+ students</text>
                <text x="95" y="88" textAnchor="middle" fontSize="8" fill="#34d399" fontWeight="600">🟢 LIVE</text>
                {/* iOMICS */}
                <rect x="190" y="20" width="150" height="80" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <text x="265" y="42" textAnchor="middle" fontSize="10" fontWeight="700" fill="#34d399">iOMICS</text>
                <text x="265" y="58" textAnchor="middle" fontSize="8" fill="#94a3b8">AI Medical</text>
                <text x="265" y="72" textAnchor="middle" fontSize="8" fill="#94a3b8">8,000+ patient records</text>
                <text x="265" y="88" textAnchor="middle" fontSize="8" fill="#34d399" fontWeight="600">🟢 LIVE</text>
                {/* Arrow down */}
                <line x1="180" y1="105" x2="180" y2="130" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="180" y="125" textAnchor="middle" fontSize="14" fill="#7c3aed">↓</text>
                {/* Shared stack */}
                <rect x="30" y="140" width="300" height="140" rx="14" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
                <text x="180" y="165" textAnchor="middle" fontSize="12" fontWeight="700" fill="#c4b5fd">Shared Repeated Stack</text>
                {["Tracking & Telemetry", "AI Services & LLM", "Data & Access Control", "Knowledge & Documents", "Speech & Multimodal", "Admin & Management"].map((item, i) => (
                  <text key={item} x={i % 2 === 0 ? 90 : 270} y={190 + Math.floor(i / 2) * 22} textAnchor="middle" fontSize="8" fill="#94a3b8">{item}</text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* ── S3: Problem ───────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[2] = el;
          }}
          className={s.slide}
        >
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>THE PROBLEM</div>
              <h2 className={s.sectionTitle}>
                AI demos are easy. AI businesses are still hard.
              </h2>
              <p className={s.sectionDesc}>
                Small teams can now prototype quickly. But turning that into a real business still means stitching together:
              </p>
              <div className={s.featureList} style={{ marginTop: 8 }}>
                {[
                  { Icon: Shield, l: "Auth and roles" },
                  { Icon: Database, l: "Token and modal monitoring" },
                  { Icon: Brain, l: "AI workflows" },
                  { Icon: BookOpen, l: "Knowledge for AI" },
                  { Icon: BarChart3, l: "Analytics and tracking" },
                  { Icon: Headphones, l: "Voice / media / multimodal" },
                  { Icon: Layers, l: "Reusable UI and admin tools" },
                ].map((r) => (
                  <div key={r.l} className={s.featureItem}>
                    <span className={s.featureIcon}><r.Icon size={16} /></span>
                    <span>{r.l}</span>
                  </div>
                ))}
              </div>
              <p className={s.sectionDesc} style={{ marginTop: 12, fontSize: "0.85rem" }}>
                Today businesses patch this together with many point tools.
              </p>
              <p style={{ marginTop: 8, color: "#a78bfa", fontWeight: 600, fontSize: "0.85rem" }}>
                That works for a prototype. It breaks when they want to launch a complete, growing business.
              </p>
            </div>
            <div className={s.splitVisual}>
              <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
                <rect width="360" height="280" rx="14" fill="#0f172a" opacity="0.4" />
                <text x="180" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#e2e8f0">From Prototype to Business</text>
                {/* Prototype side */}
                <rect x="20" y="40" width="140" height="100" rx="12" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
                <text x="90" y="60" textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="600">PROTOTYPE</text>
                <text x="90" y="78" textAnchor="middle" fontSize="8" fill="#94a3b8">Quick to build</text>
                <text x="90" y="92" textAnchor="middle" fontSize="8" fill="#94a3b8">Single developer</text>
                <text x="90" y="106" textAnchor="middle" fontSize="8" fill="#94a3b8">Looks impressive</text>
                <text x="90" y="128" textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="600">✓ Easy</text>
                {/* Arrow */}
                <text x="180" y="95" textAnchor="middle" fontSize="18" fill="#64748b">→</text>
                {/* Business side */}
                <rect x="200" y="40" width="140" height="100" rx="12" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                <text x="270" y="60" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="600">REAL BUSINESS</text>
                <text x="270" y="78" textAnchor="middle" fontSize="8" fill="#94a3b8">Auth, roles, data</text>
                <text x="270" y="92" textAnchor="middle" fontSize="8" fill="#94a3b8">AI ops, knowledge</text>
                <text x="270" y="106" textAnchor="middle" fontSize="8" fill="#94a3b8">Analytics, admin</text>
                <text x="270" y="128" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="600">✗ Still hard</text>
                {/* Bottom */}
                <rect x="40" y="165" width="280" height="90" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="180" y="188" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="600">WHAT FOUNDERS DO TODAY</text>
                <text x="180" y="208" textAnchor="middle" fontSize="8" fill="#94a3b8">Supabase + Clerk + Langfuse + Retool</text>
                <text x="180" y="222" textAnchor="middle" fontSize="8" fill="#94a3b8">+ custom orchestration + voice APIs + ...</text>
                <text x="180" y="242" textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="600">Fragile. Slow. Non-compounding.</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S4: Solution ──────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[3] = el;
          }}
          className={s.slide}
        >
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>THE SOLUTION</div>
              <h2 className={s.sectionTitle}>
                One workspace. Many apps.{" "}
                <span className={s.slideTitleAccent}>
                  Shared company context
                </span>{" "}
                from day one.
              </h2>
              <p className={s.sectionDesc}>StoaBase gives every customer:</p>
              <div className={s.featureList} style={{ marginTop: 8 }}>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <Layers size={16} />
                  </span>
                  <span>
                    <strong>One shared foundation</strong> for users, teams,
                    roles, and permissions
                  </span>
                </div>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <Brain size={16} />
                  </span>
                  <span>
                    <strong>One AI layer</strong> for knowledge, memory, tools,
                    and workflows
                  </span>
                </div>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <Zap size={16} />
                  </span>
                  <span>
                    <strong>Many apps — internal and external</strong> — that
                    inherit company context on day one
                  </span>
                </div>
              </div>
              <p className={s.sectionDesc} style={{ marginTop: 16 }}>
                StoaBase is not just app generation.
                <br />
                <strong style={{ color: "#a78bfa" }}>
                  It is the operating system for an AI-native organization.
                </strong>
              </p>
            </div>
            <div className={s.splitVisual}>
              <svg
                viewBox="0 0 400 235"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%" }}
              >
                <rect
                  width="400"
                  height="235"
                  rx="14"
                  fill="#0f172a"
                  opacity="0.3"
                />
                {/* ── WITHOUT ── */}
                <text
                  x="100"
                  y="22"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#ef4444"
                  letterSpacing="1.5"
                >
                  WITHOUT STOABASE
                </text>
                {/* 4 siloed app boxes */}
                {[
                  { x: 15, l: "App 1" },
                  { x: 60, l: "App 2" },
                  { x: 105, l: "App 3" },
                  { x: 150, l: "App 4" },
                ].map((a) => (
                  <g key={a.l}>
                    <rect
                      x={a.x}
                      y={32}
                      width="40"
                      height="95"
                      rx="6"
                      fill="#0f172a"
                      stroke="#ef4444"
                      strokeWidth="0.8"
                      opacity="0.7"
                    />
                    <text
                      x={a.x + 20}
                      y={50}
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="600"
                      fill="#f87171"
                    >
                      {a.l}
                    </text>
                    {["Auth", "Roles", "KB", "AI"].map((item, i) => (
                      <text
                        key={item}
                        x={a.x + 20}
                        y={65 + i * 14}
                        textAnchor="middle"
                        fontSize="6"
                        fill="#64748b"
                      >
                        {item}
                      </text>
                    ))}
                  </g>
                ))}
                <text
                  x="100"
                  y="145"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#64748b"
                >
                  Each app rebuilds everything
                </text>
                {/* ── WITH ── */}
                <text
                  x="300"
                  y="22"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#10b981"
                  letterSpacing="1.5"
                >
                  WITH STOABASE
                </text>
                {/* 4 connected app boxes */}
                {[
                  { x: 215, l: "App 1" },
                  { x: 260, l: "App 2" },
                  { x: 305, l: "App 3" },
                  { x: 350, l: "App 4" },
                ].map((a) => (
                  <g key={a.l}>
                    <rect
                      x={a.x}
                      y={32}
                      width="40"
                      height="36"
                      rx="6"
                      fill="#0f172a"
                      stroke="#60a5fa"
                      strokeWidth="1"
                    />
                    <text
                      x={a.x + 20}
                      y={54}
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="600"
                      fill="#60a5fa"
                    >
                      {a.l}
                    </text>
                  </g>
                ))}
                {/* Dashed lines connecting to shared base */}
                {[235, 280, 325, 370].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="68"
                    x2={x}
                    y2="82"
                    stroke="#60a5fa"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    opacity="0.4"
                  />
                ))}
                {/* Shared base */}
                <rect
                  x="210"
                  y="85"
                  width="180"
                  height="55"
                  rx="10"
                  fill="#1e1b4b"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                />
                <text
                  x="300"
                  y="108"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#c4b5fd"
                >
                  Shared AI + Company Base
                </text>
                <text
                  x="300"
                  y="125"
                  textAnchor="middle"
                  fontSize="7"
                  fill="#94a3b8"
                >
                  Users · Knowledge · Memory · Skills · Analytics
                </text>
                <text
                  x="300"
                  y="155"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#64748b"
                >
                  Apps share one foundation
                </text>
                {/* Divider */}
                <line
                  x1="200"
                  y1="15"
                  x2="200"
                  y2="160"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Bottom comparison summary */}
                <rect
                  x="15"
                  y="175"
                  width="370"
                  height="50"
                  rx="10"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <text
                  x="100"
                  y="198"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#f87171"
                  fontWeight="600"
                >
                  Months to launch each app
                </text>
                <text
                  x="100"
                  y="214"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#64748b"
                >
                  Duplicated infra every time
                </text>
                <line
                  x1="200"
                  y1="180"
                  x2="200"
                  y2="220"
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text
                  x="300"
                  y="198"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#34d399"
                  fontWeight="600"
                >
                  Days to launch next app
                </text>
                <text
                  x="300"
                  y="214"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#64748b"
                >
                  Everything already connected
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S5: Product (HIDDEN — kept for reference) ─────────── */}
        <div
          className={s.slide}
          style={{ display: "none" }}
        >
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>PRODUCT</div>
              <h2 className={s.sectionTitle}>
                StoaBase is the runtime layer beneath AI-native businesses
              </h2>
              <p className={s.sectionDesc}>
                Business owners launch apps through a visual builder. Every app shares the same users, knowledge, and AI skills — no re-integration needed.
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 12, color: "#c4b5fd", fontWeight: 600 }}>
                🎨 Vibe Coding Interface
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 4 }}>
                A visual builder where business owners create and manage apps — no engineering team required.
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 12, color: "#94a3b8", fontWeight: 600 }}>StoaBase Runtime — fully managed:</p>
              <div className={s.featureList} style={{ marginTop: 4 }}>
                {[
                  { Icon: Brain, l: "AI Services & LLM", color: "#7c3aed" },
                  { Icon: Database, l: "Data & Knowledge", color: "#06b6d4" },
                  { Icon: Users, l: "Identity & Access", color: "#10b981" },
                  { Icon: BarChart3, l: "Telemetry & Admin", color: "#f97316" },
                ].map((r) => (
                  <div key={r.l} className={s.featureItem}>
                    <span className={s.featureIcon} style={{ background: `${r.color}18` }}><r.Icon size={16} color={r.color} /></span>
                    <span style={{ color: r.color, fontWeight: 600 }}>{r.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.splitVisual}>
              <svg viewBox="0 0 380 370" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
                <rect width="380" height="370" rx="14" fill="#0f172a" opacity="0.4" />
                {/* Apps on top */}
                {["Product A", "Agent B", "Workflow C", "Portal D"].map((app, i) => {
                  const x = 20 + i * 90;
                  return (
                    <g key={app}>
                      <rect x={x} y={16} width="80" height="34" rx="8" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.2" />
                      <text x={x + 40} y={37} textAnchor="middle" fontSize="9" fontWeight="600" fill="#60a5fa">{app}</text>
                    </g>
                  );
                })}
                {/* Dashed lines from apps to vibe coding */}
                {[60, 150, 240, 330].map((x) => (
                  <line key={x} x1={x} y1="50" x2={x} y2="62" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" opacity="0.3" />
                ))}
                {/* Vibe Coding Interface layer */}
                <rect x="15" y="66" width="350" height="36" rx="10" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 3" />
                <text x="190" y="82" textAnchor="middle" fontSize="10" fontWeight="700" fill="#c4b5fd">🎨 Vibe Coding Interface</text>
                <text x="190" y="95" textAnchor="middle" fontSize="7" fill="#94a3b8">Visual builder · Create & manage apps</text>
                {/* Dashed lines from vibe coding to runtime */}
                {[100, 190, 280].map((x) => (
                  <line key={x} x1={x} y1="102" x2={x} y2="118" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 2" opacity="0.25" />
                ))}
                {/* StoaBase Runtime grouped container */}
                <rect x="8" y="122" width="364" height="220" rx="14" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="8 4" opacity="0.4" />
                <text x="190" y="140" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7c3aed" letterSpacing="2" opacity="0.7">STOABASE RUNTIME — FULLY MANAGED</text>
                {/* Runtime layers */}
                {[
                  { y: 150, h: 38, label: "AI Services & LLM", sub: "Chat · Agents · Tools · Orchestration", color: "#7c3aed" },
                  { y: 196, h: 38, label: "Data & Knowledge", sub: "Storage · Documents · Memory · Search", color: "#06b6d4" },
                  { y: 242, h: 38, label: "Identity & Access", sub: "Users · Teams · Roles · Permissions", color: "#10b981" },
                  { y: 288, h: 38, label: "Telemetry & Admin", sub: "Tracking · Analytics · Monitoring · Deploy", color: "#f97316" },
                ].map((layer) => (
                  <g key={layer.label}>
                    <rect x="20" y={layer.y} width="340" height={layer.h} rx="10" fill="#0f172a" stroke={layer.color} strokeWidth="1.5" />
                    <text x="190" y={layer.y + 16} textAnchor="middle" fontSize="10" fontWeight="700" fill={layer.color}>{layer.label}</text>
                    <text x="190" y={layer.y + 30} textAnchor="middle" fontSize="7" fill="#94a3b8">{layer.sub}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* ── S6: What Already Exists ──────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[4] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>WHAT ALREADY EXISTS</div>
            <h2 className={s.sectionTitle} style={{ maxWidth: 680 }}>
              Empowering anyone to launch a business with{" "}
              <span className={s.slideTitleAccent}>10% of the effort</span>
            </h2>

            {/* ── Animated prompt input ── */}
            <PromptModuleDemo />

          </div>
        </div>

        {/* ── S7: Why Now ───────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[5] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>WHY NOW</div>
            <h2 className={s.sectionTitle} style={{ maxWidth: 680 }}>
              The bottleneck has moved
            </h2>
            <p className={s.sectionDesc} style={{ marginBottom: 8 }}>
              Three reasons this matters now:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, width: "100%", marginTop: 8 }}>
              {[
                { n: "1", Icon: Zap, t: "App generation is getting cheaper", d: "Building a prototype is no longer the hard part." },
                { n: "2", Icon: Building2, t: "AI-native companies are more AI-demanding", d: "They build, operate, and scale based on AI as their core foundation, not as an add-on." },
                { n: "3", Icon: Cpu, t: "The missing control point is the runtime layer", d: "The winner will not just help people build AI screens. It will help them operate AI-native businesses." },
              ].map((s2) => (
                <div key={s2.t} className={s.statCard} style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <s2.Icon size={18} style={{ color: "#a78bfa" }} />
                    </div>
                    <div style={{ fontWeight: 700, color: "#c4b5fd", fontSize: "0.95rem", lineHeight: 1.4 }}>{s2.t}</div>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.65 }}>{s2.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S7b: Proof of Concept ─ ReaLM ────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[6] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>PROOF OF CONCEPT</div>
            <h2 className={s.sectionTitle}>
              We didn’t just theorize it. We vibed it into existence.
            </h2>
            <p className={s.sectionDesc} style={{ maxWidth: 700 }}>
              <strong style={{ color: "#a78bfa" }}>ReaLM</strong> — a
              NotebookLM-class product, built in weeks on the StoaBase SDK.
              <br />
              One developer. Full AI workspace. Every feature powered by the
              shared platform layer.
            </p>
            <div
              className={s.grid4col}
              style={{
                gap: 12,
                marginTop: 24,
                width: "100%",
              }}
            >
              {[
                {
                  Icon: Brain,
                  label: "AI Explainer",
                  desc: "Multi-step topic generation with web grounding",
                },
                {
                  Icon: BookOpen,
                  label: "Knowledge Base",
                  desc: "URL crawl, file upload, shared source library",
                },
                {
                  Icon: Monitor,
                  label: "Rich Editor",
                  desc: "Rich block editor with AI inline editing",
                },
                {
                  Icon: Activity,
                  label: "Quiz & Flashcards",
                  desc: "Auto-generated assessments from any topic",
                },
                {
                  Icon: Target,
                  label: "Mind Maps",
                  desc: "Visual knowledge graphs from AI content",
                },
                {
                  Icon: Smartphone,
                  label: "AI Podcast",
                  desc: "Two-voice audio generated from topic context",
                },
                {
                  Icon: Users,
                  label: "Co-Edit & Share",
                  desc: "Real-time collaboration with version history",
                },
                {
                  Icon: Globe,
                  label: "Social Feed",
                  desc: "Publish, discover, and remix community topics",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(124,58,237,0.06)",
                    border: "1px solid rgba(124,58,237,0.15)",
                    borderRadius: 12,
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "rgba(124,58,237,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <item.Icon size={16} style={{ color: "#a78bfa" }} />
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      color: "#c4b5fd",
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "#64748b",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 20,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 8,
                  padding: "8px 14px",
                }}
              >
                <CheckCircle size={14} style={{ color: "#34d399" }} />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#34d399",
                    fontWeight: 600,
                  }}
                >
                  Live in production
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 8,
                  padding: "8px 14px",
                }}
              >
                <Zap size={14} style={{ color: "#34d399" }} />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#34d399",
                    fontWeight: 600,
                  }}
                >
                  10M+ tokens processed
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 8,
                  padding: "8px 14px",
                }}
              >
                <Rocket size={14} style={{ color: "#34d399" }} />
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#34d399",
                    fontWeight: 600,
                  }}
                >
                  Built by one developer on StoaBase SDK
                </span>
              </div>
            </div>
            <p
              style={{
                marginTop: 16,
                color: "#a78bfa",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              If one person can ship this in weeks, imagine what a team can
              build on StoaBase.
            </p>
          </div>
        </div>

        {/* ── S8: Go-To-Market ──────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[7] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>GO-TO-MARKET</div>
            <h2 className={s.sectionTitle}>
              Land with one mission-critical app. Expand through the workspace.
            </h2>
            <svg
              viewBox="0 0 700 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", margin: "24px 0" }}
            >
              {[
                {
                  x: 0,
                  t: "Identify",
                  d: "Start with one core app\nflow that solves a painful,\nhigh-value workflow.",
                },
                {
                  x: 180,
                  t: "Launch",
                  d: "Get the first app live\nfast — enough to prove\nspeed, utility, and\ninternal pull.",
                },
                {
                  x: 360,
                  t: "Connect",
                  d: "Bind users, permissions,\nknowledge, and analytics\ninto a shared workspace.",
                },
                {
                  x: 540,
                  t: "Expand",
                  d: "Remix that foundation\ninto adjacent apps across\nteams, workflows, and\nstakeholders.",
                },
              ].map((step, i) => (
                <g key={step.t}>
                  <rect
                    x={step.x}
                    y={10}
                    width="140"
                    height="140"
                    rx="14"
                    fill="#0f172a"
                    stroke="#7c3aed"
                    strokeWidth={i === 3 ? "2" : "1"}
                  />
                  <text
                    x={step.x + 70}
                    y={40}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    fontWeight="600"
                  >
                    STEP {i + 1}
                  </text>
                  <text
                    x={step.x + 70}
                    y={62}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="#c4b5fd"
                  >
                    {step.t}
                  </text>
                  {step.d.split("\n").map((line, j) => (
                    <text
                      key={j}
                      x={step.x + 70}
                      y={85 + j * 14}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#94a3b8"
                    >
                      {line}
                    </text>
                  ))}
                  {i < 3 && (
                    <text x={step.x + 158} y={100} fontSize="16" fill="#7c3aed">
                      →
                    </text>
                  )}
                </g>
              ))}
            </svg>
            <p
              style={{
                marginTop: 20,
                color: "#94a3b8",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              We start with companies that:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
                marginTop: 10,
                width: "100%",
              }}
            >
              {[
                "Need AI-native software quickly",
                "Are already experimenting with AI internally",
                "Cannot afford to rebuild infrastructure repeatedly",
                "Benefit from shared context across multiple apps",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(124,58,237,0.08)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <Zap size={14} style={{ color: "#a78bfa", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "#c4b5fd" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <p
              style={{
                marginTop: 20,
                color: "#a78bfa",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              This is not one-and-done SaaS. It is an expansion platform inside
              every account.
            </p>
          </div>
        </div>

        {/* ── S9: Business Model ────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[8] = el;
          }}
          className={s.slide}
        >
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>BUSINESS MODEL</div>
              <h2 className={s.sectionTitle}>
                Revenue expands as customers standardize more workflows on
                StoaBase
              </h2>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 20,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        color: "#64748b",
                        fontSize: "0.7rem",
                        letterSpacing: 2,
                        fontWeight: 600,
                      }}
                    >
                      STREAM
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        color: "#64748b",
                        fontSize: "0.7rem",
                        letterSpacing: 2,
                        fontWeight: 600,
                      }}
                    >
                      DESCRIPTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      stream: "Platform fee",
                      desc: "Annual workspace subscription",
                    },
                    {
                      stream: "Implementation",
                      desc: "Setup, deployment, integrations",
                    },
                    {
                      stream: "Usage-based AI",
                      desc: "AI activity and automation volume",
                    },
                    {
                      stream: "Expansion",
                      desc: "More apps, teams, and modules",
                    },
                  ].map((r) => (
                    <tr
                      key={r.stream}
                      style={{ borderBottom: "1px solid #1e293b" }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#e2e8f0",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {r.stream}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#94a3b8",
                          fontSize: "0.85rem",
                        }}
                      >
                        {r.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={s.splitVisual}>
              <svg
                viewBox="0 0 360 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%" }}
              >
                <rect
                  width="360"
                  height="280"
                  rx="14"
                  fill="#0f172a"
                  opacity="0.4"
                />
                <text
                  x="20"
                  y="24"
                  fontSize="11"
                  fontWeight="700"
                  fill="#e2e8f0"
                >
                  Growth with Customers
                </text>
                <text x="20" y="38" fontSize="7" fill="#64748b">
                  Platform + Implementation + Usage + Expansion
                </text>
                {/* Legend */}
                <circle cx="220" cy="23" r="3" fill="#7c3aed" />
                <text x="226" y="26" fontSize="6" fill="#94a3b8">
                  Platform
                </text>
                <circle cx="280" cy="23" r="3" fill="#06b6d4" />
                <text x="286" y="26" fontSize="6" fill="#94a3b8">
                  Implementation
                </text>
                <circle cx="220" cy="35" r="3" fill="#10b981" />
                <text x="226" y="38" fontSize="6" fill="#94a3b8">
                  Usage
                </text>
                <circle cx="280" cy="35" r="3" fill="#f59e0b" />
                <text x="286" y="38" fontSize="6" fill="#94a3b8">
                  Expansion
                </text>
                {/* Stacked bars - Year 1 */}
                <rect
                  x="50"
                  y="175"
                  width="55"
                  height="30"
                  rx="4"
                  fill="#7c3aed"
                />
                <rect
                  x="50"
                  y="155"
                  width="55"
                  height="20"
                  rx="4"
                  fill="#06b6d4"
                />
                <rect
                  x="50"
                  y="143"
                  width="55"
                  height="12"
                  rx="4"
                  fill="#10b981"
                />
                {/* Stacked bars - Year 2 */}
                <rect
                  x="150"
                  y="145"
                  width="55"
                  height="60"
                  rx="4"
                  fill="#7c3aed"
                />
                <rect
                  x="150"
                  y="115"
                  width="55"
                  height="30"
                  rx="4"
                  fill="#06b6d4"
                />
                <rect
                  x="150"
                  y="95"
                  width="55"
                  height="20"
                  rx="4"
                  fill="#10b981"
                />
                <rect
                  x="150"
                  y="82"
                  width="55"
                  height="13"
                  rx="4"
                  fill="#f59e0b"
                />
                {/* Stacked bars - Year 3 */}
                <rect
                  x="250"
                  y="115"
                  width="55"
                  height="90"
                  rx="4"
                  fill="#7c3aed"
                />
                <rect
                  x="250"
                  y="80"
                  width="55"
                  height="35"
                  rx="4"
                  fill="#06b6d4"
                />
                <rect
                  x="250"
                  y="55"
                  width="55"
                  height="25"
                  rx="4"
                  fill="#10b981"
                />
                <rect
                  x="250"
                  y="42"
                  width="55"
                  height="13"
                  rx="4"
                  fill="#f59e0b"
                />
                {/* Trend line */}
                <path
                  d="M77,143 Q150,100 277,42"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {/* X-axis labels */}
                <text
                  x="77"
                  y="225"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  Year 1
                </text>
                <text
                  x="177"
                  y="225"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  Year 2
                </text>
                <text
                  x="277"
                  y="225"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  Year 3
                </text>
                <text
                  x="180"
                  y="260"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#64748b"
                >
                  Architecture drives net revenue expansion.
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S10: Competition ──────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[9] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>COMPETITION</div>
            <h2 className={s.sectionTitle} style={{ marginBottom: 8 }}>
              Others help create software.{" "}
              <span style={{ color: "#a78bfa" }}>
                StoaBase helps you run an AI-native business.
              </span>
            </h2>
            <div style={{ overflowX: "auto", marginTop: 20 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.85rem",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        color: "#94a3b8",
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        color: "#94a3b8",
                      }}
                    >
                      Strength
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        color: "#94a3b8",
                      }}
                    >
                      Where they stop
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      cat: "App builders",
                      g: "Fast app creation",
                      s: "No shared company runtime",
                    },
                    {
                      cat: "Internal tool builders",
                      g: "Workflows and dashboards",
                      s: "Not a multi-app AI operating system",
                    },
                    {
                      cat: "Custom dev / agencies",
                      g: "Can build anything",
                      s: "Expensive, slow, non-compounding",
                    },
                    {
                      cat: "Cloud / model vendors",
                      g: "Infrastructure primitives",
                      s: "No company-level operating context",
                    },
                  ].map((r) => (
                    <tr
                      key={r.cat}
                      style={{ borderBottom: "1px solid #1e293b" }}
                    >
                      <td style={{ padding: "10px 12px", color: "#94a3b8" }}>
                        {r.cat}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#64748b" }}>
                        {r.g}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#f59e0b" }}>
                        {r.s}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "rgba(124,58,237,0.12)" }}>
                    <td
                      style={{
                        padding: "10px 12px",
                        color: "#a78bfa",
                        fontWeight: 700,
                      }}
                    >
                      StoaBase
                    </td>
                    <td style={{ padding: "10px 12px", color: "#c4b5fd" }}>
                      Shared AI workspace for many apps
                    </td>
                    <td style={{ padding: "10px 12px", color: "#a78bfa" }}>
                      Built for expansion, governance, and reuse
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: 20, color: "#94a3b8", fontSize: "0.9rem" }}>
              App builders help you launch one AI app.{" "}
              <strong style={{ color: "#a78bfa" }}>
                StoaBase helps you run many on one governed workspace.
              </strong>
            </p>
          </div>
        </div>

        {/* ── S11: Moat ─────────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[10] = el;
          }}
          className={s.slide}
        >
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>MOAT</div>
              <h2 className={s.sectionTitle}>
                The first app wins the project. The tenth app wins the account.
              </h2>
              <div className={s.featureList} style={{ marginTop: 16 }}>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <Database size={16} />
                  </span>
                  <span>
                    <strong>Compounding data</strong> — every app enriches the
                    shared knowledge graph; more apps = smarter AI
                  </span>
                </div>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <Lock size={16} />
                  </span>
                  <span>
                    <strong>Rising switching costs</strong> — org-wide
                    permissions, workflows, and memory become hard to replicate
                  </span>
                </div>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <TrendingUp size={16} />
                  </span>
                  <span>
                    <strong>Cross-app network effects</strong> — insights from
                    app 1 improve app 5 automatically
                  </span>
                </div>
                <div className={s.featureItem}>
                  <span className={s.featureIcon}>
                    <Target size={16} />
                  </span>
                  <span>
                    <strong>Vertical flywheel</strong> — deployment templates
                    and best practices compound with each customer
                  </span>
                </div>
              </div>
              <p
                className={s.sectionDesc}
                style={{
                  marginTop: 16,
                  fontSize: "0.85rem",
                  color: "#a78bfa",
                  fontWeight: 600,
                }}
              >
                The moat is not app generation. The moat is the shared graph
                customers grow into.
              </p>
            </div>
            <div className={s.splitVisual}>
              <svg
                viewBox="0 0 320 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%" }}
              >
                <rect
                  width="320"
                  height="320"
                  rx="14"
                  fill="#0f172a"
                  opacity="0.4"
                />
                {/* Flywheel rings */}
                <circle
                  cx="160"
                  cy="160"
                  r="110"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                  opacity="0.2"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="75"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1"
                  opacity="0.15"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="35"
                  fill="#1e1b4b"
                  stroke="#7c3aed"
                  strokeWidth="2"
                />
                <image
                  href="./stoabase-logo.svg"
                  x="137"
                  y="137"
                  width="48"
                  height="48"
                ></image>
                {/* Nodes on ring */}
                {[
                  { angle: -90, label: "More Apps" },
                  { angle: 0, label: "More Data" },
                  { angle: 90, label: "More Lock-in" },
                  { angle: 180, label: "More Value" },
                ].map((n) => {
                  const rad = (n.angle * Math.PI) / 180;
                  const x = 160 + Math.cos(rad) * 110;
                  const y = 160 + Math.sin(rad) * 110;
                  return (
                    <g key={n.label}>
                      <circle
                        cx={x}
                        cy={y - 4}
                        r="12"
                        fill="#1e1b4b"
                        stroke="#7c3aed"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x}
                        y={y + 16}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="600"
                        fill="#a78bfa"
                      >
                        {n.label}
                      </text>
                    </g>
                  );
                })}
                {/* Animated dot */}
                <circle r="4" fill="#a78bfa" opacity="0.8">
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    path="M160,50 A110,110 0 1,1 159.9,50"
                  />
                </circle>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S12: Traction ─────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[11] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>TRACTION</div>
            <h2 className={s.sectionTitle}>
              Built in production, not in theory
            </h2>
            <div
              className={s.grid2col}
              style={{
                marginTop: 24,
                width: "100%",
              }}
            >
              {/* R'ODYSSEY */}
              <div
                style={{
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: 14,
                  padding: "20px 24px",
                }}
              >
                <p
                  style={{
                    color: "#60a5fa",
                    fontSize: "0.7rem",
                    letterSpacing: 2,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  R’ODYSSEY · AI EDUCATION
                </p>
                <div className={s.grid2col} style={{ gap: 14 }}>
                  {[
                    { end: 10, suffix: "", label: "Paid Schools" },
                    { end: 1000, suffix: "+", label: "Active Students" },
                    { end: 15, suffix: "+", label: "Apps Launched" },
                    { end: 150, suffix: "M+", label: "Tokens Processed" },
                  ].map(({ end, suffix, label }) => (
                    <div
                      key={label}
                      className={s.statCard}
                      style={{
                        background: "rgba(59,130,246,0.06)",
                        border: "1px solid rgba(59,130,246,0.12)",
                      }}
                    >
                      <div className={s.statValue} style={{ color: "#60a5fa" }}>
                        <CountUp end={end} suffix={suffix || ""} />
                      </div>
                      <div className={s.statLabel}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* iOMICS */}
              <div
                style={{
                  background: "rgba(16,185,129,0.06)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 14,
                  padding: "20px 24px",
                }}
              >
                <p
                  style={{
                    color: "#34d399",
                    fontSize: "0.7rem",
                    letterSpacing: 2,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  iOMICS · AI MEDICAL
                </p>
                <div className={s.grid2col} style={{ gap: 14 }}>
                  {[
                    { end: 8000, suffix: "+", label: "Patient Records" },
                    { end: 2, suffix: "", label: "AI Apps Launched" },
                    { end: 63, suffix: "M+", label: "Tokens Processed" },
                    { end: 3, suffix: "", label: "Bio Scientists" },
                  ].map(({ end, suffix, label }) => (
                    <div
                      key={label}
                      className={s.statCard}
                      style={{
                        background: "rgba(16,185,129,0.06)",
                        border: "1px solid rgba(16,185,129,0.12)",
                      }}
                    >
                      <div className={s.statValue} style={{ color: "#34d399" }}>
                        <CountUp end={end} suffix={suffix || ""} />
                      </div>
                      <div className={s.statLabel}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p style={{ marginTop: 24, color: "#94a3b8", fontSize: "0.9rem" }}>
              Customers are not asking for a faster way to build one app.
              <br />
              <strong style={{ color: "#a78bfa" }}>
                They are asking for a way to keep building without starting
                over.
              </strong>
            </p>
          </div>
        </div>

        {/* ── S13: Team ─────────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[12] = el;
          }}
          className={s.slide}
        >
          <div className={s.slideContent}>
            <div className={s.slideTag}>TEAM</div>
            <h2 className={s.sectionTitle}>
              Built by founders who shipped AI businesses.
            </h2>
            <p
              className={s.sectionDesc}
              style={{ maxWidth: 600, margin: "0 0 6px" }}
            >
              Previously at{" "}
              <strong style={{ color: "#e2e8f0" }}>hello-air.com</strong>{" "}
              <span style={{ color: "#64748b" }}>(US$8M ARR)</span>
              {" "}— built the AI workflow engine, then evolved it into the full runtime system.
            </p>
            <p
              className={s.sectionDesc}
              style={{ maxWidth: 540, margin: "0 0 16px", fontSize: "0.85rem" }}
            >
              <strong style={{ color: "#a78bfa" }}>
                Building an AI app is getting easier.
                Building an AI-native business is not.
              </strong>
            </p>
            <div
              className={s.teamGrid}
              style={{ maxWidth: 540, margin: "8px 0 0" }}
            >
              {[
                {
                  name: "Denny",
                  role: "Founder",
                  img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6971947d3c6dea9c838bd285_denny_profile.jpeg",
                  zoom: 1.3,
                  highlight: true,
                },
                {
                  name: "Bruce",
                  role: "CTO",
                  img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6972ffccea906fc7f9e791d1_bruce_profile.jpg",
                  zoom: 1.1,
                  highlight: false,
                },
                {
                  name: "Hebitz",
                  role: "Product Lead",
                  img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6972ffac6d275ef99508bf4e_hebe_profile.jpeg",
                  zoom: 1.9,
                  highlight: false,
                },
              ].map((m) => (
                <div
                  key={m.name}
                  className={s.teamCard}
                  style={m.highlight ? {
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid #7c3aed",
                  } : undefined}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      overflow: "hidden",
                      margin: "0 auto",
                    }}
                  >
                    <img
                      src={m.img}
                      alt={m.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        transform: `scale(${m.zoom})`,
                        transformOrigin: "center top",
                      }}
                    />
                  </div>
                  <div className={s.teamName} style={m.highlight ? { color: "#c4b5fd" } : undefined}>
                    {m.name}
                  </div>
                  <div className={s.teamRole} style={m.highlight ? { color: "#a78bfa" } : undefined}>
                    {m.role}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                textAlign: "left",
                marginTop: 12,
                color: "#64748b",
                fontSize: "0.85rem",
              }}
            >
              Hong Kong 🇭🇰 · Canada 🇨🇦 · UK 🇬🇧
            </p>
          </div>
        </div>

        {/* ── S14: Closing ──────────────────────────────────────── */}
        <div
          ref={(el) => {
            slideRefs.current[13] = el;
          }}
          className={s.slide}
        >
          <div
            className={s.bgOrb}
            style={{
              width: 600,
              height: 600,
              background: "#6366f1",
              bottom: -200,
              left: "50%",
              marginLeft: -300,
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(120px)",
              opacity: 0.1,
            }}
          />
          <div className={s.ctaBlock}>
            <img src={IMAGES.logo} alt="StoaBase" style={{ height: 44 }} />
            <p
              style={{
                color: "#94a3b8",
                fontWeight: 600,
                fontSize: "1.2rem",
                lineHeight: 1.8,
                marginTop: 20,
              }}
            >
              The next generation of companies will not just use AI.
              <br />
              <strong style={{ fontSize: "1.4rem", color: "#c4b5fd" }}>
                They will run on it.
              </strong>
            </p>
            <p style={{ color: "#a78bfa", fontSize: "1rem", marginTop: 12 }}>
              StoaBase is the operating system that makes that possible.
            </p>
            <div className={s.ctaButtons} style={{ marginTop: 32 }}>
              <a
                href="https://stoabase.ai/contact"
                target="_blank"
                rel="noreferrer"
                className={`${s.ctaBtn} ${s.ctaBtnPrimary}`}
              >
                Get in Touch
              </a>
              <a
                href="https://app.stoabase.ai"
                target="_blank"
                rel="noreferrer"
                className={`${s.ctaBtn} ${s.ctaBtnSecondary}`}
              >
                Try the Platform →
              </a>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 16 }}>
              hello@stoabase.ai
              <br />
              stoabase.ai
            </p>
          </div>
        </div>
      </div>

      {/* ── Mic Toggle ────────────────────────────────────────────── */}
      <button
        className={`${s.micToggle} ${audio.isActive ? s.micToggleActive : ""}`}
        onClick={() => {
          if (audio.isActive) {
            audio.close();
          } else {
            audio.setActive(true);
            audio.play();
          }
        }}
        aria-label={audio.isActive ? "Stop podcast" : "Start podcast"}
      >
        <Mic size={20} />
      </button>

      {/* ── Audio Bar ─────────────────────────────────────────────── */}
      {audio.isActive &&
        audio.currentSegment &&
        (() => {
          const _lk =
            deckLang === "zh-CN"
              ? "zhCN"
              : deckLang === "zh-TW"
                ? "zhTW"
                : "en";
          const _txt = audio.currentSegment[
            _lk as keyof typeof audio.currentSegment
          ] as { display: string; speech: string };
          return (
            <div className={s.audioBar}>
              <div
                className={`${s.audioSpeaker} ${audio.currentSegment.speaker === "denny" ? s.audioSpeakerDenny : s.audioSpeakerKen}`}
              >
                {audio.currentSegment.speaker === "denny" ? "DW" : "KH"}
              </div>
              <div className={s.audioDisplay}>
                <div
                  className={`${s.audioDisplayInner} ${audio.isPlaying ? s.audioHighlight : ""}`}
                  key={`${audio.currentIdx}-${deckLang}`}
                  style={{ "--highlight-pct": `${audio.highlightPct}%` } as React.CSSProperties}
                >
                  <span
                    style={{
                      color:
                        audio.currentSegment.speaker === "denny"
                          ? "#c4b5fd"
                          : "#93c5fd",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      marginRight: 6,
                    }}
                  >
                    {audio.currentSegment.speaker === "denny" ? "Denny" : "Ken"}
                  </span>
                  {_txt.display}
                </div>
              </div>
              <div className={s.audioControls}>
                <button
                  className={s.audioCtrlBtn}
                  onClick={audio.prev}
                  disabled={audio.currentIdx === 0}
                  aria-label="Previous"
                >
                  <SkipBack size={14} />
                </button>
                <button
                  className={`${s.audioCtrlBtn} ${s.audioPlayBtn}`}
                  onClick={audio.toggle}
                  aria-label={audio.isPlaying ? "Pause" : "Play"}
                >
                  {audio.isLoading ? (
                    <Loader2 size={16} className={s.audioLoading} />
                  ) : audio.isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </button>
                <button
                  className={s.audioCtrlBtn}
                  onClick={audio.next}
                  disabled={audio.currentIdx >= audio.totalSegments - 1}
                  aria-label="Next"
                >
                  <SkipForward size={14} />
                </button>
              </div>
              <div className={s.audioLangBtns}>
                {(["en", "zh-CN", "zh-TW"] as DeckLang[]).map((l) => (
                  <button
                    key={l}
                    className={`${s.audioLangBtn} ${deckLang === l ? s.audioLangActive : ""}`}
                    onClick={() => setDeckLang(l)}
                  >
                    {l === "en" ? "EN" : l === "zh-CN" ? "简" : "繁"}
                  </button>
                ))}
              </div>
              <span className={s.audioProgress}>
                {audio.currentIdx + 1}/{audio.totalSegments}
              </span>
              <button
                className={s.audioCloseBtn}
                onClick={audio.close}
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          );
        })()}

      {/* ── Nav Bar ──────────────────────────────────────────────── */}
      <div className={s.navBar}>
        <button
          className={s.navBtn}
          onClick={() => go(-1)}
          disabled={current === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <div className={s.navDots}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              className={`${s.navDot} ${i === current ? s.navDotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className={s.slideNumber}>
          {current + 1} / {TOTAL_SLIDES}
        </span>
        <button
          className={s.navBtn}
          onClick={() => go(1)}
          disabled={current === TOTAL_SLIDES - 1}
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
