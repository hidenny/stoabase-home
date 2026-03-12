/**
 * Stoabase One-Pager — Standalone landing page
 * Inspired by paperclip.ing — scroll-animated, SVG-rich, interactive
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Brain, Database, BookOpen, Settings, Headphones, Monitor,
  Image, UserCheck, Globe, Puzzle, FileText, Activity,
  Zap, ArrowRight, Sparkles, Shield, BarChart3, Search, Menu, X
} from "lucide-react";
import "./StoaOnePager.css";

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ══════════════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("active"); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`stoa-reveal ${delay ? `delay-${delay}` : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   COUNT-UP ON SCROLL
   ══════════════════════════════════════════════════════ */
function CountUp({ end, start = 0, suffix = "", prefix = "", duration = 2000 }: { end: number; start?: number; suffix?: string; prefix?: string; duration?: number }) {
  const [value, setValue] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    setValue(start);
    started.current = false;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          const startTime = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(start + eased * (end - start)));
            if (p < 1) requestAnimationFrame(step);
            else setValue(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <div ref={ref}>{prefix}{value.toLocaleString()}{suffix}</div>;
}

/* ══════════════════════════════════════════════════════
   TYPING PROMPT
   ══════════════════════════════════════════════════════ */
const PROMPTS = [
  "Build me an AI nutrition app that scans meals and tracks macros",
  "Create a company accounting dashboard with AI expense categorization",
  "Launch an AI tutoring platform with adaptive quizzes and analytics",
  "Deploy a medical records system with AI-powered patient insights",
  "Ship a podcast studio with AI-generated episodes and show notes",
  "Build a customer support copilot with knowledge search and voice",
];

function TypingPrompt() {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "clear">("typing");
  const text = PROMPTS[idx];
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Keep cursor visible at the right edge
    if (textRef.current) {
      textRef.current.scrollLeft = textRef.current.scrollWidth;
    }
  }, [charIdx]);

  useEffect(() => {
    if (phase === "typing") {
      if (charIdx < text.length) {
        const t = setTimeout(() => setCharIdx(c => c + 1), 30 + Math.random() * 25);
        return () => clearTimeout(t);
      }
      setPhase("pause");
    }
    if (phase === "pause") {
      const t = setTimeout(() => setPhase("clear"), 2400);
      return () => clearTimeout(t);
    }
    if (phase === "clear") {
      setCharIdx(0);
      setIdx(i => (i + 1) % PROMPTS.length);
      setPhase("typing");
    }
  }, [phase, charIdx, text]);

  return (
    <div className="stoa-prompt-box">
      <span className="stoa-prompt-icon">⚡</span>
      <span ref={textRef} className="stoa-prompt-text">
        {text.slice(0, charIdx)}
        {phase === "typing" && <span className="stoa-cursor" />}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   BUSINESS TAB CATEGORIES
   ══════════════════════════════════════════════════════ */
type AppCard = { name: string; desc: string; tag: string; tagLabel: string; prompt: string; color: string; bgGrad: [string, string]; svg: React.ReactNode; services?: string[] };
type BusinessTab = { id: string; label: string; emoji: string; logo?: string; subline: string; color: string; apps: AppCard[] };

function MiniSvg({ color, children }: { color: string; children: React.ReactNode }) {
  return <svg viewBox="0 0 400 300" fill="none">{children}</svg>;
}

function CinematicAppCard({ app }: { app: AppCard }) {
  return (
    <div className="stoa-app-card">
      <div className="stoa-app-card-preview" style={{ background: `linear-gradient(135deg, ${app.bgGrad[0]}, ${app.bgGrad[1]})`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {app.svg}
        </div>
      </div>
      <div className="stoa-app-card-info">
        <span className={`stoa-app-card-tag tag-${app.tag}`}>{app.tagLabel}</span>
        <p className="stoa-app-card-name">{app.name}</p>
        <p className="stoa-app-card-desc">{app.desc}</p>
        <div className="stoa-app-card-prompt">{app.prompt}</div>
      </div>
    </div>
  );
}

function CinematicRealmSvg() {
  const [phase, setPhase] = useState<"idle" | "moving" | "clicked" | "result">("idle");

  useEffect(() => {
    let active = true;
    const run = async () => {
      while (active) {
        setPhase("idle");
        await new Promise(r => setTimeout(r, 1000));
        if (!active) break;

        setPhase("moving");
        await new Promise(r => setTimeout(r, 1500));
        if (!active) break;

        setPhase("clicked");
        await new Promise(r => setTimeout(r, 300));
        if (!active) break;

        setPhase("result");
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    run();
    return () => { active = false; };
  }, []);

  return (
    <MiniSvg color="#22d3ee">
      {/* ── BASE UI (Home View) ── */}
      <g style={{ opacity: phase === "result" ? 0 : 1, transition: "opacity 0.4s ease", transform: phase === "result" ? "scale(0.96)" : "scale(1)", transformOrigin: "200px 150px" }}>
        {/* App Frame */}
        <rect x="40" y="40" width="320" height="220" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />

        {/* Left Sidebar */}
        <path d="M 40 48 C 40 43.5 43.5 40 48 40 L 95 40 L 95 260 L 48 260 C 43.5 260 40 256.5 40 252 Z" fill="#faf5ff" />
        <line x1="95" y1="40" x2="95" y2="260" stroke="#f3e8ff" strokeWidth="1" />

        {/* Sidebar Header */}
        <rect x="48" y="50" width="12" height="12" rx="3" fill="#0f172a" />
        <text x="54" y="58.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#fff">R</text>
        <text x="64" y="55" fontSize="6" fontWeight="bold" fill="#0f172a">ReaLM</text>
        <text x="64" y="60" fontSize="3.5" fill="#6b21a8">Synthesize Anything</text>

        {/* Sidebar Nav */}
        {[
          { icon: "🌍", label: "Discover", active: true },
          { icon: "📄", label: "Streams" },
          { icon: "📊", label: "Library" },
          { icon: "🛍️", label: "Agent Store" },
          { icon: "🎯", label: "Topic Store" },
          { icon: "👨‍🎓", label: "My Profile" }
        ].map((item, i) => (
          <g key={i} transform={`translate(0, ${75 + i * 14})`} opacity={item.active ? 1 : 0.7}>
            <text x="54" y="4" textAnchor="middle" fontSize="6">{item.icon}</text>
            <text x="64" y="4.5" fontSize="4.5" fontWeight={item.active ? "bold" : "normal"} fill={item.active ? "#6b21a8" : "#475569"}>{item.label}</text>
          </g>
        ))}

        {/* Main Content Area */}
        <text x="227.5" y="90" textAnchor="middle" fontSize="16" fontWeight="800" fill="#6366f1" letterSpacing="1">Synthesize Anything</text>
        <text x="227.5" y="105" textAnchor="middle" fontSize="6" fill="#94a3b8">Turn any topic into immersive, interactive streams of knowledge.</text>

        {/* Search Bar */}
        <rect x="127" y="120" width="200" height="20" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="131" y="124" width="45" height="12" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="153.5" y="132" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#475569">🎓 Beginner ▾</text>
        <text x="182" y="132" fontSize="5" fill="#94a3b8">https://n|</text>

        <rect x="282" y="123" width="40" height="14" rx="7" fill={phase === "clicked" ? "#7c3aed" : "#8b5cf6"} style={{ transform: phase === "clicked" ? "scale(0.95)" : "scale(1)", transformOrigin: "302px 130px", transition: "all 0.1s ease" }} />
        <text x="302" y="132" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#fff" style={{ transform: phase === "clicked" ? "scale(0.95)" : "scale(1)", transformOrigin: "302px 130px", transition: "all 0.1s ease", pointerEvents: "none" }}>✨ Rea</text>

        {/* Group TOPIC */}
        <text x="127" y="152" fontSize="4" fontWeight="700" fill="#94a3b8">TOPIC</text>
        <rect x="127" y="156" width="32" height="12" rx="6" fill="#8b5cf6" />
        <text x="143" y="164" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#fff">General</text>
        <rect x="162" y="156" width="35" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="179.5" y="164" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">Technical</text>
        <rect x="200" y="156" width="35" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="217.5" y="164" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">Marketing</text>
        <rect x="238" y="156" width="30" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="253" y="164" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">Finance</text>
        <rect x="271" y="156" width="35" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="288.5" y="164" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">Business</text>

        {/* Group IDEAS */}
        <text x="127" y="182" fontSize="4" fontWeight="700" fill="#94a3b8">IDEAS</text>
        <rect x="127" y="186" width="45" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="149.5" y="194" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">🧧 Lunar New Year</text>
        <rect x="175" y="186" width="40" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="195" y="194" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">🔗 Blockchain</text>
        <rect x="218" y="186" width="38" height="12" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="237" y="194" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#64748b">🧬 CRISPR</text>
      </g>

      {/* ── RESULT VIEW (Shows after click) ── */}
      <g style={{ opacity: phase === "result" ? 1 : 0, transform: phase === "result" ? "translateY(0)" : "translateY(10px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {/* Frame and Sidebar stay visible, we just overlay the main content over the right side */}
        <rect x="95" y="40" width="265" height="220" fill="#f8fafc" />

        {/* Fake Breadcrumb/Header */}
        <rect x="105" y="50" width="8" height="8" rx="2" fill="#0f172a" />
        <text x="109" y="56.5" textAnchor="middle" fontSize="4" fontWeight="bold" fill="#fff">R</text>
        <text x="116" y="56" fontSize="4.5" fill="#64748b">ReaLM › My Streams › <tspan fontWeight="600" fill="#0f172a">The Immune System Explained</tspan></text>
        <line x1="105" y1="64" x2="350" y2="64" stroke="#e2e8f0" strokeWidth="1" />

        {/* Stream Content Block */}
        <rect x="105" y="74" width="245" height="80" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="113" y="80" width="40" height="12" rx="4" fill="#8b5cf6" />
        <text x="133" y="88" textAnchor="middle" fontSize="5" fontWeight="600" fill="#fff">Introduction</text>

        <text x="115" y="102" fontSize="5.5" fill="#334155">The immune system is a complex network of cells, tissues,</text>
        <text x="115" y="112" fontSize="5.5" fill="#334155">and organs that work together to defend the body against</text>
        <text x="115" y="122" fontSize="5.5" fill="#334155">infections. It acts as the body's personal security detail.</text>

        <rect x="113" y="128" width="229" height="20" rx="4" fill="#f1f5f9" />
        <text x="227.5" y="143" textAnchor="middle" fontSize="12">🧬</text>
      </g>

      {/* ── ANIMATED CURSOR ── */}
      <g
        style={{
          transform: `translate(${phase === "idle" ? "200px, 200px" : "296px, 128px"})`,
          transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: phase === "result" ? 0 : 1,
          pointerEvents: "none"
        }}
      >
        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z" fill="#0f172a" stroke="#fff" strokeWidth="1" style={{ transform: "scale(0.8)" }} />
      </g>
    </MiniSvg>
  );
}

const BUSINESS_TABS: BusinessTab[] = [
  {
    id: "rodyssey", label: "R'ODYSSEY", emoji: "", logo: "https://cdn.prod.website-files.com/696aeaae8c07b3c89ecdc734/696aebb3fb7e6cacdbb2a9a6_68411b8fb1f5e00e1c860062_6794b073b2b67e995cfddf8f_ro_logo.png", color: "#a78bfa",
    subline: "AI-powered Smart Campus — from classroom to home",
    apps: [
      {
        name: "RO Agent", desc: "Personal AI tutor companion — before, during and after class with knowledge support.", tag: "tutor", tagLabel: "AI TUTOR", prompt: "\"Build an AI tutor that guides students through lessons\"", color: "#a78bfa", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#a78bfa">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="200" height="36" rx="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="80" y="82" fontSize="9" fill="#64748b">"I don't understand fractions..."</text>
          <path d="M 270 78 L 290 78" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 290 78 L 285 73 M 290 78 L 285 83" stroke="#a78bfa" strokeWidth="2" fill="none" />
          <rect x="140" y="120" width="200" height="80" rx="8" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1" />
          <circle cx="160" cy="140" r="10" fill="#a78bfa" opacity="0.2" />
          <text x="160" y="144" textAnchor="middle" fontSize="10">🤖</text>
          <text x="180" y="143" fontSize="8" fontWeight="600" fill="#7c3aed">RO 小助</text>
          <text x="150" y="165" fontSize="7" fill="#6d28d9">Let's look at a pizza! If we cut it...</text>
          <rect x="150" y="178" width="120" height="6" rx="3" fill="#c4b5fd" opacity="0.4" />
          <rect x="150" y="178" width="60" height="6" rx="3" fill="#8b5cf6">
            <animate attributeName="width" values="0;60;0" dur="3s" repeatCount="indefinite" />
          </rect>
        </MiniSvg>
      },
      { name: "ReaLM", desc: "A private NotebookLM — synthesize any content into knowledge, audio, and interactive learning.", tag: "twin", tagLabel: "KNOWLEDGE ENGINE", prompt: "\"Build a private NotebookLM for my organisation\"", color: "#22d3ee", bgGrad: ["transparent", "transparent"], svg: <CinematicRealmSvg /> },
      {
        name: "AI Lesson Studio", desc: "Generate interactive lessons and quizzes from textbook content.", tag: "lesson", tagLabel: "CONTENT GEN", prompt: "\"Generate lessons from my curriculum automatically\"", color: "#818cf8", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#818cf8">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="280" height="40" rx="8" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1" />
          <text x="80" y="83" fontSize="8" fill="#4f46e5"><tspan fontWeight="700">Topic:</tspan> Cellular Respiration for Grade 9</text>
          <path d="M 200 110 L 200 130" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 120 120 L 280 120" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 120 120 L 120 140 M 280 120 L 280 140" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
          <rect x="70" y="140" width="100" height="80" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="120" y="170" textAnchor="middle" fontSize="14">📺</text>
          <text x="120" y="190" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1e293b">12 Slides</text>
          <text x="120" y="205" textAnchor="middle" fontSize="6" fill="#64748b">Generated</text>
          <rect x="230" y="140" width="100" height="80" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="280" y="170" textAnchor="middle" fontSize="14">✅</text>
          <text x="280" y="190" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1e293b">5 Quizzes</text>
          <text x="280" y="205" textAnchor="middle" fontSize="6" fill="#64748b">Generated</text>
        </MiniSvg>
      },
      {
        name: "Magic Card AR", desc: "AR flashcards — scan printed cards to unlock 3D learning.", tag: "ar", tagLabel: "AR LEARNING", prompt: "\"Create AR flashcards from my study materials\"", color: "#f472b6", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#f472b6">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="80" y="70" width="80" height="120" rx="6" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
          <text x="120" y="110" textAnchor="middle" fontSize="16">🖨️</text>
          <text x="120" y="130" textAnchor="middle" fontSize="8" fontWeight="600" fill="#475569">Physical Card</text>
          <text x="120" y="170" textAnchor="middle" fontSize="6" fill="#94a3b8">Scan code</text>
          <path d="M 180 130 L 220 130" stroke="#f472b6" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 220 130 L 210 125 M 220 130 L 210 135" stroke="#f472b6" strokeWidth="2" fill="none" />
          <rect x="240" y="70" width="80" height="120" rx="12" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1" />
          <text x="280" y="100" textAnchor="middle" fontSize="10">📱</text>
          <circle cx="280" cy="140" r="16" fill="#f472b6" opacity="0.2" />
          <text x="280" y="146" textAnchor="middle" fontSize="20">🦕</text>
          <text x="280" y="175" textAnchor="middle" fontSize="7" fontWeight="600" fill="#be185d">3D Model Jump</text>
        </MiniSvg>
      },
      {
        name: "Class Analytics", desc: "Per-student and class-wide AI insights for teachers.", tag: "analytics", tagLabel: "ANALYTICS", prompt: "\"Show me class performance with AI recommendations\"", color: "#34d399", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#34d399">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="100" height="120" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          {[40, 25, 45, 30, 50].map((h, i) => <rect key={i} x={75 + i * 14} y={150 - h} width="8" height={h} rx="2" fill="#cbd5e1" />)}
          <text x="110" y="80" textAnchor="middle" fontSize="7" fontWeight="600" fill="#64748b">Raw Data</text>
          <path d="M 175 120 L 205 120" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 205 120 L 195 115 M 205 120 L 195 125" stroke="#34d399" strokeWidth="2" fill="none" />
          <rect x="220" y="60" width="120" height="140" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
          <text x="280" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="#059669">✨ AI Insights</text>
          <rect x="235" y="95" width="90" height="24" rx="4" fill="#fff" />
          <text x="240" y="106" fontSize="6" fontWeight="600" fill="#059669">Action required</text>
          <text x="240" y="115" fontSize="5" fill="#475569">3 students failing algebra</text>
          <rect x="235" y="125" width="90" height="24" rx="4" fill="#fff" />
          <text x="240" y="136" fontSize="6" fontWeight="600" fill="#059669">Trend</text>
          <text x="240" y="145" fontSize="5" fill="#475569">Engagement up 15%</text>
          <rect x="235" y="155" width="90" height="24" rx="4" fill="#fff" />
          <text x="280" y="166" textAnchor="middle" fontSize="6" fontWeight="600" fill="#059669">Generate Intervention →</text>
        </MiniSvg>
      },
      {
        name: "AI Worksheet", desc: "Interactive, AI-scaffolded worksheets with shadow teacher support.", tag: "worksheet", tagLabel: "INTERACTIVE", prompt: "\"Generate differentiated worksheets for my class\"", color: "#fbbf24", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#fbbf24">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="280" height="32" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="80" y="78" fontSize="8" fill="#64748b">Student enters wrong answer: <tspan fill="#ef4444" fontWeight="600">3/4 + 1/2 = 4/6</tspan></text>
          <path d="M 200 100 L 200 120" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 200 120 L 195 110 M 200 120 L 205 110" stroke="#fbbf24" strokeWidth="2" fill="none" />
          <rect x="100" y="130" width="200" height="80" rx="8" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
          <text x="120" y="155" fontSize="12">💡</text>
          <text x="140" y="155" fontSize="8" fontWeight="600" fill="#b45309">AI Shadow Teacher</text>
          <text x="120" y="175" fontSize="7" fill="#92400e">"Not quite! Remember we need common denominators</text>
          <text x="120" y="188" fontSize="7" fill="#92400e">before adding. What is the LCM of 4 and 2?"</text>
        </MiniSvg>
      },
    ],
  },
  {
    id: "iomics", label: "iOMICS", emoji: "", logo: "https://cdn.prod.website-files.com/684c3a383dd53828f418a8f3/685d7b2774af5c94cfdfd7c8_iomics_logo.png", color: "#fb7185",
    subline: "Personal healthcare & clinical AI — from vitals to insights",
    apps: [
      {
        name: "MediVault", desc: "AI-powered patient records with clinical knowledge base.", tag: "medical", tagLabel: "RECORDS", prompt: "\"Deploy a medical records system with AI insights\"", color: "#fb7185", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#fb7185">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="80" width="100" height="100" rx="8" fill="#fff1f2" stroke="#fecdd3" strokeWidth="1" />
          <text x="110" y="115" textAnchor="middle" fontSize="16">📄</text>
          <text x="110" y="135" textAnchor="middle" fontSize="7" fontWeight="600" fill="#be123c">Raw Lab Results</text>
          <text x="110" y="148" textAnchor="middle" fontSize="5" fill="#f43f5e">Glucose: 105 mg/dL</text>
          <text x="110" y="156" textAnchor="middle" fontSize="5" fill="#f43f5e">A1C: 5.8%</text>
          <path d="M 170 130 L 220 130" stroke="#fb7185" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 220 130 L 210 125 M 220 130 L 210 135" stroke="#fb7185" strokeWidth="2" fill="none" />
          <rect x="230" y="60" width="110" height="140" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="285" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0f172a">🧠 AI Synthesis</text>
          <rect x="245" y="95" width="80" height="40" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="252" y="110" fontSize="6" fontWeight="600" fill="#be123c">Risk Profile</text>
          <text x="252" y="122" fontSize="5" fill="#64748b">Pre-diabetic indicators observed.</text>
          <rect x="245" y="145" width="80" height="40" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="252" y="160" fontSize="6" fontWeight="600" fill="#059669">Recommendation</text>
          <text x="252" y="172" fontSize="5" fill="#64748b">Schedule lifestyle coaching.</text>
        </MiniSvg>
      },
      {
        name: "NutriScan AI", desc: "Scan meals, track macros, get personalised nutrition coaching.", tag: "nutrition", tagLabel: "NUTRITION", prompt: "\"Build an AI nutrition app that scans food photos\"", color: "#4ade80", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#4ade80">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="70" y="70" width="80" height="120" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="110" y="120" textAnchor="middle" fontSize="24">🥗</text>
          <text x="110" y="145" textAnchor="middle" fontSize="7" fontWeight="600" fill="#64748b">Camera Input</text>
          <path d="M 160 130 L 210 130" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 210 130 L 200 125 M 210 130 L 200 135" stroke="#4ade80" strokeWidth="2" fill="none" />
          <rect x="220" y="70" width="110" height="120" rx="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
          <text x="275" y="95" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">AI Breakdown</text>
          <text x="235" y="115" fontSize="7" fill="#15803d">Protein:</text><rect x="270" y="110" width="45" height="6" rx="3" fill="#4ade80" />
          <text x="235" y="135" fontSize="7" fill="#1e3a8a">Carbs:</text><rect x="270" y="130" width="30" height="6" rx="3" fill="#60a5fa" />
          <text x="235" y="155" fontSize="7" fill="#854d0e">Fat:</text><rect x="270" y="150" width="20" height="6" rx="3" fill="#facc15" />
          <text x="275" y="175" textAnchor="middle" fontSize="6" fontWeight="600" fill="#166534">Estimate: 420 kcal</text>
        </MiniSvg>
      },
      {
        name: "SymptomCheck", desc: "AI triage — describe symptoms, get guided next steps.", tag: "triage", tagLabel: "AI TRIAGE", prompt: "\"Create a symptom checker with AI triage\"", color: "#f97316", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#f97316">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="200" height="36" rx="18" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="80" y="82" fontSize="9" fill="#64748b">"I've had a bad headache for 3 days..."</text>
          <path d="M 270 78 L 290 78" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 290 78 L 285 73 M 290 78 L 285 83" stroke="#f97316" strokeWidth="2" fill="none" />
          <rect x="140" y="120" width="200" height="80" rx="12" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <circle cx="160" cy="140" r="12" fill="#f97316" opacity="0.1" />
          <text x="160" y="144" textAnchor="middle" fontSize="12">🩺</text>
          <text x="180" y="143" fontSize="8" fontWeight="700" fill="#c2410c">AI Triage</text>
          <text x="150" y="165" fontSize="7" fill="#9a3412">Does the pain worsen with light or sound?</text>
          <rect x="150" y="180" width="40" height="16" rx="6" fill="#f97316" opacity="0.1" />
          <text x="170" y="191" textAnchor="middle" fontSize="6" fontWeight="600" fill="#c2410c">Yes</text>
          <rect x="200" y="180" width="40" height="16" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="220" y="191" textAnchor="middle" fontSize="6" fill="#64748b">No</text>
        </MiniSvg>
      },
      {
        name: "MedScheduler", desc: "Smart appointment booking with AI-optimised scheduling.", tag: "scheduler", tagLabel: "SCHEDULING", prompt: "\"Build smart clinic scheduling with AI optimisation\"", color: "#818cf8", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#818cf8">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="70" width="90" height="110" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="105" y="90" textAnchor="middle" fontSize="7" fontWeight="600" fill="#64748b">Patient Request</text>
          <text x="70" y="110" fontSize="7" fill="#1e293b">"Need an urgent consult</text>
          <text x="70" y="122" fontSize="7" fill="#1e293b">with Dr. Smith this week."</text>
          <path d="M 160 120 L 210 120" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 210 120 L 200 115 M 210 120 L 200 125" stroke="#818cf8" strokeWidth="2" fill="none" />
          <rect x="220" y="70" width="120" height="110" rx="8" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1" />
          <text x="280" y="90" textAnchor="middle" fontSize="8" fontWeight="700" fill="#4f46e5">AI Optimised Slot</text>
          <rect x="235" y="105" width="90" height="30" rx="6" fill="#fff" stroke="#a5b4fc" strokeWidth="1" />
          <text x="280" y="120" textAnchor="middle" fontSize="7" fontWeight="600" fill="#3730a3">Thu, 2:30 PM</text>
          <text x="280" y="129" textAnchor="middle" fontSize="5" fill="#6366f1">15m gap found in Dr. Smith's calendar</text>
          <rect x="250" y="150" width="60" height="16" rx="8" fill="#4f46e5" />
          <text x="280" y="161" textAnchor="middle" fontSize="6" fill="#fff">Book Slot</text>
        </MiniSvg>
      },
      {
        name: "RxTracker", desc: "Medication management with AI adherence coaching.", tag: "meds", tagLabel: "MEDICATION", prompt: "\"Build a medication tracker with adherence alerts\"", color: "#22d3ee", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#22d3ee">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="80" width="100" height="100" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="110" cy="115" r="16" fill="#0ea5e9" opacity="0.1" />
          <text x="110" y="120" textAnchor="middle" fontSize="14">⏱️</text>
          <text x="110" y="145" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0f172a">Missed Dose Detected</text>
          <text x="110" y="157" textAnchor="middle" fontSize="6" fill="#64748b">Lisinopril 10mg</text>
          <path d="M 170 130 L 220 130" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 220 130 L 210 125 M 220 130 L 210 135" stroke="#0ea5e9" strokeWidth="2" fill="none" />
          <rect x="230" y="60" width="110" height="140" rx="12" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
          <text x="285" y="85" textAnchor="middle" fontSize="12">💬</text>
          <text x="285" y="105" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0369a1">AI Coach Intervenes</text>
          <text x="285" y="125" textAnchor="middle" fontSize="6" fill="#0c4a6e">"Hi John, I noticed you</text>
          <text x="285" y="135" textAnchor="middle" fontSize="6" fill="#0c4a6e">missed your morning meds.</text>
          <text x="285" y="145" textAnchor="middle" fontSize="6" fill="#0c4a6e">Take them now if you can."</text>
          <rect x="250" y="165" width="70" height="16" rx="8" fill="#0ea5e9" opacity="0.1" />
          <text x="285" y="176" textAnchor="middle" fontSize="6" fontWeight="600" fill="#0284c7">Mark as Taken</text>
        </MiniSvg>
      },
      {
        name: "WellnessAI", desc: "Mental health check-ins, mood tracking, and AI journaling.", tag: "wellness", tagLabel: "WELLNESS", prompt: "\"Create a mental wellness app with mood tracking\"", color: "#c084fc", bgGrad: ["transparent", "transparent"], svg: <MiniSvg color="#c084fc">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="110" height="140" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="115" y="85" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0f172a">Daily Log</text>
          <text x="70" y="105" fontSize="7" fill="#64748b">"Feeling overwhelmed</text>
          <text x="70" y="117" fontSize="7" fill="#64748b">by deadlines today.</text>
          <text x="70" y="129" fontSize="7" fill="#64748b">Didn't sleep well."</text>
          <text x="115" y="160" textAnchor="middle" fontSize="24">😟</text>
          <path d="M 180 130 L 220 130" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 220 130 L 210 125 M 220 130 L 210 135" stroke="#c084fc" strokeWidth="2" fill="none" />
          <rect x="230" y="60" width="110" height="140" rx="8" fill="#faf5ff" stroke="#e9d5ff" strokeWidth="1" />
          <text x="285" y="85" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7e22ce">✨ AI Insight</text>
          <text x="240" y="110" fontSize="6" fill="#6b21a8">I hear you. Stress often</text>
          <text x="240" y="120" fontSize="6" fill="#6b21a8">disrupts sleep patterns.</text>
          <text x="240" y="130" fontSize="6" fill="#6b21a8">Let's try a 3-minute</text>
          <text x="240" y="140" fontSize="6" fill="#6b21a8">breathing exercise.</text>
          <rect x="245" y="160" width="80" height="20" rx="10" fill="#a855f7" opacity="0.1" />
          <text x="285" y="173" textAnchor="middle" fontSize="6" fontWeight="600" fill="#7e22ce">Start Exercise ▶</text>
        </MiniSvg>
      },
    ],
  },
  {
    id: "yourbiz", label: "Startups", emoji: "🚀", logo: "", color: "#60a5fa",
    subline: "Launch your next big app idea with autonomous AI infrastructure",
    apps: [
      {
        name: "2D RPG Studio", desc: "Build a complete 2D RPG with generated sprite assets, dynamic quests, and autonomous live-ops.", tag: "game", tagLabel: "GAME DEV", prompt: "\"Build an autonomous 2D pixel RPG game\"", color: "#60a5fa", bgGrad: ["transparent", "transparent"], services: ["Data Service: Quest Storage", "Workflow Engine: Event Scheduler", "LLM Service: NPC Dialogue"], svg: <MiniSvg color="#60a5fa">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="100" height="120" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="110" y="100" textAnchor="middle" fontSize="24">👾</text>
          <text x="110" y="130" textAnchor="middle" fontSize="8" fontWeight="600" fill="#0f172a">Pixel Asset Gen</text>
          <text x="110" y="145" textAnchor="middle" fontSize="6" fill="#64748b">Idle, Walk, Attack frames</text>
          <path d="M 175 120 L 210 120" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 210 120 L 200 115 M 210 120 L 200 125" stroke="#60a5fa" strokeWidth="2" fill="none" />
          <rect x="220" y="60" width="120" height="140" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
          <text x="280" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1d4ed8">🗺️ World Builder</text>
          <rect x="235" y="95" width="90" height="24" rx="4" fill="#fff" />
          <text x="240" y="106" fontSize="6" fontWeight="600" fill="#2563eb">NPC: Eldred the Seer</text>
          <text x="240" y="115" fontSize="5" fill="#64748b">Dialogue tree created</text>
          <rect x="235" y="125" width="90" height="24" rx="4" fill="#fff" />
          <text x="240" y="136" fontSize="6" fontWeight="600" fill="#16a34a">Boss: Shadow Weaver</text>
          <text x="240" y="145" fontSize="5" fill="#64748b">Loot table & stats mapped</text>
        </MiniSvg>
      },
      {
        name: "MatchMaker AI", desc: "A dating app powered by vector similarity matching, autonomous icebreakers, and behavioral analytics.", tag: "dating", tagLabel: "AI DATING", prompt: "\"Build an AI-first dating app that actually works\"", color: "#f472b6", bgGrad: ["transparent", "transparent"], services: ["Unified Tracking: Interaction Graphs", "Workflow Engine: Match Routing", "Knowledge Mgmt: User Vectors"], svg: <MiniSvg color="#f472b6">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="100" height="120" rx="12" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1" />
          <text x="110" y="100" textAnchor="middle" fontSize="24">💖</text>
          <text x="110" y="130" textAnchor="middle" fontSize="8" fontWeight="600" fill="#9d174d">Vector Matching</text>
          <text x="110" y="145" textAnchor="middle" fontSize="6" fill="#be185d">98% Personality Sync</text>
          <path d="M 175 120 L 210 120" stroke="#f472b6" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 210 120 L 200 115 M 210 120 L 200 125" stroke="#f472b6" strokeWidth="2" fill="none" />
          <rect x="220" y="60" width="120" height="140" rx="12" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="280" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0f172a">💬 Icebreaker AI</text>
          <rect x="235" y="95" width="80" height="20" rx="10" fill="#f1f5f9" />
          <text x="245" y="108" fontSize="5" fill="#475569">"Noticed you like hiking..."</text>
          <rect x="255" y="125" width="70" height="20" rx="10" fill="#fbcfe8" />
          <text x="265" y="138" fontSize="5" fill="#831843">"Yes! Just went to Yosemite!"</text>
          <rect x="250" y="160" width="60" height="16" rx="8" fill="#f472b6" />
          <text x="280" y="171" textAnchor="middle" fontSize="6" fontWeight="600" fill="#fff">Suggest Coffee</text>
        </MiniSvg>
      },
      {
        name: "Alpha Quant", desc: "Personal hedge-fund AI — real-time portfolio tracking, sentiment analysis, and automated trade alerts.", tag: "finance", tagLabel: "INVESTMENT", prompt: "\"Build an autonomous investment tracking and analysis app\"", color: "#34d399", bgGrad: ["transparent", "transparent"], services: ["Data Service: Time-Series Market DB", "Workflow Engine: Alert Triggers", "LLM Service: Earnings Summaries"], svg: <MiniSvg color="#34d399">
          <rect x="40" y="40" width="320" height="220" rx="16" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="60" y="60" width="100" height="120" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <text x="110" y="90" textAnchor="middle" fontSize="16">📈</text>
          <text x="110" y="115" textAnchor="middle" fontSize="7" fontWeight="600" fill="#0f172a">Real-time Stream</text>
          {[40, 25, 45, 30, 50].map((h, i) => <rect key={i} x={85 + i * 10} y={160 - h} width="6" height={h} rx="2" fill="#cbd5e1" />)}
          <path d="M 175 120 L 210 120" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 210 120 L 200 115 M 210 120 L 200 125" stroke="#34d399" strokeWidth="2" fill="none" />
          <rect x="220" y="60" width="120" height="140" rx="8" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
          <text x="280" y="80" textAnchor="middle" fontSize="8" fontWeight="700" fill="#065f46">🧠 Sentiment Analysis</text>
          <rect x="235" y="95" width="90" height="30" rx="4" fill="#fff" />
          <text x="240" y="107" fontSize="6" fontWeight="600" fill="#059669">AAPL Earnings Call</text>
          <text x="240" y="116" fontSize="4.5" fill="#64748b">"Strong guidance in Q3, AI chips..."</text>
          <text x="310" y="111" fontSize="7" fontWeight="bold" fill="#10b981">BUY</text>
          <rect x="235" y="130" width="90" height="30" rx="4" fill="#fff" />
          <text x="240" y="142" fontSize="6" fontWeight="600" fill="#dc2626">Social Chatter: WidgetCo</text>
          <text x="240" y="151" fontSize="4.5" fill="#64748b">"CEO resigning unexpectedly..."</text>
          <text x="310" y="146" fontSize="7" fontWeight="bold" fill="#ef4444">SELL</text>
        </MiniSvg>
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════
   CAPABILITY ITEMS
   ══════════════════════════════════════════════════════ */
const CAPABILITIES: { Icon: React.ComponentType<any>; label: string; desc: string }[] = [
  { Icon: Brain, label: "AI & LLM Services", desc: "50+ models, routing, chat, streaming, tools, memory" },
  { Icon: Activity, label: "Unified Tracking", desc: "Events, sessions, per-user analytics" },
  { Icon: Database, label: "Data Service", desc: "KV storage, user records, structured data" },
  { Icon: Settings, label: "Workflow Engine", desc: "Visual flow builder, MCP, tool orchestration" },
  { Icon: BookOpen, label: "Knowledge Mgmt", desc: "RAG, document search, vector retrieval" },
  { Icon: FileText, label: "Document Parsing", desc: "PDF, URL, file processing & extraction" },
  { Icon: Headphones, label: "Speech & VAD", desc: "TTS, STT, voice activity detection" },
  { Icon: Monitor, label: "Game AI / 3D", desc: "Interactive content, asset gen, 3D engine" },
  { Icon: Image, label: "Media Generation", desc: "Image, audio, video generation" },
  { Icon: UserCheck, label: "User Management", desc: "Profiles, roles, org-level access" },
  { Icon: Globe, label: "Social Feed", desc: "Posts, comments, real-time sharing" },
  { Icon: Puzzle, label: "Advanced Features", desc: "Podcasts, mind maps, quizzes, co-edit" },
];

/* ══════════════════════════════════════════════════════
   ANIMATED COST ROW (Stoabase card)
   ══════════════════════════════════════════════════════ */
function AnimatedCostRow({ label, value, pct, delay = 0 }: { label: string; value: string; pct: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const bar = barRef.current;
    if (!el || !bar) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        obs.disconnect();
        setTimeout(() => {
          // start at 100% then shrink to pct%
          bar.style.transition = 'width 700ms cubic-bezier(0.25, 1, 0.5, 1)';
          bar.style.width = `${pct}%`;
        }, delay);
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [pct, delay]);

  return (
    <div ref={ref} className="stoa-cost-row">
      <span className="stoa-cost-label">{label}</span>
      <div className="stoa-cost-bar-track">
        <div ref={barRef} className="stoa-cost-bar stoa-cost-bar-new" style={{ width: '100%' }} />
      </div>
      <span className="stoa-cost-val stoa-cost-val-new">{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STOABASE LOGO SVG
   ══════════════════════════════════════════════════════ */
function StoaLogo({ size = 56 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 56" fill="none" height={size}>
      <defs>
        <linearGradient id="p-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="b-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Capital (top horizontal bar) */}
      <rect x="2" y="4" width="48" height="6" rx="2.5" fill="url(#p-g)" />
      {/* Three columns with graduated opacity */}
      <rect x="8" y="12" width="7" height="28" rx="2" fill="url(#p-g)" />
      <rect x="22" y="12" width="7" height="28" rx="2" fill="url(#p-g)" opacity="0.8" />
      <rect x="36" y="12" width="7" height="28" rx="2" fill="url(#p-g)" opacity="0.6" />
      {/* Stylobate (bottom horizontal bar) */}
      <rect x="2" y="42" width="48" height="6" rx="2.5" fill="url(#b-g)" />
      {/* Glow dot */}
      <circle cx="26" cy="27" r="2.5" fill="#c4b5fd" opacity="0.7">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Wordmark */}
      <text x="66" y="39" fontFamily="'Inter', sans-serif" fontSize="30" fontWeight="700" fill="#f1f5f9" letterSpacing="-0.5">
        <tspan>Stoa</tspan><tspan fill="#a78bfa">Base</tspan>
      </text>
    </svg>
  );
}

function StoaLogoBlack({ size = 56 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 56" fill="none" height={size}>
      {/* Capital (top horizontal bar) */}
      <rect x="2" y="4" width="48" height="6" rx="2.5" fill="#1a1a1a" />
      {/* Three columns */}
      <rect x="8" y="12" width="7" height="28" rx="2" fill="#1a1a1a" />
      <rect x="22" y="12" width="7" height="28" rx="2" fill="#1a1a1a" />
      <rect x="36" y="12" width="7" height="28" rx="2" fill="#1a1a1a" />
      {/* Stylobate (bottom horizontal bar) */}
      <rect x="2" y="42" width="48" height="6" rx="2.5" fill="#1a1a1a" />
      {/* Wordmark */}
      <text x="66" y="39" fontFamily="'Inter', sans-serif" fontSize="30" fontWeight="700" fill="#1a1a1a" letterSpacing="-0.5">
        Stoabase
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   AUTONOMOUS SCROLL SPY COMPONENT
   ══════════════════════════════════════════════════════ */
const MOCK_SERVICES: Record<string, string[]> = {
  "AutonomousOps": ["Workflow Engine", "Data Service", "Document Parsing"],
  "RevenueAI": ["AI & LLM Services", "Workflow Engine", "Unified Tracking"],
  "AgentWorkforce": ["AI & LLM Services", "User Management", "Workflow Engine"],
  "SupplyChainOS": ["Data Service", "Workflow Engine", "Advanced Features"],
  "ComplianceAI": ["Document Parsing", "AI & LLM Services", "Workflow Engine"],
  "GrowthEngine": ["Media Generation", "AI & LLM Services", "Workflow Engine"]
};

function TypingScrollspyCommand({ text, isActive }: { text: string; isActive: boolean }) {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText(text);
      return;
    }

    let active = true;
    const runTyping = async () => {
      setDisplayedText("");
      await new Promise(r => setTimeout(r, 400));
      for (let i = 0; i <= text.length; i++) {
        if (!active) return;
        setDisplayedText(text.slice(0, i));
        await new Promise(r => setTimeout(r, 20 + Math.random() * 15));
      }
    };
    runTyping();

    return () => { active = false; };
  }, [isActive, text]);

  return (
    <div className="stoa-scrollspy-command">
      {displayedText}
      <span className={`stoa-inline-cursor ${isActive ? 'active' : ''}`} />
    </div>
  );
}

function CinematicAppDemo({ appName }: { appName: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setCurrentStep(0);
    setFading(false);
  }, [appName]);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setFading(true);
      const swapTimer = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % 4);
        setFading(false);
      }, 380);
      return () => clearTimeout(swapTimer);
    }, 2800);
    return () => clearTimeout(showTimer);
  }, [currentStep]);

  const S = ({ children, bg = "#f8fafc" }: { children: React.ReactNode; bg?: string }) => (
    <svg viewBox="0 0 180 110" width="100%" style={{ display: "block", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.06)", background: bg }}>
      {children}
    </svg>
  );

  type Step = { icon: string; label: string; service: string; serviceColor: string; detail: string; result: string; resultColor: string; svg: React.ReactNode; };

  const STEPS_BY_APP: Record<string, Step[]> = {
    "2D RPG Studio": [
      {
        icon: "🗣️", label: "Prompt", service: "LLM Service", serviceColor: "#a78bfa",
        detail: "\"Build an autonomous 2D pixel RPG game\"",
        result: "Blueprint generated", resultColor: "#3b82f6",
        svg: <S bg="#0f172a">
          <rect x="8" y="8" width="164" height="94" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <circle cx="20" cy="19" r="3" fill="#ff5f56" /> <circle cx="31" cy="19" r="3" fill="#ffbd2e" /> <circle cx="42" cy="19" r="3" fill="#27c93f" />
          <rect x="8" y="27" width="164" height="1" fill="#334155" />
          <text x="16" y="46" fontSize="8" fill="#a78bfa" fontFamily="monospace">$ stoabase build</text>
          <text x="16" y="60" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">→ "Build an autonomous</text>
          <text x="16" y="72" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">   2D pixel RPG game"</text>
          <text x="16" y="86" fontSize="8" fill="#34d399" fontFamily="monospace">✓ Blueprint generated</text>
          <text x="16" y="98" fontSize="6" fill="#475569" fontFamily="monospace">Spinning up services...</text>
        </S>
      },
      {
        icon: "🎨", label: "Generate Assets", service: "Image API", serviceColor: "#22d3ee",
        detail: "16-bit characters, tilesets, sprite sheets",
        result: "48 sprites ready", resultColor: "#0ea5e9",
        svg: <S>
          <text x="8" y="16" fontSize="7.5" fontWeight="700" fill="#0f172a">Sprite Sheet · Auto-Generated</text>
          <rect x="8" y="20" width="164" height="1" fill="#e2e8f0" />
          {[0, 1, 2, 3].map(col => [0, 1, 2, 3].map(row => (
            <rect key={`${col}-${row}`} x={10 + col * 42} y={24 + row * 20} width="36" height="16" rx="3" fill={["#bfdbfe", "#bbf7d0", "#fde68a", "#f9a8d4"][col]} opacity="0.85" />
          )))}
          <text x="10" y="107" fontSize="6.5" fill="#64748b">Idle · Walk · Attack · Cast · 12 chars × 4 states</text>
        </S>
      },
      {
        icon: "🗺️", label: "Build World", service: "Workflow Engine", serviceColor: "#f472b6",
        detail: "Procedural quests, NPC logic, loot tables",
        result: "5 zones populated", resultColor: "#db2777",
        svg: <S>
          <rect x="8" y="8" width="164" height="86" rx="5" fill="#dbeafe" />
          <rect x="14" y="14" width="50" height="38" rx="4" fill="#86efac" opacity="0.9" />
          <text x="39" y="37" textAnchor="middle" fontSize="7" fill="#14532d" fontWeight="700">Forest</text>
          <rect x="70" y="14" width="44" height="38" rx="4" fill="#fde68a" opacity="0.9" />
          <text x="92" y="37" textAnchor="middle" fontSize="7" fill="#78350f" fontWeight="700">Desert</text>
          <rect x="120" y="14" width="46" height="38" rx="4" fill="#c7d2fe" opacity="0.9" />
          <text x="143" y="37" textAnchor="middle" fontSize="7" fill="#3730a3" fontWeight="700">Castle</text>
          <rect x="14" y="58" width="152" height="14" rx="3" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
          <text x="90" y="68" textAnchor="middle" fontSize="6.5" fill="#166534">5 zones · 23 NPCs · 140 quests generated</text>
          <rect x="14" y="78" width="152" height="14" rx="3" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="90" y="88" textAnchor="middle" fontSize="6.5" fill="#64748b">Boss AI logic loaded · Loot tables seeded</text>
          <text x="90" y="107" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#db2777">5 zones populated ✓</text>
        </S>
      },
      {
        icon: "🚀", label: "Go Live", service: "Unified Tracking", serviceColor: "#34d399",
        detail: "Live-ops, event dispatch, CDN deploy",
        result: "1,200 players online", resultColor: "#059669",
        svg: <S bg="#0f172a">
          <rect x="8" y="8" width="164" height="94" rx="6" fill="#064e3b" stroke="#065f46" strokeWidth="1" />
          <circle cx="18" cy="20" r="5" fill="#34d399" />
          <text x="28" y="24" fontSize="8" fontWeight="700" fill="#34d399">LIVE</text>
          <text x="118" y="24" fontSize="7" fill="#6ee7b7">19:42 UTC</text>
          <text x="12" y="44" fontSize="10" fontWeight="700" fill="#fff">1,200</text>
          <text x="12" y="55" fontSize="6.5" fill="#6ee7b7">Active Players</text>
          <text x="80" y="44" fontSize="10" fontWeight="700" fill="#fff">98ms</text>
          <text x="80" y="55" fontSize="6.5" fill="#6ee7b7">Avg Latency</text>
          <text x="140" y="44" fontSize="10" fontWeight="700" fill="#fff">3</text>
          <text x="134" y="55" fontSize="6.5" fill="#6ee7b7">Zones Live</text>
          {[0, 1, 2, 3, 4, 5, 6].map(i => <rect key={i} x={12 + i * 22} y={88 - (12 + i * 5)} width="16" height={12 + i * 5} rx="2" fill="#34d399" opacity="0.75" />)}
        </S>
      },
    ],
    "MatchMaker AI": [
      {
        icon: "🗣️", label: "Prompt", service: "LLM Service", serviceColor: "#a78bfa",
        detail: "\"Build an AI-first dating app that actually works\"",
        result: "Core UX designed", resultColor: "#3b82f6",
        svg: <S bg="#0f172a">
          <rect x="8" y="8" width="164" height="94" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <circle cx="20" cy="19" r="3" fill="#ff5f56" /> <circle cx="31" cy="19" r="3" fill="#ffbd2e" /> <circle cx="42" cy="19" r="3" fill="#27c93f" />
          <rect x="8" y="27" width="164" height="1" fill="#334155" />
          <text x="16" y="46" fontSize="8" fill="#a78bfa" fontFamily="monospace">$ stoabase build</text>
          <text x="16" y="60" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">→ "Build an AI-first</text>
          <text x="16" y="72" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">   dating app"</text>
          <text x="16" y="86" fontSize="8" fill="#34d399" fontFamily="monospace">✓ UX flows generated</text>
          <text x="16" y="98" fontSize="6" fill="#475569" fontFamily="monospace">Vector DB initialising…</text>
        </S>
      },
      {
        icon: "🧠", label: "Learn Preferences", service: "Knowledge Mgmt", serviceColor: "#f472b6",
        detail: "User vectors built from interactions & interests",
        result: "12M profiles indexed", resultColor: "#db2777",
        svg: <S>
          <text x="8" y="16" fontSize="7.5" fontWeight="700" fill="#0f172a">User Profile Vector</text>
          {[["Outdoor", 0.85], ["Coffee", 0.92], ["Travel", 0.76], ["Music", 0.60], ["Hiking", 0.88]].map(([label, val], i) => (
            <g key={i}>
              <text x="8" y={32 + (i as number) * 16} fontSize="6.5" fill="#64748b">{label as string}</text>
              <rect x="54" y={24 + (i as number) * 16} width="108" height="7" rx="3.5" fill="#f1f5f9" />
              <rect x="54" y={24 + (i as number) * 16} width={108 * (val as number)} height="7" rx="3.5" fill="#f472b6" opacity="0.8" />
              <text x="166" y={32 + (i as number) * 16} fontSize="6.5" fill="#db2777" fontWeight="600">{Math.round((val as number) * 100)}%</text>
            </g>
          ))}
          <rect x="8" y="100" width="164" height="8" rx="3" fill="#fdf2f8" />
          <text x="90" y="106" textAnchor="middle" fontSize="5.5" fill="#db2777">12M profiles indexed · Vector DB live</text>
        </S>
      },
      {
        icon: "💬", label: "Match & Message", service: "Workflow Engine", serviceColor: "#22d3ee",
        detail: "Vector similarity → curated list → icebreaker AI",
        result: "98% match quality", resultColor: "#0ea5e9",
        svg: <S>
          <rect x="8" y="8" width="78" height="94" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="47" cy="34" r="16" fill="#bfdbfe" />
          <text x="47" y="39" textAnchor="middle" fontSize="13">😊</text>
          <text x="47" y="60" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0f172a">Alex, 28</text>
          <rect x="16" y="66" width="62" height="16" rx="5" fill="#f472b6" opacity="0.15" />
          <text x="47" y="77" textAnchor="middle" fontSize="7" fill="#db2777" fontWeight="700">98% Match</text>
          <rect x="94" y="8" width="78" height="94" rx="6" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
          <text x="133" y="24" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#0369a1">Icebreaker AI</text>
          <rect x="100" y="30" width="66" height="28" rx="4" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
          <text x="133" y="45" textAnchor="middle" fontSize="6" fill="#334155">"I heard you hiked</text>
          <text x="133" y="54" textAnchor="middle" fontSize="6" fill="#334155">Yosemite last month?"</text>
          <rect x="100" y="64" width="66" height="28" rx="4" fill="#0ea5e9" opacity="0.1" stroke="#bae6fd" strokeWidth="1" />
          <text x="133" y="81" textAnchor="middle" fontSize="6" fill="#0369a1">Send to Alex →</text>
          <text x="90" y="107" textAnchor="middle" fontSize="6" fill="#0ea5e9" fontWeight="600">Message sent · Conversation started</text>
        </S>
      },
      {
        icon: "📈", label: "Optimise Retention", service: "Unified Tracking", serviceColor: "#34d399",
        detail: "Behavioral analytics, A/B-tested nudges",
        result: "+42% 30-day retention", resultColor: "#059669",
        svg: <S>
          <text x="8" y="14" fontSize="7.5" fontWeight="700" fill="#0f172a">30-Day Retention</text>
          <line x1="18" y1="90" x2="172" y2="90" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="18" y1="90" x2="18" y2="20" stroke="#e2e8f0" strokeWidth="1" />
          <polyline points="18,78 50,74 82,70 114,65 146,61 172,58" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
          <polyline points="18,78 50,68 82,56 114,44 146,36 172,28" fill="none" stroke="#34d399" strokeWidth="2.5" />
          <circle cx="172" cy="28" r="4" fill="#34d399" />
          <text x="162" y="22" fontSize="6.5" fill="#059669" fontWeight="700">+42%</text>
          <text x="20" y="102" fontSize="6" fill="#94a3b8">Day 1</text>
          <text x="82" y="102" fontSize="6" fill="#94a3b8">Day 15</text>
          <text x="152" y="102" fontSize="6" fill="#94a3b8">Day 30</text>
          <text x="90" y="109" textAnchor="middle" fontSize="6" fill="#059669" fontWeight="600">Nudge campaigns running · A/B winner deployed</text>
        </S>
      },
    ],
    "Alpha Quant": [
      {
        icon: "🗣️", label: "Prompt", service: "LLM Service", serviceColor: "#a78bfa",
        detail: "\"Build an autonomous investment tracking app\"",
        result: "Strategy drafted", resultColor: "#3b82f6",
        svg: <S bg="#0f172a">
          <rect x="8" y="8" width="164" height="94" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <circle cx="20" cy="19" r="3" fill="#ff5f56" /> <circle cx="31" cy="19" r="3" fill="#ffbd2e" /> <circle cx="42" cy="19" r="3" fill="#27c93f" />
          <rect x="8" y="27" width="164" height="1" fill="#334155" />
          <text x="16" y="46" fontSize="8" fill="#a78bfa" fontFamily="monospace">$ stoabase build</text>
          <text x="16" y="60" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">→ "Autonomous investment</text>
          <text x="16" y="72" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">   tracking app"</text>
          <text x="16" y="86" fontSize="8" fill="#34d399" fontFamily="monospace">✓ Strategy drafted</text>
          <text x="16" y="98" fontSize="6" fill="#475569" fontFamily="monospace">Connecting market feeds…</text>
        </S>
      },
      {
        icon: "📡", label: "Ingest Markets", service: "Data Service", serviceColor: "#22d3ee",
        detail: "Real-time prices, SEC filings, social sentiment",
        result: "14 sources live", resultColor: "#0ea5e9",
        svg: <S>
          <text x="8" y="14" fontSize="7.5" fontWeight="700" fill="#0f172a">Live Market Feed</text>
          {[["AAPL", "+1.2%", "#10b981", "$182.40"], ["TSLA", "-0.8%", "#ef4444", "$248.10"], ["NVDA", "+3.4%", "#10b981", "$875.20"], ["MSFT", "+0.6%", "#10b981", "$420.30"], ["AMZN", "+1.8%", "#10b981", "$186.90"]].map(([ticker, change, color, price], i) => (
            <g key={i}>
              <rect x="8" y={18 + (i as number) * 18} width="164" height="16" rx="3" fill={(i as number) % 2 === 0 ? "#f8fafc" : "#fff"} />
              <text x="14" y={30 + (i as number) * 18} fontSize="7" fontWeight="700" fill="#0f172a">{ticker}</text>
              <text x="80" y={30 + (i as number) * 18} fontSize="6.5" fill="#64748b">{price}</text>
              <rect x="132" y={20 + (i as number) * 18} width="34" height="12" rx="3" fill={color as string} opacity="0.15" />
              <text x="149" y={30 + (i as number) * 18} textAnchor="middle" fontSize="6.5" fontWeight="600" fill={color as string}>{change}</text>
            </g>
          ))}
          <text x="90" y="108" textAnchor="middle" fontSize="6" fill="#64748b">14 sources · Price · SEC · Sentiment · News</text>
        </S>
      },
      {
        icon: "🤖", label: "Run AI Analysis", service: "Workflow Engine", serviceColor: "#f472b6",
        detail: "Earnings summaries, risk scoring, signal gen",
        result: "BUY / SELL alerts", resultColor: "#db2777",
        svg: <S>
          <text x="8" y="14" fontSize="7.5" fontWeight="700" fill="#0f172a">AI Signal Engine</text>
          <rect x="8" y="18" width="78" height="68" rx="5" fill="#fdf2f8" stroke="#f9a8d4" strokeWidth="1" />
          <text x="47" y="36" textAnchor="middle" fontSize="8" fontWeight="700" fill="#831843">SELL</text>
          <text x="47" y="52" textAnchor="middle" fontSize="13">📉</text>
          <text x="47" y="68" textAnchor="middle" fontSize="6" fill="#9f1239">WDGT · C-Suite exit</text>
          <text x="47" y="79" textAnchor="middle" fontSize="5.5" fill="#be123c">Confidence: 94%</text>
          <rect x="94" y="18" width="78" height="68" rx="5" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
          <text x="133" y="36" textAnchor="middle" fontSize="8" fontWeight="700" fill="#14532d">BUY</text>
          <text x="133" y="52" textAnchor="middle" fontSize="13">📈</text>
          <text x="133" y="68" textAnchor="middle" fontSize="6" fill="#166534">AAPL · Q3 beat</text>
          <text x="133" y="79" textAnchor="middle" fontSize="5.5" fill="#15803d">Confidence: 88%</text>
          <rect x="8" y="92" width="164" height="14" rx="3" fill="#fef9c3" />
          <text x="90" y="102" textAnchor="middle" fontSize="6" fill="#854d0e">Risk Score: 3.2/10 · Action recommended</text>
          <text x="90" y="109" textAnchor="middle" fontSize="5.5" fill="#92400e">Portfolio exposure within limits ✓</text>
        </S>
      },
      {
        icon: "💰", label: "Auto-Execute", service: "Unified Tracking", serviceColor: "#34d399",
        detail: "Portfolio rebalanced, P&L tracked, audit stored",
        result: "+18% YTD alpha", resultColor: "#059669",
        svg: <S bg="#0f172a">
          <rect x="8" y="8" width="164" height="94" rx="6" fill="#022c22" stroke="#065f46" strokeWidth="1" />
          <text x="12" y="26" fontSize="7" fontFamily="monospace" fill="#6ee7b7">09:31:02 SELL 500×WDGT @ $12.40</text>
          <text x="12" y="38" fontSize="7" fontFamily="monospace" fill="#a7f3d0">09:31:03 Capital freed: $6,200</text>
          <text x="12" y="50" fontSize="7" fontFamily="monospace" fill="#6ee7b7">09:31:04 BUY 38×AAPL @ $161.80</text>
          <text x="12" y="62" fontSize="7" fontFamily="monospace" fill="#a7f3d0">09:31:05 Portfolio rebalanced ✓</text>
          <text x="12" y="74" fontSize="7" fontFamily="monospace" fill="#6ee7b7">09:31:06 Audit log stored</text>
          <rect x="8" y="80" width="164" height="18" rx="4" fill="#065f46" />
          <text x="90" y="92" textAnchor="middle" fontSize="8" fontWeight="700" fill="#34d399" fontFamily="monospace">+18% YTD Alpha · Audit logged</text>
        </S>
      },
    ],
  };

  const steps: Step[] = STEPS_BY_APP[appName] ?? STEPS_BY_APP["2D RPG Studio"];
  const step = steps[currentStep];

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", fontFamily: "'Inter', sans-serif", background: "#f8fafc", display: "flex", flexDirection: "column", boxSizing: "border-box", position: "relative" }}>

      {/* Top bar: label + step dots */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px 6px", flexShrink: 0 }}>
        <div style={{ fontSize: "8.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Building with Stoabase
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ width: i === currentStep ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === currentStep ? s.serviceColor : "#e2e8f0", transition: "all 0.4s ease" }} />
          ))}
        </div>
      </div>

      {/* Step card — single view, fade in/out */}
      <div style={{ flex: 1, padding: "0 14px 12px", opacity: fading ? 0 : 1, transform: fading ? "translateY(6px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease", display: "flex", flexDirection: "column", gap: "8px", overflow: "hidden", minHeight: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: step.serviceColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>
              {step.icon}
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{step.label}</div>
              <div style={{ fontSize: "8px", color: "#94a3b8" }}>Step {currentStep + 1} of {steps.length}</div>
            </div>
          </div>
          <div style={{ fontSize: "8px", fontWeight: 600, color: step.serviceColor, background: step.serviceColor + "18", padding: "3px 8px", borderRadius: "6px", flexShrink: 0 }}>{step.service}</div>
        </div>

        {/* SVG wireframe */}
        <div style={{ flex: 1, borderRadius: "8px", overflow: "hidden", minHeight: 0 }}>
          {step.svg}
        </div>

        {/* Detail + result */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: "9px", color: "#64748b", lineHeight: 1.5, marginBottom: "5px" }}>{step.detail}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: step.resultColor, flexShrink: 0 }} />
            <div style={{ fontSize: "10px", fontWeight: 700, color: step.resultColor }}>{step.result}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "#f1f5f9", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <div
          key={`${appName}-${currentStep}`}
          style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            background: step.serviceColor,
            animation: "cinematic-progress 3.18s linear forwards",
          }}
        />
      </div>
      <style>{`@keyframes cinematic-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}


// ScrollSpyMockDemo removed

function AutonomousScrollSpy() {
  const [activeIndex, setActiveIndex] = useState(0);

  const bizData = BUSINESS_TABS.find(t => t.id === "yourbiz");

  const handleScroll = useCallback(() => {
    const items = document.querySelectorAll('.stoa-scrollspy-item');
    let closestIndex = 0;
    let minDistance = Infinity;
    const centerY = window.innerHeight / 2;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - centerY);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(prev => (prev === closestIndex ? prev : closestIndex));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!bizData) return null;
  const activeApp = bizData.apps[activeIndex];

  return (
    <div className="stoa-scrollspy-section" id="autonomous">
      {/* ── Desktop Typing Bar (Absolute positioned) ── */}
      <div className="stoa-desktop-spy-typing hidden lg:flex">
        <div className="stoa-typing-bar">
          <span className="stoa-typing-bar-cursor" />
        </div>
      </div>
      {/* ── Mobile Scrolling Header ── */}
      <div className="stoa-mobile-spy-header">
        <div className="stoa-mobile-spy-scroll">
          {bizData.apps.map((app, i) => (
            <button
              key={app.name}
              className={`stoa-mobile-spy-btn ${activeIndex === i ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              {app.name}
            </button>
          ))}
        </div>
      </div>

      <div className="stoa-scrollspy-layout" style={{ position: "relative" }}>

        {/* Left Sticky Preview (was Right) */}
        <div className="stoa-scrollspy-right">
          <div className="stoa-mock-window">
            <div className="stoa-mock-header">
              <div className="stoa-mock-dots">
                <div className="stoa-mock-dot red" />
                <div className="stoa-mock-dot yellow" />
                <div className="stoa-mock-dot green" />
              </div>
            </div>

            <div className="stoa-mock-body">
              <div className="stoa-mock-svg-wrap">
                <CinematicAppDemo appName={activeApp.name} />
              </div>
            </div>
          </div>

          {/* Mobile Description (Mobile Only) */}
          <div className="stoa-mobile-spy-desc">
            <h3>{activeApp.name}</h3>
            <p>{activeApp.desc}</p>
            <TypingScrollspyCommand text={activeApp.prompt} isActive={true} />
          </div>
        </div>

        {/* Right Scrolling List (was Left) */}
        <div className="stoa-scrollspy-left">
          {bizData.apps.map((app, i) => (
            <div key={app.name} className={`stoa-scrollspy-item ${activeIndex === i ? 'active' : ''}`}>
              <h3>{app.name}</h3>
              <p>{app.desc}</p>
              <TypingScrollspyCommand text={app.prompt} isActive={activeIndex === i} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════ */
export default function StoaOnePager() {
  const [activeTab, setActiveTab] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

  const mainBizTabs = BUSINESS_TABS.filter(t => t.id !== "yourbiz");
  const currentBiz = mainBizTabs[activeTab];

  return (
    <div className="stoa-page">
      {/* ── Ambient orbs ── */}
      <div className="stoa-orb stoa-orb-1" />
      <div className="stoa-orb stoa-orb-2" />
      <div className="stoa-orb stoa-orb-3" />

      {/* ── Floating particles ── */}
      {[
        { top: "12%", left: "8%", delay: "0s", dur: "7s" },
        { top: "24%", left: "85%", delay: "1s", dur: "6s" },
        { top: "55%", left: "15%", delay: "2s", dur: "8s" },
        { top: "70%", left: "78%", delay: "0.5s", dur: "5s" },
        { top: "88%", left: "42%", delay: "1.5s", dur: "7s" },
        { top: "35%", left: "60%", delay: "3s", dur: "6s" },
      ].map((p, i) => (
        <div
          key={i}
          className="stoa-particle"
          style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
        />
      ))}

      {/* ── Sticky Nav ── */}
      <nav className="stoa-nav">
        <div className="stoa-nav-inner">
          <a className="stoa-nav-logo" href="#" onClick={e => { e.preventDefault(); scrollTo("hero"); }}>
            <StoaLogoBlack size={28} />
          </a>
          {/* Desktop links */}
          <div className="stoa-nav-links">
            <a className="stoa-nav-link" href="#" onClick={e => { e.preventDefault(); scrollTo("cost"); }}>0 to 100</a>
            <a className="stoa-nav-link" href="#" onClick={e => { e.preventDefault(); scrollTo("how"); }}>How it works</a>
            <a className="stoa-nav-link" href="#" onClick={e => { e.preventDefault(); scrollTo("apps"); }}>Apps</a>
            <a className="stoa-nav-link" href="#" onClick={e => { e.preventDefault(); scrollTo("platform"); }}>Platform</a>
            <a className="stoa-nav-link" href="#" onClick={e => { e.preventDefault(); scrollTo("cta"); }}>Contact</a>
          </div>
          {/* Mobile hamburger */}
          <button className="stoa-nav-hamburger" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Menu">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {/* Mobile dropdown — always mounted, shown via CSS */}
        <div className={`stoa-nav-mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
          <a className="stoa-nav-mobile-link" href="#" onClick={e => { e.preventDefault(); scrollTo("cost"); }}>0 to 100</a>
          <a className="stoa-nav-mobile-link" href="#" onClick={e => { e.preventDefault(); scrollTo("how"); }}>How it works</a>
          <a className="stoa-nav-mobile-link" href="#" onClick={e => { e.preventDefault(); scrollTo("apps"); }}>Apps</a>
          <a className="stoa-nav-mobile-link" href="#" onClick={e => { e.preventDefault(); scrollTo("platform"); }}>Platform</a>
          <a className="stoa-nav-mobile-link" href="#" onClick={e => { e.preventDefault(); scrollTo("cta"); }}>Contact</a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          SECTION 1: HERO
          ═══════════════════════════════════════════════ */}
      <section className="stoa-hero" id="hero">
        <Reveal>
          <div className="stoa-hero-tag">
            <Sparkles size={14} /> PROMPT TO GROW
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1>
            Build and Scale your <span className="accent">Business</span>.<br />
            By prompt.
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="stoa-hero-sub">
            Not just one app — an entire automated business from a prompt.
            Storefront, accounting, support, operations — every layer of your company
            built by AI, running together, sharing context.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <TypingPrompt />
        </Reveal>

        <Reveal delay={4}>
          <div className="stoa-hero-cta">
            <div className="stoa-tooltip-wrap">
              <a href="#" className="stoa-btn-primary" onClick={e => e.preventDefault()} style={{ pointerEvents: 'none', opacity: 0.85 }}>
                Join Waitlist <ArrowRight size={16} />
              </a>
              <span className="stoa-tooltip">Coming soon</span>
            </div>
            <a href="mailto:hello@stoabase.ai" className="stoa-btn-secondary">
              Get in Touch
            </a>
          </div>
        </Reveal>

        <Reveal delay={5}>
          <div className="stoa-badge-row">
            <span className="stoa-badge"><Shield size={12} /> No Code Required</span>
            <span className="stoa-badge"><Zap size={12} /> 12+ AI Modules</span>
            <span className="stoa-badge"><BarChart3 size={12} /> Production-Proven</span>
          </div>
        </Reveal>
      </section>

      <div className="stoa-section-divider" />

      {/* ═══════════════════════════════ DARK ZONE START ═══ */}
      <div className="stoa-dark-section">

        {/* ═══════════════════════════════════════════════
          SECTION 1.5: 10% COST — TEST & LAUNCH
          ═══════════════════════════════════════════════ */}
        <section className="stoa-section stoa-cost-section" id="cost">
          <Reveal>
            <div className="stoa-showcase-heading">
              <h2>Test & launch at<br /><span className="accent">10% the cost</span>.</h2>
              <p>
                Stop burning runway on dev teams and infrastructure.
                Stoabase lets you test, iterate, and launch a real AI-native business
                at a fraction of the traditional cost.
              </p>
            </div>
          </Reveal>

          <div className="stoa-cost-grid">
            {/* Big 10% number */}
            <Reveal delay={1}>
              <div className="stoa-cost-hero-num">
                <span className="stoa-cost-big"><CountUp end={10} start={99} suffix="%" duration={1800} /></span>
                <span className="stoa-cost-of">of the effort.<br />of the budget.<br />of the time.</span>
              </div>
            </Reveal>

            {/* Comparison cards */}
            <Reveal delay={2}>
              <div className="stoa-cost-compare">
                <div className="stoa-cost-card stoa-cost-old">
                  <div className="stoa-cost-card-header">Traditional</div>
                  {[
                    { label: "Budget", value: "$500K+", pct: 100 },
                    { label: "Timeline", value: "6–12 months", pct: 100 },
                    { label: "Team", value: "12+ people", pct: 100 },
                    { label: "Infra", value: "Build everything", pct: 100 },
                  ].map(r => (
                    <div key={r.label} className="stoa-cost-row">
                      <span className="stoa-cost-label">{r.label}</span>
                      <div className="stoa-cost-bar-track">
                        <div className="stoa-cost-bar stoa-cost-bar-old" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="stoa-cost-val stoa-cost-val-old">{r.value}</span>
                    </div>
                  ))}
                </div>

                <div className="stoa-cost-card stoa-cost-new">
                  <div className="stoa-cost-card-header stoa-cost-header-new">
                    Stoabase <Sparkles size={14} />
                  </div>
                  {(() => {
                    const rows = [
                      { label: "Budget", value: "$50K", pct: 10 },
                      { label: "Timeline", value: "1 day", pct: 8 },
                      { label: "Team", value: "1 person + AI", pct: 10 },
                      { label: "Infra", value: "Included", pct: 5 },
                    ];
                    return rows.map((r, idx) => <AnimatedCostRow key={r.label} label={r.label} value={r.value} pct={r.pct} delay={2000 + idx * 150} />);
                  })()}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={3}>
            <p className="stoa-cost-bottom">
              Same product. Same users. Same AI intelligence.<br />
              <strong style={{ color: "var(--slate-100)" }}>Just 10× cheaper to prove it works.</strong>
            </p>
          </Reveal>
        </section>

        <div className="stoa-section-divider" />

        {/* ═══════════════════════════════════════════════
          SECTION 1.6: SCALE TO UNICORN
          ═══════════════════════════════════════════════ */}
        <section className="stoa-section stoa-scale-section" id="scale">
          <Reveal>
            <div className="stoa-showcase-heading">
              <h2>Scale 1 to 100.<br /><span className="accent">From prototype to unicorn.</span></h2>
              <p>
                Start with one AI app. Prove it works. Then scale to an entire product suite
                — all sharing users, data, and intelligence. That's how you build a billion-dollar business.
              </p>
            </div>
          </Reveal>

          <div className="stoa-scale-timeline">
            {[
              { phase: "Launch", apps: "1 app", rev: "$0 → $10K MRR", icon: "🚀", color: "#a78bfa", desc: "Validate your idea in weeks, not months" },
              { phase: "Product-Market Fit", apps: "3 apps", rev: "$50K MRR", icon: "📈", color: "#60a5fa", desc: "Expand with complementary AI products" },
              { phase: "Growth Engine", apps: "10 apps", rev: "$500K MRR", icon: "⚡", color: "#4ade80", desc: "Full AI-native business suite running autonomously" },
              { phase: "Unicorn", apps: "∞ apps", rev: "$1B+ valuation", icon: "🦄", color: "#f472b6", desc: "Platform effects compound. Every app makes every other app better." },
            ].map((step, i) => (
              <Reveal key={step.phase} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="stoa-scale-card" style={{ "--sc-color": step.color } as React.CSSProperties}>
                  <div className="stoa-scale-icon">{step.icon}</div>
                  <div className="stoa-scale-phase">{step.phase}</div>
                  <div className="stoa-scale-apps" style={{ color: step.color }}>{step.apps}</div>
                  <div className="stoa-scale-rev">{step.rev}</div>
                  <div className="stoa-scale-desc">{step.desc}</div>
                  {i < 3 && <div className="stoa-scale-arrow">→</div>}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={5}>
            <div className="stoa-scale-bar-wrap">
              <div className="stoa-scale-bar">
                <div className="stoa-scale-bar-fill" />
              </div>
              <div className="stoa-scale-bar-labels">
                <span>Week 1</span>
                <span>Month 3</span>
                <span>Year 1</span>
                <span>Year 3</span>
              </div>
            </div>
          </Reveal>
        </section>

      </div>
      {/* ═══════════════════════════════════════ DARK ZONE END ═══ */}

      <div className="stoa-section-divider" />

      {/* ═══════════════════════════════════════════════
          SECTION 3: HOW IT WORKS
          ═══════════════════════════════════════════════ */}
      <section className="stoa-section" id="how">
        <Reveal>
          <div className="stoa-showcase-heading">
            <h2>From idea to production<br />in one prompt.</h2>
            <p>No infrastructure. No dev team. Just describe what you need.</p>
          </div>
        </Reveal>

        <div className="stoa-steps">
          <Reveal delay={1}>
            <div className="stoa-step">
              <div className="stoa-step-num">1</div>
              <h3>Describe your app</h3>
              <p>Type a prompt. "Build me an AI nutrition tracker with meal scanning." That's it — plain English.</p>
              <svg viewBox="0 0 200 80" fill="none" style={{ marginTop: 16, width: "100%" }}>
                {/* Input box */}
                <rect x="8" y="16" width="184" height="48" rx="12" fill="#fff" stroke="#7c3aed" strokeWidth="1.5" />
                {/* Placeholder text lines */}
                <rect x="20" y="30" width="100" height="6" rx="3" fill="#c4b5fd" opacity="0.6" />
                <rect x="20" y="42" width="72" height="5" rx="2.5" fill="#c4b5fd" opacity="0.35" />
                {/* Cursor */}
                <rect x="124" y="28" width="2" height="10" rx="1" fill="#7c3aed">
                  <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
                </rect>
                {/* Send button */}
                <rect x="158" y="24" width="26" height="32" rx="8" fill="#7c3aed" />
                <text x="171" y="44" textAnchor="middle" fontSize="13" fill="#fff">→</text>
                {/* glow under button */}
                <ellipse cx="171" cy="62" rx="12" ry="4" fill="#7c3aed" opacity="0.18" />
              </svg>
              <span className="stoa-step-arrow">→</span>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="stoa-step">
              <div className="stoa-step-num">2</div>
              <h3>AI builds your stack</h3>
              <p>Stoabase wires up the right AI models, data layer, knowledge base, user roles, and analytics — automatically.</p>
              <svg viewBox="0 0 200 100" fill="none" style={{ marginTop: 16, width: "100%" }}>
                {/* Service tiles */}
                {(["LLM", "RAG", "Auth", "Data"] as const).map((l, i) => {
                  const colors = ["#7c3aed", "#2563eb", "#059669", "#d97706"];
                  const bgOps = [0.12, 0.1, 0.1, 0.1];
                  return (
                    <g key={l}>
                      <rect x={10 + i * 47} y={8} width="40" height="36" rx="8" fill={colors[i]} opacity={bgOps[i]} stroke={colors[i]} strokeWidth="1" />
                      <rect x={10 + i * 47} y={8} width="40" height="36" rx="8" fill="#fff" opacity="0.5" />
                      <text x={30 + i * 47} y={30} textAnchor="middle" fontSize="8" fontWeight="700" fill={colors[i]}>{l}</text>
                    </g>
                  );
                })}
                {/* Connector lines */}
                <line x1="30" y1="44" x2="30" y2="58" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
                <line x1="77" y1="44" x2="77" y2="58" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
                <line x1="124" y1="44" x2="124" y2="58" stroke="#059669" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
                <line x1="171" y1="44" x2="171" y2="58" stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
                {/* Runtime bar */}
                <rect x="10" y="58" width="180" height="28" rx="8" fill="#7c3aed" opacity="0.9" />
                <text x="100" y="76" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" letterSpacing="0.5">Stoabase Runtime</text>
                <circle cx="22" cy="72" r="3" fill="#a78bfa" opacity="0.7">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
              <span className="stoa-step-arrow">→</span>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <div className="stoa-step">
              <div className="stoa-step-num">3</div>
              <h3>Deploy &amp; grow</h3>
              <p>Your app is live. Add more apps to your workspace — they all share context, users, and AI capabilities.</p>
              <svg viewBox="0 0 200 100" fill="none" style={{ marginTop: 16, width: "100%" }}>
                {/* Card background */}
                <rect x="20" y="4" width="160" height="88" rx="14" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Header */}
                <rect x="20" y="4" width="160" height="28" rx="14" fill="#f0fdf4" />
                <rect x="20" y="18" width="160" height="14" fill="#f0fdf4" />
                <circle cx="36" cy="18" r="5" fill="#4ade80" />
                <text x="48" y="22" fontSize="7" fontWeight="700" fill="#16a34a">Business powered by AI</text>
                {/* Live badge */}
                <rect x="140" y="12" width="28" height="12" rx="6" fill="#dcfce7" />
                <text x="154" y="21" textAnchor="middle" fontSize="6" fontWeight="700" fill="#16a34a">LIVE</text>
                <circle cx="143" cy="18" r="2" fill="#4ade80">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
                {/* App tiles */}
                {(["App 1", "App 2", "App 3"] as const).map((l, i) => (
                  <g key={l}>
                    <rect x={30 + i * 50} y={40} width="42" height="34" rx="8" fill={["#ede9fe", "#dbeafe", "#dcfce7"][i]} stroke={["#7c3aed", "#2563eb", "#16a34a"][i]} strokeWidth="0.8" strokeOpacity="0.3" />
                    <text x={51 + i * 50} y={60} textAnchor="middle" fontSize="7" fontWeight="600" fill={["#7c3aed", "#2563eb", "#16a34a"][i]}>{l}</text>
                  </g>
                ))}
                {/* Footer */}
                <text x="100" y="86" textAnchor="middle" fontSize="6" fill="#94a3b8">Shared context · Shared users</text>
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="stoa-section-divider" />

      {/* ═══════════════════════════════════════════════
          SECTION 4: TRACTION + COMPANY SHOWCASE
          ═══════════════════════════════════════════════ */}
      <section className="stoa-section">
        <Reveal>
          <div className="stoa-showcase-heading">
            <h2>Already in production.</h2>
            <p>Education proved the platform. Healthcare confirmed it scales.</p>
          </div>
        </Reveal>

        <div className="stoa-stats">
          {[
            { end: 213, suffix: "M+", label: "Tokens Processed" },
            { end: 20, suffix: "+", label: "AI Models" },
            { end: 200, suffix: "+", label: "Active Agents" },
            { end: 100, suffix: "k+", label: "User Records" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div className="stoa-stat">
                <div className="stoa-stat-value">
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div className="stoa-stat-label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Company App Showcase ── */}
        <div style={{ marginTop: 64 }}>
          <div className="stoa-light-yellow-section" style={{ borderRadius: 24, overflow: "hidden" }}>
            <section className="stoa-section" id="apps" style={{ paddingTop: 24, paddingBottom: 48 }}>

              {/* ── Business Tabs ── */}
              <Reveal delay={1}>
                <div className="stoa-biz-tabs">
                  {mainBizTabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      className={`stoa-biz-tab ${activeTab === i ? "active" : ""}`}
                      style={{ "--tab-color": tab.color } as React.CSSProperties}
                      onClick={() => setActiveTab(i)}
                    >
                      {tab.logo ? (
                        <img src={tab.logo} alt={tab.label} className="stoa-biz-tab-logo" />
                      ) : (
                        <span className="stoa-biz-tab-emoji">{tab.emoji}</span>
                      )}
                    </button>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={2}>
                <p className="stoa-biz-subline" style={{ color: currentBiz.color }}>
                  {currentBiz.subline}
                </p>
              </Reveal>

              {/* ── App grid for active tab ── */}
              <div className="stoa-app-grid" key={currentBiz.id}>
                {currentBiz.apps.map((app, i) => (
                  <Reveal key={app.name} delay={Math.min(i + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}>
                    <CinematicAppCard app={app} />
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <div className="stoa-quote">
                  "One business. Many apps. Every app shares users, knowledge, memory,
                  and analytics — that's building an AI-native company."
                </div>
              </Reveal>
            </section>
          </div>
        </div>

        {/* ── ScrollSpy ── */}
        {/* ── Company showcase heading above ScrollSpy ── */}
        <Reveal>
          <div className="stoa-showcase-heading" style={{ marginTop: 64, marginBottom: 16 }}>
            <h2>Everything you need to run<br />an autonomous company.</h2>
            <p>
              One platform. Multiple businesses. Each with a full suite of AI apps
              — all sharing context, users, and intelligence.
            </p>
          </div>
        </Reveal>

        <AutonomousScrollSpy />

      </section>




      {/* ═══════════════════════════════════════════════
          SECTION 5: PLATFORM CAPABILITIES
          ═══════════════════════════════════════════════ */}
      <section className="stoa-section" id="platform">
        <Reveal>
          <div className="stoa-showcase-heading">
            <h2>Everything you need to run<br />an AI-native business.</h2>
            <p>12+ integrated services. One platform. Zero vendor sprawl.</p>
          </div>
        </Reveal>

        <div className="stoa-cap-grid">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.label} delay={Math.min(Math.floor(i / 4) + 1, 3) as 1 | 2 | 3}>
              <div className="stoa-cap-card">
                <div className="stoa-cap-icon"><cap.Icon size={18} /></div>
                <div className="stoa-cap-label">{cap.label}</div>
                <div className="stoa-cap-desc">{cap.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="stoa-section-divider" />

      {/* ═══════════════════════════════════════════════
          SECTION 6: CTA
          ═══════════════════════════════════════════════ */}
      <section className="stoa-cta" id="cta">
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StoaLogoBlack size={48} />
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h2>The foundation for<br />what you build next.</h2>
        </Reveal>
        <Reveal delay={2}>
          <p>One platform. Full AI stack. No Code.</p>
        </Reveal>
        <Reveal delay={3}>
          <div className="stoa-hero-cta">
            <div className="stoa-tooltip-wrap">
              <a href="#" className="stoa-btn-primary" onClick={e => e.preventDefault()} style={{ pointerEvents: 'none', opacity: 0.85 }}>
                Join Waitlist <ArrowRight size={16} />
              </a>
              <span className="stoa-tooltip">Coming soon</span>
            </div>
            <a href="mailto:hello@stoabase.ai" className="stoa-btn-secondary">
              hello@stoabase.ai
            </a>
          </div>
        </Reveal>
        <Reveal delay={4}>
          <p style={{ marginTop: 40, fontSize: "0.8rem", color: "var(--slate-500)" }}>
            stoabase.ai
          </p>
        </Reveal>
      </section>
    </div>
  );
}
