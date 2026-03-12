/**
 * useDeckAudio — Custom hook for podcast-style TTS playback on the pitch deck.
 *
 * Uses Azure TTS via gameSDK.textToSpeech with a specific voice ID:
 *   Denny  → zh-CN-YunyiMultilingualNeural (multilingual — works for EN, SC, TC)
 *
 * Features:
 *   - Pre-fetches the NEXT segment while the current one is playing (eliminates gaps)
 *   - Karaoke-style word highlight via word boundary events
 *   - Falls back to ResponsiveVoice if GameSDK is unavailable
 */

import { useState, useRef, useCallback, useEffect } from "react";
import {
  DECK_PODCAST_SCRIPT,
  type DeckPodcastSegment,
} from "./deckPodcastScript";

declare global {
  interface Window {
    responsiveVoice?: {
      speak: (
        text: string,
        voice: string,
        opts?: Record<string, unknown>,
      ) => void;
      cancel: () => void;
      isPlaying: () => boolean;
    };
  }
}

interface UseDeckAudioReturn {
  /** Whether audio mode is active */
  isActive: boolean;
  /** Whether currently speaking */
  isPlaying: boolean;
  /** Current segment index */
  currentIdx: number;
  /** Total segments */
  totalSegments: number;
  /** Current segment (or null) */
  currentSegment: DeckPodcastSegment | null;
  /** Whether TTS is loading (waiting for first audio chunk) */
  isLoading: boolean;
  /** Highlight progress 0-100 for karaoke text sweep */
  highlightPct: number;
  /** Start / resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  toggle: () => void;
  /** Skip to next segment */
  next: () => void;
  /** Go to previous segment */
  prev: () => void;
  /** Jump to a specific segment */
  jumpTo: (idx: number) => void;
  /** Turn audio mode on/off */
  setActive: (v: boolean) => void;
  /** Close and cleanup */
  close: () => void;
}

/** Azure voice IDs per language */
const AZURE_VOICES: Record<string, { denny: string }> = {
  en: { denny: "en-US-ChristopherMultilingualNeural" },
  "zh-CN": {
    denny: "zh-CN-YunyiMultilingualNeural",
  },
  "zh-TW": {
    denny: "zh-CN-YunyiMultilingualNeural",
  },
};

/** ResponsiveVoice fallback voices per language */
const RV_VOICE_MAP: Record<string, { denny: string }> = {
  en: { denny: "US English Male" },
  "zh-CN": { denny: "Chinese Taiwan Male" },
  "zh-TW": {
    denny: "Chinese (Hong Kong) Male",
  },
};

/** Resolve DeckLang → Azure language code */
const AZURE_LANG_MAP: Record<string, string> = {
  en: "en-US",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-HK",
};

export type DeckLang = "en" | "zh-CN" | "zh-TW";

/* ── Prefetch cache types ── */
interface PrefetchedAudio {
  blob: Blob;
  wordBoundaries: { offset: number; word: string }[];
}

export function useDeckAudio(
  goToSlide: (i: number) => void,
  lang: DeckLang = "en",
): UseDeckAudioReturn {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightPct, setHighlightPct] = useState(0);

  const isPlayingRef = useRef(false);
  const currentIdxRef = useRef(0);
  const stoppedRef = useRef(false);
  /** Cleanup function for the current TTS (calls pause + unsubscribe) */
  const ttsCleanupRef = useRef<(() => void) | null>(null);
  /** Prefetch cache: key is segment index, value is the pre-generated audio */
  const prefetchCache = useRef<Map<number, PrefetchedAudio>>(new Map());
  /** Track in-flight prefetch to avoid duplicates */
  const prefetchInFlight = useRef<Set<number>>(new Set());

  const segments = DECK_PODCAST_SCRIPT;

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    currentIdxRef.current = currentIdx;
  }, [currentIdx]);

  /** Stop current TTS cleanly */
  const stopTTS = useCallback(() => {
    if (ttsCleanupRef.current) {
      ttsCleanupRef.current();
      ttsCleanupRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(
    () => () => {
      stoppedRef.current = true;
      stopTTS();
      window.responsiveVoice?.cancel();
      prefetchCache.current.clear();
      prefetchInFlight.current.clear();
    },
    [stopTTS],
  );

  /** Map DeckLang to the segment key */
  const langKey = lang === "zh-CN" ? "zhCN" : lang === "zh-TW" ? "zhTW" : "en";
  const azureLang = AZURE_LANG_MAP[lang] || "en-US";

  /** Track if this is the first render (skip restart on mount) */
  const isFirstLangRef = useRef(true);
  /** Ref to latest speakSegment so the lang-change effect can call it */
  const speakSegmentRef = useRef<(idx: number) => void>(() => { });

  /* ── Helper: generate TTS and return combined audio blob + word boundaries ── */
  const generateTTSAudio = useCallback(
    async (segIdx: number): Promise<PrefetchedAudio | null> => {
      if (!window.gameSDK || segIdx >= segments.length) return null;

      const seg = segments[segIdx];
      const text = seg[langKey];
      const azureVoices = AZURE_VOICES[lang] || AZURE_VOICES.en;
      const voice = azureVoices.denny;

      try {
        const ttsPromise = (window.gameSDK as any).textToSpeech(text.speech, {
          voice,
          language: azureLang,
        });
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("textToSpeech timed out after 15s")), 15000)
        );
        const tts = await Promise.race([ttsPromise, timeout]);
        tts.pause(); // prevent SDK auto-play

        return new Promise<PrefetchedAudio | null>((resolve) => {
          const chunks: any[] = [];
          const wordBoundaries: { offset: number; word: string }[] = [];
          let chunkDurationAccum = 0;

          tts.subscribe((event: any) => {
            if (event.event === "on_tts_audio_chunk") {
              chunks.push(event.data.audio);
              if (event.data.wordBoundary && Array.isArray(event.data.wordBoundary)) {
                for (const wb of event.data.wordBoundary) {
                  wordBoundaries.push({
                    offset: (wb.audioOffset ?? wb.offset ?? 0) / 10000 + chunkDurationAccum,
                    word: wb.text ?? wb.word ?? "",
                  });
                }
              }
              const chunkData = event.data.audio?.data || event.data.audio;
              if (chunkData) {
                const bytes = chunkData.length || chunkData.byteLength || 0;
                const audioBytes = Math.max(0, bytes - 44);
                chunkDurationAccum += (audioBytes / 2 / 16000) * 1000;
              }
            } else if (event.event === "on_tts_audio_end") {
              if (chunks.length > 0) {
                try {
                  const combinedData: number[] = [];
                  for (let i = 0; i < chunks.length; i++) {
                    const chunkData = chunks[i].data || chunks[i];
                    const uint8 = new Uint8Array(chunkData);
                    if (i === 0) {
                      combinedData.push(...uint8);
                    } else {
                      combinedData.push(...uint8.slice(44));
                    }
                  }
                  const combined = new Uint8Array(combinedData);
                  // Fix WAV header sizes
                  const fileSize = combined.length - 8;
                  combined[4] = fileSize & 0xff;
                  combined[5] = (fileSize >> 8) & 0xff;
                  combined[6] = (fileSize >> 16) & 0xff;
                  combined[7] = (fileSize >> 24) & 0xff;
                  const dataSize = combined.length - 44;
                  combined[40] = dataSize & 0xff;
                  combined[41] = (dataSize >> 8) & 0xff;
                  combined[42] = (dataSize >> 16) & 0xff;
                  combined[43] = (dataSize >> 24) & 0xff;

                  const blob = new Blob([combined], { type: "audio/wav" });
                  resolve({ blob, wordBoundaries });
                } catch {
                  resolve(null);
                }
              } else {
                resolve(null);
              }
            } else if (event.event === "on_tts_error" || event.event === "error") {
              console.error("[DeckAudio] Prefetch TTS error:", event.data?.error);
              resolve(null);
            }
          });
        });
      } catch (err) {
        console.error("[DeckAudio] Prefetch TTS failed:", err);
        return null;
      }
    },
    [segments, lang, langKey, azureLang],
  );

  /* ── Helper: start prefetching a segment (non-blocking) ── */
  const prefetchSegment = useCallback(
    (segIdx: number) => {
      if (
        segIdx >= segments.length ||
        prefetchCache.current.has(segIdx) ||
        prefetchInFlight.current.has(segIdx) ||
        stoppedRef.current
      ) {
        return;
      }

      prefetchInFlight.current.add(segIdx);
      console.log(`[DeckAudio] Prefetching segment ${segIdx}...`);

      generateTTSAudio(segIdx).then((result) => {
        prefetchInFlight.current.delete(segIdx);
        if (result && !stoppedRef.current) {
          prefetchCache.current.set(segIdx, result);
          console.log(`[DeckAudio] Segment ${segIdx} prefetched ✓`);
        }
      });
    },
    [segments.length, generateTTSAudio],
  );

  /* ── Helper: play a PrefetchedAudio result for a given segment index ── */
  const playCachedAudio = useCallback(
    (idx: number, cached: PrefetchedAudio) => {
      const seg = segments[idx];
      goToSlide(seg.slideIndex);

      const url = URL.createObjectURL(cached.blob);
      const audio = new Audio(url);

      // Karaoke highlight
      const totalWB = cached.wordBoundaries.length;
      if (totalWB > 0) {
        audio.ontimeupdate = () => {
          const ms = audio.currentTime * 1000;
          let spoken = 0;
          for (let w = 0; w < totalWB; w++) {
            if (ms >= cached.wordBoundaries[w].offset) spoken = w + 1;
            else break;
          }
          setHighlightPct(Math.round((spoken / totalWB) * 100));
        };
      } else {
        audio.ontimeupdate = () => {
          if (audio.duration > 0) {
            setHighlightPct(Math.round((audio.currentTime / audio.duration) * 100));
          }
        };
      }

      ttsCleanupRef.current = () => {
        audio.pause();
        URL.revokeObjectURL(url);
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        ttsCleanupRef.current = null;
        setHighlightPct(100);
        if (!stoppedRef.current && isPlayingRef.current) {
          speakSegmentRef.current(idx + 1);
        }
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        ttsCleanupRef.current = null;
        setIsPlaying(false);
      };

      setCurrentIdx(idx);
      setHighlightPct(0);
      setIsLoading(false);
      audio.play().catch(() => setIsPlaying(false));

      // Pre-fetch NEXT segment while this one plays
      prefetchSegment(idx + 1);
    },
    [segments, goToSlide, prefetchSegment],
  );

  /** Speak a single segment, then auto-advance on end */
  const speakSegment = useCallback(
    async (idx: number) => {
      if (stoppedRef.current || idx >= segments.length) {
        setIsPlaying(false);
        return;
      }

      const seg = segments[idx];
      const text = seg[langKey];
      setIsPlaying(true);

      // Auto-advance slide
      goToSlide(seg.slideIndex);

      // Stop any in-progress TTS
      stopTTS();

      // ── Check prefetch cache first ──
      const cached = prefetchCache.current.get(idx);
      if (cached) {
        console.log(`[DeckAudio] Playing segment ${idx} from cache ⚡`);
        prefetchCache.current.delete(idx);
        playCachedAudio(idx, cached);
        return;
      }

      // ── Generate live (not cached) ──
      if (window.gameSDK) {
        try {
          setIsLoading(true);
          const azureVoices = AZURE_VOICES[lang] || AZURE_VOICES.en;
          const voice = azureVoices.denny;

          console.log("[DeckAudio] Calling textToSpeech:", { text: text.speech.substring(0, 50), voice, language: azureLang });

          const ttsPromise = (window.gameSDK as any).textToSpeech(text.speech, {
            voice,
            language: azureLang,
          });

          const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("textToSpeech timed out after 10s")), 10000)
          );
          const tts = await Promise.race([ttsPromise, timeout]);

          // Immediately pause SDK's internal RemoteAudioSynthesizer — we handle playback
          tts.pause();

          const chunks: any[] = [];
          const wordBoundaries: { offset: number; word: string }[] = [];
          let chunkDurationAccum = 0; // accumulate duration across chunks

          tts.subscribe((event: any) => {
            if (event.event === "on_tts_audio_chunk") {
              setIsLoading(false);
              chunks.push(event.data.audio);
              // Collect word boundaries with accumulated time offset
              if (event.data.wordBoundary && Array.isArray(event.data.wordBoundary)) {
                for (const wb of event.data.wordBoundary) {
                  wordBoundaries.push({
                    offset: (wb.audioOffset ?? wb.offset ?? 0) / 10000 + chunkDurationAccum, // convert 100ns ticks to ms, add accumulated
                    word: wb.text ?? wb.word ?? "",
                  });
                }
              }
              // Estimate chunk duration from audio data size (16-bit PCM, 16kHz mono)
              const chunkData = event.data.audio?.data || event.data.audio;
              if (chunkData) {
                const bytes = chunkData.length || chunkData.byteLength || 0;
                const audioBytes = Math.max(0, bytes - 44); // subtract WAV header
                chunkDurationAccum += (audioBytes / 2 / 16000) * 1000; // 16-bit samples, 16kHz → ms
              }
            } else if (event.event === "on_tts_audio_end") {
              // All chunks received — combine and play
              if (chunks.length > 0 && !stoppedRef.current) {
                try {
                  const combinedData: number[] = [];
                  for (let i = 0; i < chunks.length; i++) {
                    const chunkData = chunks[i].data || chunks[i];
                    const uint8 = new Uint8Array(chunkData);
                    if (i === 0) {
                      combinedData.push(...uint8);
                    } else {
                      combinedData.push(...uint8.slice(44));
                    }
                  }

                  const combined = new Uint8Array(combinedData);
                  // Update WAV header: file size
                  const fileSize = combined.length - 8;
                  combined[4] = fileSize & 0xff;
                  combined[5] = (fileSize >> 8) & 0xff;
                  combined[6] = (fileSize >> 16) & 0xff;
                  combined[7] = (fileSize >> 24) & 0xff;
                  // Update WAV header: data size
                  const dataSize = combined.length - 44;
                  combined[40] = dataSize & 0xff;
                  combined[41] = (dataSize >> 8) & 0xff;
                  combined[42] = (dataSize >> 16) & 0xff;
                  combined[43] = (dataSize >> 24) & 0xff;

                  const blob = new Blob([combined], { type: "audio/wav" });
                  const url = URL.createObjectURL(blob);
                  const audio = new Audio(url);

                  // Karaoke highlight: update highlightPct based on playback time
                  const totalWB = wordBoundaries.length;
                  if (totalWB > 0) {
                    audio.ontimeupdate = () => {
                      const ms = audio.currentTime * 1000;
                      // Find how far through the word boundaries we are
                      let spoken = 0;
                      for (let w = 0; w < totalWB; w++) {
                        if (ms >= wordBoundaries[w].offset) spoken = w + 1;
                        else break;
                      }
                      setHighlightPct(Math.round((spoken / totalWB) * 100));
                    };
                  } else {
                    // Fallback: use simple time-based progress
                    audio.ontimeupdate = () => {
                      if (audio.duration > 0) {
                        setHighlightPct(Math.round((audio.currentTime / audio.duration) * 100));
                      }
                    };
                  }

                  ttsCleanupRef.current = () => {
                    audio.pause();
                    URL.revokeObjectURL(url);
                  };

                  audio.onended = () => {
                    URL.revokeObjectURL(url);
                    ttsCleanupRef.current = null;
                    setHighlightPct(100);
                    if (!stoppedRef.current && isPlayingRef.current) {
                      speakSegment(idx + 1);
                    }
                  };
                  audio.onerror = () => {
                    URL.revokeObjectURL(url);
                    ttsCleanupRef.current = null;
                    setIsPlaying(false);
                  };
                  // Set currentIdx now — scrolling text starts with audio
                  setCurrentIdx(idx);
                  setHighlightPct(0);
                  audio.play().catch(() => setIsPlaying(false));

                  // ── Pre-fetch the NEXT segment while this one plays ──
                  prefetchSegment(idx + 1);

                } catch (playErr) {
                  console.error("[DeckAudio] Chunk playback failed:", playErr);
                  setIsPlaying(false);
                }
              } else {
                setIsPlaying(false);
              }
            } else if (
              event.event === "on_tts_error" ||
              event.event === "error"
            ) {
              console.error("[DeckAudio] TTS error:", event.data?.error);
              ttsCleanupRef.current = null;
              setIsLoading(false);
              setIsPlaying(false);
            }
          });

          // Initial cleanup: just unsubscribe (audio cleanup set later when Audio is created)
          ttsCleanupRef.current = () => {
            tts.unsubscribe();
          };

          return;
        } catch (err) {
          console.error("[DeckAudio] textToSpeech failed:", err);
          setIsLoading(false);
          // Fall through to ResponsiveVoice
        }
      }

      // Fallback: ResponsiveVoice if GameSDK unavailable
      if (window.responsiveVoice) {
        setCurrentIdx(idx);
        const voices = RV_VOICE_MAP[lang] || RV_VOICE_MAP.en;
        const rvVoice = voices.denny;
        window.responsiveVoice.speak(text.speech, rvVoice, {
          rate: 1,
          onend: () => {
            if (!stoppedRef.current && isPlayingRef.current) {
              speakSegment(idx + 1);
            }
          },
          onerror: () => setIsPlaying(false),
        });
      }
    },
    [segments, goToSlide, lang, langKey, azureLang, stopTTS, playCachedAudio, prefetchSegment],
  );

  // Keep ref in sync so the lang-change effect can call it
  useEffect(() => {
    speakSegmentRef.current = speakSegment;
  }, [speakSegment]);

  // When language changes mid-playback, restart from the beginning in the new lang
  useEffect(() => {
    if (isFirstLangRef.current) {
      isFirstLangRef.current = false;
      return;
    }
    // Clear prefetch cache on language change
    prefetchCache.current.clear();
    prefetchInFlight.current.clear();

    if (isActive && isPlayingRef.current) {
      stopTTS();
      window.responsiveVoice?.cancel();
      stoppedRef.current = false;
      // Restart from segment 0 when language switches
      requestAnimationFrame(() => {
        speakSegmentRef.current(0);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const play = useCallback(() => {
    stoppedRef.current = false;
    speakSegment(currentIdxRef.current);
  }, [speakSegment]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    stopTTS();
    window.responsiveVoice?.cancel();
  }, [stopTTS]);

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const next = useCallback(() => {
    if (currentIdxRef.current < segments.length - 1) {
      stopTTS();
      window.responsiveVoice?.cancel();
      stoppedRef.current = false;
      speakSegment(currentIdxRef.current + 1);
    }
  }, [segments.length, speakSegment, stopTTS]);

  const prev = useCallback(() => {
    if (currentIdxRef.current > 0) {
      stopTTS();
      window.responsiveVoice?.cancel();
      stoppedRef.current = false;
      speakSegment(currentIdxRef.current - 1);
    }
  }, [speakSegment, stopTTS]);

  const jumpTo = useCallback(
    (idx: number) => {
      stopTTS();
      window.responsiveVoice?.cancel();
      stoppedRef.current = false;
      speakSegment(idx);
    },
    [speakSegment, stopTTS],
  );

  const close = useCallback(() => {
    stoppedRef.current = true;
    setIsPlaying(false);
    setIsActive(false);
    setCurrentIdx(0);
    stopTTS();
    window.responsiveVoice?.cancel();
    prefetchCache.current.clear();
    prefetchInFlight.current.clear();
  }, [stopTTS]);

  return {
    isActive,
    isPlaying,
    currentIdx,
    totalSegments: segments.length,
    currentSegment: segments[currentIdx] ?? null,
    isLoading,
    highlightPct,
    play,
    pause,
    toggle,
    next,
    prev,
    jumpTo,
    setActive: (v: boolean) => {
      setIsActive(v);
      if (!v) close();
    },
    close,
  };
}
