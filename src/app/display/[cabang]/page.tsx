"use client";

import React, { useEffect, useState, useRef, use } from "react";
import { Volume2, VolumeX, Eye, Sparkles, Clock, Megaphone, CheckCircle2, Radio } from "lucide-react";

interface DisplayData {
  branch: {
    id: string;
    kode: string;
    nama: string;
  };
  currentCalled: {
    id: string;
    noAntrian: number;
    nama: string;
    dipanggilAt?: string;
  } | null;
  upcomingQueue: Array<{
    id: string;
    noAntrian: number;
    nama: string;
  }>;
  serverTime: string;
}

// Nada Jingle Stasiun Kereta Api (Authentic Tubular Bell Chime)
function playCatchyRetailChime(isShort = false): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }
      const ctx = new AudioCtx();

      // Station PA System Compressor & Limiter
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, ctx.currentTime);
      compressor.knee.setValueAtTime(20, ctx.currentTime);
      compressor.ratio.setValueAtTime(12, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);
      compressor.connect(ctx.destination);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
      masterGain.connect(compressor);

      // Helper membunyikan tubular chime khas stasiun kereta api
      const playChimeTone = (freq: number, startTime: number, duration: number, volume: number) => {
        // Nada dasar (Fundamental)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        gain1.gain.setValueAtTime(volume, ctx.currentTime + startTime);
        gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);
        osc1.connect(gain1);
        gain1.connect(masterGain);
        osc1.start(ctx.currentTime + startTime);
        osc1.stop(ctx.currentTime + startTime + duration);

        // Harmoni overtone tubular bell (2.76x frekuensi)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 2.76, ctx.currentTime + startTime);
        gain2.gain.setValueAtTime(volume * 0.22, ctx.currentTime + startTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration * 0.65);
        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start(ctx.currentTime + startTime);
        osc2.stop(ctx.currentTime + startTime + duration);
      };

      if (!isShort) {
        // Melodi 4-nada khas stasiun kereta: Sol (G4) -> Do (C5) -> Mi (E5) -> Sol (G5)
        const notes = [
          { freq: 392.00, time: 0.0, dur: 0.55 },  // G4
          { freq: 523.25, time: 0.28, dur: 0.55 }, // C5
          { freq: 659.25, time: 0.56, dur: 0.60 }, // E5
          { freq: 783.99, time: 0.86, dur: 0.95 }, // G5 (panjang berekor)
        ];

        notes.forEach(({ freq, time, dur }) => {
          playChimeTone(freq, time, dur, 0.48);
        });

        setTimeout(() => resolve(), 1700);
      } else {
        // Nada pendek 2-nada untuk panggilan ke-2 dan ke-3: Mi (E5) -> Sol (G5)
        const shortNotes = [
          { freq: 659.25, time: 0.0, dur: 0.45 },
          { freq: 783.99, time: 0.24, dur: 0.85 },
        ];

        shortNotes.forEach(({ freq, time, dur }) => {
          playChimeTone(freq, time, dur, 0.45);
        });

        setTimeout(() => resolve(), 1000);
      }
    } catch {
      resolve();
    }
  });
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function DisplayCabangPage({
  params,
}: {
  params: Promise<{ cabang: string }>;
}) {
  const resolvedParams = use(params);
  const cabangParam = resolvedParams.cabang;

  const [data, setData] = useState<DisplayData | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Default dan otomatis gunakan ElevenLabs dengan model Alice (Penyiar Resmi Stasiun)
  const [voiceEngine, setVoiceEngine] = useState<"indonesia" | "elevenlabs">("elevenlabs");
  const [elevenLabsActive, setElevenLabsActive] = useState(true);
  const [selectedElevenVoice] = useState("Xb7hH8MSUJpSbSDYk0k2"); // Alice


  // Counter 3x calls: 0 (idle), 1, 2, 3, 4 (selesai)
  const [callIteration, setCallIteration] = useState<number>(0);

  const lastCalledIdRef = useRef<string | null>(null);
  const isCallingRef = useRef<boolean>(false);

  // Check ElevenLabs availability on mount
  useEffect(() => {
    fetch("/api/tts")
      .then((r) => r.json())
      .then((data) => {
        if (data.available) {
          setElevenLabsActive(true);
        }
      })
      .catch((e) => console.log("ElevenLabs check error:", e));
  }, []);

  // Digital clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Preload and monitor available voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    function updateVoiceList() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    }

    updateVoiceList();
    window.speechSynthesis.onvoiceschanged = updateVoiceList;
  }, []);

  // Find the most natural, energetic Indonesian female voice
  function getBestBroadcasterVoice(): SpeechSynthesisVoice | null {
    if (availableVoices.length === 0) return null;

    const idVoices = availableVoices.filter(
      (v) => v.lang.toLowerCase().includes("id") || v.lang.toLowerCase().includes("indonesia")
    );

    // Google Bahasa Indonesia (Very natural, fluent female voice in Chrome/Android TV)
    const googleIdVoice = idVoices.find((v) => v.name.toLowerCase().includes("google"));
    if (googleIdVoice) return googleIdVoice;

    // Microsoft Gadis Online / Natural
    const gadisVoice = idVoices.find((v) => v.name.toLowerCase().includes("gadis"));
    if (gadisVoice) return gadisVoice;

    // Any female Indonesian voice
    const femaleIdVoice = idVoices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("wanita") ||
        v.name.toLowerCase().includes("siti") ||
        v.name.toLowerCase().includes("putri")
    );
    if (femaleIdVoice) return femaleIdVoice;

    if (idVoices.length > 0) return idVoices[0];

    const generalFemale = availableVoices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("natural") ||
        v.name.toLowerCase().includes("zira")
    );
    return generalFemale || availableVoices[0];
  }

  // Play ElevenLabs audio blob directly through HTML5 Audio element
  function playAudioBlob(blob: Blob): Promise<void> {
    return new Promise((resolve) => {
      try {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.volume = 1.0;
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.play().catch(() => resolve());
      } catch {
        resolve();
      }
    });
  }

  // Speak using browser SpeechSynthesis (Fallback)
  function speakWithBrowserSpeech(text: string): Promise<void> {
    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";

        // ENERGETIC, CERIA & FUN: Tempo lincah (0.95), intonasi cerah, artikulasi tegas
        utterance.rate = 0.95;

        // VOKAL WANITA CERIA: Pitch 1.08 (vokal wanita segar, ramah, dan energik)
        utterance.pitch = 1.08;

        // VOLUME PENUH (100%)
        utterance.volume = 1.0;

        const voice = getBestBroadcasterVoice();
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  // Speak single sentence using ElevenLabs AI Studio Voice (or fallback to browser)
  async function speakSentence(text: string): Promise<void> {
    if (voiceEngine === "elevenlabs") {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voiceId: selectedElevenVoice,
          }),
        });

        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("audio")) {
          const blob = await res.blob();
          await playAudioBlob(blob);
          return;
        }
      } catch (err) {
        console.warn("ElevenLabs audio fetch failed, falling back to browser speech:", err);
      }
    }

    // Fallback if ElevenLabs is not selected, key not provided, or failed
    return speakWithBrowserSpeech(text);
  }

  // Helper eja nomor antrian dalam bahasa Indonesia (contoh: 1 -> "nol nol satu")
  function formatQueueNumberSpoken(num: number): string {
    const digits = String(num).padStart(3, "0").split("");
    const digitWords: Record<string, string> = {
      "0": "nol",
      "1": "satu",
      "2": "dua",
      "3": "tiga",
      "4": "empat",
      "5": "lima",
      "6": "enam",
      "7": "tujuh",
      "8": "delapan",
      "9": "sembilan",
    };
    const words = digits.map((d) => digitWords[d] || d).join(", ");
    return `nomor antrian, ${words}`;
  }

  // ALUR 2X PANGGILAN GAYA PENYIAR KERETA API (ALICE AI RESMI)
  async function triggerTripleCall(noAntrian: number, nama: string) {
    if (!speechEnabled || typeof window === "undefined" || isCallingRef.current) {
      return;
    }

    isCallingRef.current = true;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const queueSpoken = formatQueueNumberSpoken(noAntrian);

      // PANGGILAN 1 (Gaya Penyiar Stasiun KAI - Artikulasi Jelas, Sopan & Berwibawa)
      setCallIteration(1);
      await playCatchyRetailChime(false);
      await delay(400);
      await speakSentence(
        `Pelanggan yang kami hormati. ${queueSpoken}. Atas nama, ${nama}. Silakan memasuki ruangan periksa mata.`
      );
      await delay(2500); // Jeda 2.5 detik

      // PANGGILAN 2 (TERAKHIR)
      setCallIteration(2);
      await playCatchyRetailChime(true);
      await delay(300);
      await speakSentence(
        `Sekali lagi, panggilan untuk ${queueSpoken}. Atas nama, ${nama}. Silakan segera memasuki ruangan periksa mata. Terima kasih.`
      );

      // Selesai 2x panggilan
      setCallIteration(3);
    } catch (e) {
      console.warn("Call error:", e);
    } finally {
      isCallingRef.current = false;
    }
  }

  // Poll queue data every 3 seconds
  useEffect(() => {
    let isMounted = true;

    async function fetchQueue() {
      try {
        const res = await fetch(`/api/display/${cabangParam}`);
        if (!res.ok) return;
        const json: DisplayData = await res.json();

        if (isMounted) {
          setData(json);

          if (json.currentCalled && json.currentCalled.id !== lastCalledIdRef.current) {
            lastCalledIdRef.current = json.currentCalled.id;
            triggerTripleCall(json.currentCalled.noAntrian, json.currentCalled.nama);
          }
        }
      } catch (err) {
        console.error("Display poll error:", err);
      }
    }

    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [cabangParam, speechEnabled, availableVoices]);

  // Unlock audio
  function handleUnlockAudio() {
    setAudioUnlocked(true);
    playCatchyRetailChime(false);
    if (data?.currentCalled) {
      triggerTripleCall(data.currentCalled.noAntrian, data.currentCalled.nama);
    } else {
      triggerTripleCall(1, "Ayu Wardani");
    }
  }

  // Test sound function
  function handleTestSound() {
    const testNum = data?.currentCalled?.noAntrian || 1;
    const testName = data?.currentCalled?.nama || "Ayu Wardani";
    triggerTripleCall(testNum, testName);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden relative font-sans">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar (Apple iPadOS / tvOS Style) */}
      <header className="flex items-center justify-between border-b border-emerald-900/10 pb-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="h-10 w-auto flex items-center">
            {/* Official Optik I See You Brand Logo */}
            <img
              src="/brand/logo-isy-dark.png"
              alt="Optik I See You"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="border-l border-emerald-900/15 pl-4 hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-emerald-950">
              Antrian Cek Mata
            </h1>
            <p className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mt-0.5">
              Cabang {data?.branch?.nama || cabangParam.toUpperCase()} • IRIS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Logo 'for every you' on the right */}
          <div className="hidden md:flex items-center mr-2">
            <img
              src="/brand/logo-for-every-you.png"
              alt="for every you"
              className="h-5 w-auto object-contain opacity-90"
            />
          </div>

          {/* Suara AI Status: Alice - Penyiar Stasiun (Tanpa Emoji) */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/90 border border-emerald-900/10 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-800" />
            <span className="text-xs font-semibold text-emerald-950 tracking-tight">
              Penyiar Alice AI
            </span>
          </div>

          {/* Test Sound Button */}
          <button
            onClick={handleTestSound}
            title="Uji coba 2x pemanggilan suara penyiar stasiun & lonceng"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50/50 border border-emerald-900/15 hover:border-emerald-700/40 text-emerald-950 font-semibold text-xs shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5 text-emerald-800" />
            <span>Tes Suara</span>
          </button>

          {/* Audio unlock / status */}
          {!audioUnlocked ? (
            <button
              onClick={handleUnlockAudio}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs shadow-apple-subtle animate-pulse cursor-pointer transition-all duration-150 active:scale-[0.98]"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Aktifkan Audio TV</span>
            </button>
          ) : (
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 border border-emerald-900/10 text-emerald-900 text-xs hover:bg-white transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm"
            >
              {speechEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="font-semibold text-emerald-950">Audio Aktif (2x)</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-semibold text-rose-700">Audio Senyap</span>
                </>
              )}
            </button>
          )}

          {/* Clock */}
          <div className="text-right ml-2 pl-3 border-l border-emerald-900/15">
            <div className="text-2xl font-mono tabular-nums font-black tracking-tight text-emerald-950">
              {currentTime || "--:--:--"}
            </div>
            <div className="text-[11px] text-emerald-800/80 font-semibold tracking-wide">
              WIB • Realtime
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Split Screen Display (Apple HIG Clean Ivory Glass) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-stretch relative z-10">
        {/* Left Column (8 cols): Current Calling Person (HERO DISPLAY) */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-emerald-900/10 flex flex-col justify-between shadow-[0_12px_40px_-8px_rgba(6,78,59,0.06)] relative overflow-hidden">
          {/* Subtle Emerald Accent Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-900" />

          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sedang Dipanggil ke Ruang Periksa</span>
              </div>

              {/* Status Panggilan 2x Counter (No Emojis) */}
              {callIteration > 0 && callIteration <= 2 && (
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-900 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-sm animate-pulse">
                  <Megaphone className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Panggilan ke-{callIteration} dari 2</span>
                </div>
              )}
              {callIteration === 3 && (
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Panggilan Selesai • Silakan Masuk</span>
                </div>
              )}
            </div>

            {data?.currentCalled ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                  <span className="text-sm font-bold tracking-wider uppercase text-emerald-900/60">
                    Nomor Antrian
                  </span>
                  <span className="text-8xl md:text-9xl font-mono tabular-nums font-black text-emerald-900 tracking-tight leading-none drop-shadow-sm">
                    #{String(data.currentCalled.noAntrian).padStart(3, "0")}
                  </span>
                </div>

                <div className="pt-4 border-t border-emerald-900/10">
                  <span className="text-xs font-bold text-emerald-900/60 uppercase tracking-wider block mb-2">
                    Atas Nama Pelanggan
                  </span>
                  <h2 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tight leading-tight">
                    {data.currentCalled.nama}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-800" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
                  Menunggu Panggilan Pemeriksaan
                </h3>
                <p className="text-sm font-medium text-emerald-900/60 mt-2 max-w-md mx-auto">
                  Petugas refraksi akan memanggil nomor antrian berikutnya secara berurutan.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-[#F7F4EB] border border-emerald-900/10 flex items-center justify-between text-xs text-emerald-900 font-medium">
            <span>Pemeriksaan Mata (Refraksi Optometri)</span>
            <span className="font-mono text-emerald-900 font-bold">
              Ruang Refraksi 1 • Alice AI Otomatis
            </span>
          </div>
        </div>

        {/* Right Column (4 cols): Next Queue (Apple List Design) */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-emerald-900/10 flex flex-col justify-between shadow-[0_12px_40px_-8px_rgba(6,78,59,0.06)]">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-emerald-950">
                Antrian Berikutnya
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                {data?.upcomingQueue?.length || 0} Menunggu
              </span>
            </div>

            <div className="space-y-3">
              {data?.upcomingQueue && data.upcomingQueue.length > 0 ? (
                data.upcomingQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#FDFBF7] border border-emerald-900/10 hover:border-emerald-700/40 transition-all flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-900 flex items-center justify-center font-mono font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-base text-emerald-950">
                          {item.nama}
                        </p>
                        <span className="text-[11px] text-emerald-800/70 font-semibold">
                          Harap bersiap
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-mono tabular-nums font-black text-emerald-900">
                        #{String(item.noAntrian).padStart(3, "0")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-xs font-medium text-emerald-900/50">
                  Tidak ada antrian berikutnya saat ini.
                </div>
              )}
            </div>
          </div>

          <div className="text-center p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-[11px] text-emerald-950 font-semibold mt-6">
            Layar ini beroperasi otomatis secara real-time.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between text-xs text-emerald-900/60 border-t border-emerald-900/10 pt-4 relative z-10">
        <div className="font-medium">
          Optik I See You — Cabang {data?.branch?.nama || cabangParam.toUpperCase()} • IRIS — I See You Retail & Information System
        </div>
        <div>
          <img
            src="/brand/logo-for-every-you.png"
            alt="for every you"
            className="h-4 w-auto object-contain opacity-80"
          />
        </div>
      </footer>
    </div>
  );
}
