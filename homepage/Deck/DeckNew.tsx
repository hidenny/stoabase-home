/**
 * DeckNew — 14-Slide Fullscreen Pitch Deck (v5)
 *
 * Narrative: "StoaBase is the runtime for AI-native businesses."
 * SVG-first, minimal-text design. Navigate with ← → or swipe.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
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
  Mic,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Loader2,
  Headphones,
  FileText,
  MessageSquare,
  Image,
  UserCheck,
  Puzzle,
  ArrowRight,
  Server,
  Cpu,
  Box,
} from "lucide-react";
import s from "./Deck.module.css";
import { useDeckAudio, type DeckLang } from "./useDeckAudio";
import DeckWaveBackground from "./DeckWaveBackground";

const IMAGES = { logo: "/stoabase-logo.svg" };
const TOTAL_SLIDES = 13;

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

export default function DeckNew() {
  const [current, setCurrent] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingSelf = useRef(false);

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const goTo = useCallback((i: number) => {
    const idx = Math.max(0, Math.min(TOTAL_SLIDES - 1, i));
    setCurrent(idx);
    if (isMobile() && slideRefs.current[idx]) {
      isScrollingSelf.current = true;
      slideRefs.current[idx]!.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => { isScrollingSelf.current = false; }, 800);
    }
  }, []);

  const go = useCallback(
    (dir: number) =>
      setCurrent((c) => {
        const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, c + dir));
        if (isMobile() && slideRefs.current[next]) {
          isScrollingSelf.current = true;
          slideRefs.current[next]!.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => { isScrollingSelf.current = false; }, 800);
        }
        return next;
      }),
    [],
  );

  const [deckLang, setDeckLang] = useState<DeckLang>("en");
  const audio = useDeckAudio(goTo, deckLang);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(-1); }
      if (e.key === "Escape") window.history.back();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  useEffect(() => {
    if (isMobile()) return;
    let startX = 0; let startY = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) go(diffX > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [go]);

  useEffect(() => {
    if (!isMobile() || !wrapperRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingSelf.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx >= 0) setCurrent(idx);
          }
        }
      },
      { root: wrapperRef.current, threshold: 0.5 },
    );
    slideRefs.current.forEach((el) => { if (el) observer.observe(el); });
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
    <div className={s.deckWrapper} ref={wrapperRef} style={{ "--bg-c1": c1, "--bg-c2": c2, "--bg-c3": c3 } as React.CSSProperties}>
      <DeckWaveBackground isSpeaking={audio.isPlaying} speaker={audio.currentSegment?.speaker ?? "denny"} />
      <div className={s.slidesTrack} style={{ transform: `translateX(-${current * 100}vw)` }}>

        {/* ── S1: Cover ─────────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[0] = el; }} className={s.slide}>
          <div className={s.bgOrb} style={{ width: 500, height: 500, background: "#7c3aed", top: -120, right: -120, position: "absolute", borderRadius: "50%", filter: "blur(100px)", opacity: 0.12 }} />
          <div className={s.slideContent} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <img src={IMAGES.logo} alt="StoaBase" style={{ height: 52 }} />
            <h1 className={s.slideTitle}>
              The <span className={s.slideTitleAccent}>Runtime</span>
              <br />for AI-Native Businesses
            </h1>
            <p style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.35rem", lineHeight: 1.7, maxWidth: 700 }}>
              One workspace. Many apps. Shared context and skills.
            </p>
            <p className={s.slideSubtitle} style={{ fontSize: "1.05rem", maxWidth: 660 }}>
              Every customer gets a private AI workspace where every app shares users, permissions, knowledge, memory, and analytics.
            </p>
          </div>
        </div>


        {/* ── S3: The Problem ───────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[1] = el; }} className={s.slide}>
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

        {/* ── S4: The Insight ───────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[2] = el; }} className={s.slide}>
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>THE INSIGHT WE EARNED</div>
              <h2 className={s.sectionTitle}>
                We learned this by co-building real AI-focused ventures
              </h2>
              <p className={s.sectionDesc}>
                We co-built <strong style={{ color: "#60a5fa" }}>R{"'"}ODYSSEY</strong> and{" "}
                <strong style={{ color: "#34d399" }}>iOMICS</strong> in the past year, and both are already getting traction.
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 8 }}>
                Different use cases. Different customers.<br />
                <strong style={{ color: "#e2e8f0" }}>But both needed the same foundational layer.</strong>
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 12 }}>Both ventures shared:</p>
              <div className={s.grid3col} style={{ marginTop: 10, width: "100%", gap: 8 }}>
                {["Tracking", "AI services", "Data layers", "Knowledge workflows", "Speech & interaction", "Management tooling", "Reusable interfaces"].map((item) => (
                  <div key={item} style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem", color: "#c4b5fd", fontWeight: 600 }}>
                    {item}
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 18, padding: "14px 18px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, color: "#a78bfa", fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.6 }}>
                That is when we realized: this common layer could be the foundation for any AI-native business.
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

        {/* ── S5: The Product ──────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[3] = el; }} className={s.slide}>
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>THE PRODUCT</div>
              <h2 className={s.sectionTitle}>
                StoaBase is the runtime layer beneath AI-native businesses
              </h2>
              <p className={s.sectionDesc}>
                Business owners launch apps through a visual builder. Every app shares the same users, knowledge, and AI skills — no re-integration needed.
              </p>
              <p className={s.sectionDesc} style={{ marginTop: 12, color: "#94a3b8", fontWeight: 600 }}>Core layers:</p>
              <div className={s.featureList} style={{ marginTop: 4 }}>
                {[
                  { Icon: Activity, l: "Tracking & telemetry" },
                  { Icon: Brain, l: "AI services & LLM interaction" },
                  { Icon: Database, l: "Data service & access" },
                  { Icon: BookOpen, l: "Knowledge and document workflows" },
                  { Icon: Headphones, l: "Speech / voice / multimodal" },
                  { Icon: Box, l: "Assets and entity management" },
                  { Icon: Layers, l: "Reusable interfaces and business primitives" },
                ].map((r) => (
                  <div key={r.l} className={s.featureItem}>
                    <span className={s.featureIcon}><r.Icon size={16} /></span>
                    <span>{r.l}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16, color: "#a78bfa", fontWeight: 600, fontSize: "0.85rem" }}>
                Instead of assembling the entire stack from scratch, founders build on a system that already exists.
              </p>
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
                <text x="190" y="355" textAnchor="middle" fontSize="9" fontWeight="600" fill="#a78bfa">StoaBase Runtime</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S6: What Already Exists ──────────────────────────── */}
        <div ref={(el) => { slideRefs.current[4] = el; }} className={s.slide}>
          <div className={s.slideContent}>
            <div className={s.slideTag}>WHAT ALREADY EXISTS</div>
            <h2 className={s.sectionTitle} style={{ maxWidth: 680 }}>
              Empowering anyone to launch a business with{" "}
              <span className={s.slideTitleAccent}>10% of the effort</span>
            </h2>
            <p className={s.sectionDesc} style={{ marginTop: 8 }}>
              From our current demo environment, the platform already includes modules for:
            </p>
            <div className={s.grid4col} style={{ marginTop: 24, width: "100%", gap: 14 }}>
              {[
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
              ].map((item) => (
                <div key={item.label} style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12, padding: "16px" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <item.Icon size={17} style={{ color: "#a78bfa" }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#c4b5fd", marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 24, color: "#a78bfa", fontWeight: 600, fontSize: "0.9rem" }}>
              This is not a future mockup. It is the product surface that emerged from powering real ventures.
            </p>
          </div>
        </div>

        {/* ── S7: Why Not Point Tools ──────────────────────────── */}
        <div ref={(el) => { slideRefs.current[5] = el; }} className={s.slide}>
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>COMPARISON</div>
              <h2 className={s.sectionTitle}>
                Point tools give you parts. We give you a working system.
              </h2>
              <p className={s.sectionDesc} style={{ marginTop: 8 }}>A startup can try to assemble:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {["Supabase", "Clerk", "Langfuse", "Retool", "Custom orchestration", "Voice APIs", "Analytics tools"].map((t) => (
                  <span key={t} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "6px 12px", fontSize: "0.8rem", color: "#fca5a5" }}>{t}</span>
                ))}
              </div>
              <p className={s.sectionDesc} style={{ marginTop: 14 }}>But then they must solve:</p>
              <div className={s.featureList} style={{ marginTop: 6 }}>
                {["Integration complexity", "Inconsistent schemas", "Permissions across systems", "Workflow orchestration", "Observability", "Multimodal plumbing", "Maintenance across apps"].map((item) => (
                  <div key={item} className={s.featureItem}>
                    <span className={s.featureIcon} style={{ background: "rgba(239,68,68,0.12)" }}><X size={14} color="#f87171" /></span>
                    <span style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.splitVisual}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", letterSpacing: 2, fontWeight: 600 }}>STOABASE ADVANTAGE</div>
                {[
                  { Icon: Zap, l: "Faster time to launch" },
                  { Icon: Layers, l: "Integrated architecture" },
                  { Icon: Brain, l: "Reusable AI skills" },
                  { Icon: LayoutDashboard, l: "Reusable interface patterns" },
                  { Icon: TrendingUp, l: "One evolving foundation for future apps" },
                ].map((r) => (
                  <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 10, padding: "14px 18px" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <r.Icon size={17} style={{ color: "#34d399" }} />
                    </div>
                    <span style={{ color: "#34d399", fontWeight: 600, fontSize: "0.9rem" }}>{r.l}</span>
                  </div>
                ))}
                <p style={{ marginTop: 12, color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.6 }}>
                  The value is not that teams cannot build it.<br />
                  <strong style={{ color: "#a78bfa" }}>The value is that they should not have to rebuild the same operating layer every time.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── S8: The Wedge ────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[6] = el; }} className={s.slide}>
          <div className={s.slideContent}>
            <div className={s.slideTag}>THE WEDGE</div>
            <h2 className={s.sectionTitle} style={{ maxWidth: 680 }}>
              We help small teams launch complete AI-native businesses much faster
            </h2>
            <p className={s.sectionDesc} style={{ maxWidth: 700, marginTop: 12 }}>
              With StoaBase, a small team — even a solo builder — can launch products that would normally require building a large amount of infrastructure first.
            </p>
            <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 16, padding: "28px 30px", marginTop: 24, maxWidth: 700, width: "100%" }}>
              <p style={{ color: "#c4b5fd", fontWeight: 700, fontSize: "1.05rem", marginBottom: 10 }}>Proof point:</p>
              <p style={{ color: "#e2e8f0", fontSize: "1rem", lineHeight: 1.75 }}>
                A single developer can build a <strong style={{ color: "#a78bfa" }}>NotebookLM-grade startup</strong> in about a month because the core runtime already exists.
              </p>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "14px 22px" }}>
                <X size={18} style={{ color: "#f87171" }} />
                <span style={{ color: "#fca5a5", fontSize: "0.9rem" }}>Not &ldquo;build another chatbot&rdquo;</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12, padding: "14px 22px" }}>
                <CheckCircle size={18} style={{ color: "#34d399" }} />
                <span style={{ color: "#34d399", fontSize: "0.9rem", fontWeight: 600 }}>Launch a complete AI-native product stack fast</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── S9: Business Model ──────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[7] = el; }} className={s.slide}>
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>BUSINESS MODEL</div>
              <h2 className={s.sectionTitle}>
                Software business with high-touch onboarding at the edge
              </h2>
              <p className={s.sectionDesc} style={{ marginTop: 8, fontWeight: 600, color: "#94a3b8" }}>Core model:</p>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                <tbody>
                  {[
                    { stream: "Platform subscription", desc: "Annual workspace access" },
                    { stream: "Usage-based pricing", desc: "AI activity, model usage, automation volume" },
                    { stream: "Premium modules", desc: "Enterprise controls, advanced features" },
                    { stream: "Expansion", desc: "More products, teams, and workflow coverage" },
                  ].map((r) => (
                    <tr key={r.stream} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "10px 12px", color: "#e2e8f0", fontWeight: 700, fontSize: "0.85rem" }}>{r.stream}</td>
                      <td style={{ padding: "10px 12px", color: "#94a3b8", fontSize: "0.85rem" }}>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={s.sectionDesc} style={{ marginTop: 14, fontWeight: 600, color: "#94a3b8" }}>Optional early support:</p>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {["Onboarding", "Integration help", "Design-partner support"].map((t) => (
                  <span key={t} style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 8, padding: "8px 14px", fontSize: "0.85rem", color: "#c4b5fd" }}>{t}</span>
                ))}
              </div>
              <p style={{ marginTop: 16, color: "#a78bfa", fontWeight: 600, fontSize: "0.85rem" }}>
                The core business is framed as repeatable software revenue, not custom implementation revenue.
              </p>
            </div>
            <div className={s.splitVisual}>
              <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
                <rect width="360" height="280" rx="14" fill="#0f172a" opacity="0.4" />
                <text x="180" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#e2e8f0">Revenue Growth</text>
                <text x="180" y="38" textAnchor="middle" fontSize="7" fill="#64748b">Platform + Usage + Premium + Expansion</text>
                {/* Stacked bars */}
                {[
                  { x: 50, y1: 175, h1: 30, y2: 155, h2: 20, y3: 143, h3: 12, label: "Year 1" },
                  { x: 150, y1: 145, h1: 60, y2: 115, h2: 30, y3: 95, h3: 20, y4: 82, h4: 13, label: "Year 2" },
                  { x: 250, y1: 115, h1: 90, y2: 80, h2: 35, y3: 55, h3: 25, y4: 42, h4: 13, label: "Year 3" },
                ].map((bar) => (
                  <g key={bar.label}>
                    <rect x={bar.x} y={bar.y1} width="55" height={bar.h1} rx="4" fill="#7c3aed" />
                    <rect x={bar.x} y={bar.y2} width="55" height={bar.h2} rx="4" fill="#06b6d4" />
                    <rect x={bar.x} y={bar.y3} width="55" height={bar.h3} rx="4" fill="#10b981" />
                    {bar.y4 && <rect x={bar.x} y={bar.y4} width="55" height={bar.h4} rx="4" fill="#f59e0b" />}
                    <text x={bar.x + 27} y="225" textAnchor="middle" fontSize="9" fill="#94a3b8">{bar.label}</text>
                  </g>
                ))}
                <text x="180" y="260" textAnchor="middle" fontSize="8" fill="#a78bfa" fontWeight="600">Repeatable software revenue</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S10: Go-To-Market ────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[8] = el; }} className={s.slide}>
          <div className={s.slideContent}>
            <div className={s.slideTag}>GO-TO-MARKET</div>
            <h2 className={s.sectionTitle}>
              Start with AI-native founders and venture builders
            </h2>
            <p className={s.sectionDesc} style={{ marginTop: 8, fontWeight: 600, color: "#94a3b8" }}>Best initial customers:</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: 10, width: "100%" }}>
              {["AI-native startups", "Venture studios", "Teams launching 2nd and 3rd AI products", "Operators building internal + external workflows"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 10, padding: "12px 16px" }}>
                  <Zap size={15} style={{ color: "#60a5fa", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.88rem", color: "#93c5fd" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, width: "100%" }}>
              <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 14, padding: "22px" }}>
                <p style={{ color: "#a78bfa", fontSize: "0.72rem", letterSpacing: 2, fontWeight: 600, marginBottom: 12 }}>ENTRY MOTION</p>
                <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: 10 }}>Land with one urgent use case:</p>
                {["Knowledge product", "Workflow app", "AI copilot", "Multimodal assistant", "Internal ops tool"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <ArrowRight size={10} style={{ color: "#a78bfa" }} />
                    <span style={{ fontSize: "0.85rem", color: "#c4b5fd" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "22px" }}>
                <p style={{ color: "#34d399", fontSize: "0.72rem", letterSpacing: 2, fontWeight: 600, marginBottom: 12 }}>EXPANSION MOTION</p>
                <p style={{ color: "#94a3b8", fontSize: "0.88rem", marginBottom: 10 }}>Then expand into:</p>
                {["More apps", "More teams", "More workflows", "More interfaces", "Deeper runtime dependence"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <TrendingUp size={10} style={{ color: "#34d399" }} />
                    <span style={{ fontSize: "0.85rem", color: "#6ee7b7" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S11: Why Now ─────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[9] = el; }} className={s.slide}>
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
                { n: "2", Icon: Building2, t: "AI-native startups are becoming multi-system companies fast", d: "They need more than one app from day one." },
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

        {/* ── S12: Why We Win ─────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[10] = el; }} className={s.slide}>
          <div className={s.splitLayout}>
            <div className={s.splitText}>
              <div className={s.slideTag}>WHY WE WIN</div>
              <h2 className={s.sectionTitle}>
                Our moat compounds through use
              </h2>
              <p className={s.sectionDesc} style={{ marginTop: 8 }}>
                Every venture and every customer hardens the platform through:
              </p>
              <div className={s.featureList} style={{ marginTop: 8 }}>
                {[
                  { Icon: Wrench, l: "Better SDK abstractions" },
                  { Icon: Brain, l: "Reusable AI skills" },
                  { Icon: Settings, l: "Reusable workflows" },
                  { Icon: LayoutDashboard, l: "Reusable interface patterns" },
                  { Icon: Activity, l: "Cross-product telemetry" },
                  { Icon: Rocket, l: "Faster launches for the next business" },
                ].map((r) => (
                  <div key={r.l} className={s.featureItem}>
                    <span className={s.featureIcon}><r.Icon size={16} /></span>
                    <span>{r.l}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 16, color: "#a78bfa", fontWeight: 600, fontSize: "0.85rem" }}>
                The moat is not app generation. The moat is the runtime that gets stronger with every deployment.
              </p>
            </div>
            <div className={s.splitVisual}>
              <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%" }}>
                <rect width="320" height="320" rx="14" fill="#0f172a" opacity="0.4" />
                {/* Flywheel rings */}
                <circle cx="160" cy="160" r="110" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.2" />
                <circle cx="160" cy="160" r="75" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.15" />
                <circle cx="160" cy="160" r="35" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
                <image href="/stoabase-logo.svg" x="137" y="137" width="48" height="48"></image>
                {[
                  { angle: -90, label: "Co-build" },
                  { angle: 0, label: "Learn patterns" },
                  { angle: 90, label: "Productize SDK" },
                  { angle: 180, label: "Faster launch" },
                ].map((n) => {
                  const rad = (n.angle * Math.PI) / 180;
                  const x = 160 + Math.cos(rad) * 110;
                  const y = 160 + Math.sin(rad) * 110;
                  return (
                    <g key={n.label}>
                      <circle cx={x} cy={y - 4} r="12" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />
                      <text x={x} y={y + 16} textAnchor="middle" fontSize="9" fontWeight="600" fill="#a78bfa">{n.label}</text>
                    </g>
                  );
                })}
                <circle r="4" fill="#a78bfa" opacity="0.8">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M160,50 A110,110 0 1,1 159.9,50" />
                </circle>
              </svg>
            </div>
          </div>
        </div>

        {/* ── S13: Team ───────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[11] = el; }} className={s.slide}>
          <div className={s.slideContent}>
            <div className={s.slideTag}>TEAM</div>
            <h2 className={s.sectionTitle}>
              We found the category by operating inside it
            </h2>
            <p className={s.sectionDesc} style={{ maxWidth: 640, margin: "0 0 8px" }}>
              We did not start with a whiteboard theory. We discovered this by building and operating AI-native ventures in production.
            </p>
            <p className={s.sectionDesc} style={{ maxWidth: 640, margin: "0 0 16px", color: "#a78bfa", fontWeight: 600 }}>
              That gives us: practical pain insight, product taste, speed, a real starting platform, and a stronger point of view than a pure infra team.
            </p>
            <div className={s.teamGrid} style={{ maxWidth: 360, margin: "8px 0 0" }}>
              {[
                { name: "Denny Wong", role: "Co-Founder", img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6971947d3c6dea9c838bd285_denny_profile.jpeg", zoom: 1.3 },
                { name: "Ken Hui", role: "Co-Founder", img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6972ff0bdcfb1768f414e7bd_ken_profile.jpg", zoom: 1.2 },
              ].map((m) => (
                <div key={m.name} className={s.teamCard} style={{ background: "rgba(124,58,237,0.15)", border: "1px solid #7c3aed" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", margin: "0 auto" }}>
                    <img src={m.img} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transform: `scale(${m.zoom})`, transformOrigin: "center top" }} />
                  </div>
                  <div className={s.teamName} style={{ color: "#c4b5fd" }}>{m.name}</div>
                  <div className={s.teamRole} style={{ color: "#a78bfa" }}>{m.role}</div>
                </div>
              ))}
            </div>
            <div className={s.teamGrid} style={{ marginTop: 8 }}>
              {[
                { name: "Bruce Shi", role: "CTO", img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6972ffccea906fc7f9e791d1_bruce_profile.jpg", zoom: 1.1 },
                { name: "Hebitz Lau", role: "AI Director", img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6972ffac6d275ef99508bf4e_hebe_profile.jpeg", zoom: 1.9 },
                { name: "Tony Chau", role: "Mobile Lead", img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/6973009e12e8b0bc5a43edd2_68cd0676f6bead8f565f700b_01995c0b-9c0c-7881-8bf4-fd45188bdabd-2.png", zoom: 2 },
                { name: "Bowie", role: "Business", img: "https://cdn.prod.website-files.com/696aeaaf8c07b3c89ecdc7b9/697300e4ed62a06b70895dad_adult%20001.png", zoom: 1.5 },
              ].map((m) => (
                <div key={m.name} className={s.teamCard}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", margin: "0 auto" }}>
                    <img src={m.img} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transform: `scale(${m.zoom})`, transformOrigin: "center top" }} />
                  </div>
                  <div className={s.teamName}>{m.name}</div>
                  <div className={s.teamRole}>{m.role}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 12, color: "#64748b", fontSize: "0.85rem" }}>
              Hong Kong 🇭🇰 · Singapore 🇸🇬
            </p>
          </div>
        </div>

        {/* ── S14: Closing ────────────────────────────────────── */}
        <div ref={(el) => { slideRefs.current[12] = el; }} className={s.slide}>
          <div className={s.bgOrb} style={{ width: 600, height: 600, background: "#6366f1", bottom: -200, left: "50%", marginLeft: -300, position: "absolute", borderRadius: "50%", filter: "blur(120px)", opacity: 0.1 }} />
          <div className={s.ctaBlock}>
            <img src={IMAGES.logo} alt="StoaBase" style={{ height: 44 }} />
            <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: "1.1rem", lineHeight: 1.8, marginTop: 20 }}>
              We believe every AI-native business will need a runtime layer.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7, marginTop: 8 }}>
              The first generation of founders are still stitching that layer together manually.
            </p>
            <p style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.1rem", marginTop: 12 }}>
              StoaBase turns that into a product.
            </p>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.7, marginTop: 16 }}>
              We started by co-building AI ventures.<br />
              <strong style={{ color: "#c4b5fd" }}>We now believe the bigger company is the system beneath them.</strong>
            </p>
            <div className={s.ctaButtons} style={{ marginTop: 32 }}>
              <a href="https://stoabase.ai/contact" target="_blank" rel="noreferrer" className={`${s.ctaBtn} ${s.ctaBtnPrimary}`}>Get in Touch</a>
              <a href="https://app.stoabase.ai" target="_blank" rel="noreferrer" className={`${s.ctaBtn} ${s.ctaBtnSecondary}`}>Try the Platform →</a>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 16 }}>hello@stoabase.ai<br />stoabase.ai</p>
          </div>
        </div>
      </div>

      {/* ── Mic Toggle ────────────────────────────────────────────── */}
      <button
        className={`${s.micToggle} ${audio.isActive ? s.micToggleActive : ""}`}
        onClick={() => { if (audio.isActive) { audio.close(); } else { audio.setActive(true); audio.play(); } }}
        aria-label={audio.isActive ? "Stop podcast" : "Start podcast"}
      >
        <Mic size={20} />
      </button>

      {/* ── Audio Bar ─────────────────────────────────────────────── */}
      {audio.isActive &&
        audio.currentSegment &&
        (() => {
          const _lk = deckLang === "zh-CN" ? "zhCN" : deckLang === "zh-TW" ? "zhTW" : "en";
          const _txt = audio.currentSegment[_lk as keyof typeof audio.currentSegment] as { display: string; speech: string };
          return (
            <div className={s.audioBar}>
              <div className={`${s.audioSpeaker} ${audio.currentSegment.speaker === "denny" ? s.audioSpeakerDenny : s.audioSpeakerKen}`}>
                {audio.currentSegment.speaker === "denny" ? "DW" : "KH"}
              </div>
              <div className={s.audioDisplay}>
                <div
                  className={`${s.audioDisplayInner} ${audio.isPlaying ? s.audioHighlight : ""}`}
                  key={`${audio.currentIdx}-${deckLang}`}
                  style={{ "--highlight-pct": `${audio.highlightPct}%` } as React.CSSProperties}
                >
                  <span style={{ color: audio.currentSegment.speaker === "denny" ? "#c4b5fd" : "#93c5fd", fontWeight: 600, fontSize: "0.7rem", marginRight: 6 }}>
                    {audio.currentSegment.speaker === "denny" ? "Denny" : "Ken"}
                  </span>
                  {_txt.display}
                </div>
              </div>
              <div className={s.audioControls}>
                <button className={s.audioCtrlBtn} onClick={audio.prev} disabled={audio.currentIdx === 0} aria-label="Previous"><SkipBack size={14} /></button>
                <button className={`${s.audioCtrlBtn} ${s.audioPlayBtn}`} onClick={audio.toggle} aria-label={audio.isPlaying ? "Pause" : "Play"}>
                  {audio.isLoading ? <Loader2 size={16} className={s.audioLoading} /> : audio.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button className={s.audioCtrlBtn} onClick={audio.next} disabled={audio.currentIdx >= audio.totalSegments - 1} aria-label="Next"><SkipForward size={14} /></button>
              </div>
              <div className={s.audioLangBtns}>
                {(["en", "zh-CN", "zh-TW"] as DeckLang[]).map((l) => (
                  <button key={l} className={`${s.audioLangBtn} ${deckLang === l ? s.audioLangActive : ""}`} onClick={() => setDeckLang(l)}>
                    {l === "en" ? "EN" : l === "zh-CN" ? "简" : "繁"}
                  </button>
                ))}
              </div>
              <span className={s.audioProgress}>{audio.currentIdx + 1}/{audio.totalSegments}</span>
              <button className={s.audioCloseBtn} onClick={audio.close} aria-label="Close"><X size={14} /></button>
            </div>
          );
        })()}

      {/* ── Nav Bar ──────────────────────────────────────────────── */}
      <div className={s.navBar}>
        <button className={s.navBtn} onClick={() => go(-1)} disabled={current === 0} aria-label="Previous slide"><ChevronLeft size={18} /></button>
        <div className={s.navDots}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button key={i} className={`${s.navDot} ${i === current ? s.navDotActive : ""}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <span className={s.slideNumber}>{current + 1} / {TOTAL_SLIDES}</span>
        <button className={s.navBtn} onClick={() => go(1)} disabled={current === TOTAL_SLIDES - 1} aria-label="Next slide"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}
