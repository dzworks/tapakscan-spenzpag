import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Html5Qrcode, CameraDevice } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';

// URL Endpoint Google Apps Script Resmi TAPAK
const API_URL = "https://script.google.com/macros/s/AKfycbwkb_jsbOzYkAKSIdKZeU2Ywy3Bjey9M7qygDpEN-mojXNvtNvaV78y2S-G3Swz7qC-/exec";

// Ikon-Ikon SVG Asli
const CameraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const HeartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
  </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const SpinnerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckCircleIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const ClockIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const LocationIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const BookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
  </svg>
);

const NextIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
  </svg>
);

const RefreshIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
  </svg>
);

const AlertIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
  </svg>
);

const WifiOffIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M8.53 16.11a6 6 0 016.95 0M12 20h.01"></path>
  </svg>
);

const DualRadarSweep = ({ speed = 1.8 }: { speed?: number }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
    className="absolute -inset-2.5 pointer-events-none flex items-center justify-center z-10"
  >
    <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="neonRadarGrad1" x1="100%" y1="50%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="neonRadarGrad2" x1="0%" y1="50%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <filter id="neonRadarGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orbit Track */}
      <circle cx="60" cy="60" r="54" stroke="rgba(34, 211, 238, 0.12)" strokeWidth="1.5" />

      {/* Arc 1 */}
      <path
        d="M 114 60 A 54 54 0 0 1 33 106.8"
        stroke="url(#neonRadarGrad1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#neonRadarGlow)"
      />
      {/* Comet Head 1 */}
      <circle cx="114" cy="60" r="2.5" fill="#ffffff" className="drop-shadow-[0_0_6px_#22d3ee]" />

      {/* Arc 2 */}
      <path
        d="M 6 60 A 54 54 0 0 1 87 13.2"
        stroke="url(#neonRadarGrad2)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#neonRadarGlow)"
      />
      {/* Comet Head 2 */}
      <circle cx="6" cy="60" r="2.5" fill="#ffffff" className="drop-shadow-[0_0_6px_#22d3ee]" />
    </svg>
  </motion.div>
);

const CloudSyncIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
  </svg>
);

const HistoryIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const DocumentIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);

const ArrowLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
  </svg>
);

const QrCodeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
  </svg>
);

const SwitchCameraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
  </svg>
);

const CalendarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const InfoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Audio Chime Synthesizer
const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch {
    // audio fallback
  }
};

/**
 * Pengecekan ketat ketersediaan Vibration API & kapabilitas hardware:
 * 1. Lingkungan DOM runtime (window & navigator valid)
 * 2. Feature detection ('vibrate' in navigator)
 * 3. Type checking fungsional (typeof navigator.vibrate === 'function')
 * 4. Document visibility check (mencegah SecurityError saat tab latar belakang)
 * 5. Safe invocation via Function.prototype.call & isolasi try-catch
 */
const isVibrationSupported = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return (
    'vibrate' in navigator && 
    typeof navigator.vibrate === 'function' &&
    typeof (navigator as unknown as { vibrate?: unknown }).vibrate === 'function'
  );
};

const triggerHaptic = (pattern: number | number[] = 70) => {
  // Pengecekan ketat awal sebelum eksekusi
  if (!isVibrationSupported()) {
    return;
  }

  try {
    // Abaikan jika dokumen sedang tidak aktif di latar belakang (mencegah SecurityError di Chromium)
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }

    // Eksekusi getaran dengan pengecekan tipe pattern
    if (typeof pattern === 'number' || Array.isArray(pattern)) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Mengisolasi segala SecurityError, NotAllowedError, atau pengecualian hardware tanpa pernah melempar unhandled exception
  }
};

// Types
interface ScheduleItem {
  id?: string;
  jam_ke: string;
  mapel_ke: string | number;
  jam_mulai: string;
  jam_selesai: string;
  nama_guru: string;
  mata_pelajaran: string;
  nip: string;
  kode_guru: string;
  kode_mapel: string;
  nama_kelas?: string;
  [key: string]: any;
}

export interface HolidayEvent {
  tanggal: string;
  hari?: string;
  keterangan: string;
  jam_mulai?: string;
  jam_selesai?: string;
}

interface LocalCache {
  classes: Record<string, { id_kelas: string; nama_kelas: string; lokasi_ruang: string }>;
  schedules: Record<string, ScheduleItem[]>;
  master_guru: Record<string, { nama: string; nip: string }>;
  master_mapel: Record<string, string>;
  master_ruangan?: Record<string, { nama_ruangan: string; pin: string | number }>;
  hari_libur?: HolidayEvent[];
}

// Helper konversi format "HH:mm" atau "HH.mm" ke total menit
export const timeStrToMinutes = (timeStr?: string): number => {
  if (!timeStr) return -1;
  const parts = timeStr.toString().trim().replace('.', ':').split(':');
  if (parts.length < 2) return -1;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
};

// Helper normalisasi tanggal ke format standar YYYY-MM-DD
export const normalizeDateString = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  if (dateInput instanceof Date) {
    const y = dateInput.getFullYear();
    const m = String(dateInput.getMonth() + 1).padStart(2, '0');
    const d = String(dateInput.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const str = dateInput.toString().trim();
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
  }
  return str.substring(0, 10);
};

// Cek apakah tanggal hari libur / kegiatan cocok dengan target tanggal
export const isHolidayActiveToday = (holiday: HolidayEvent, targetDate: Date = new Date()): boolean => {
  if (!holiday.tanggal) return false;
  const todayStr = normalizeDateString(targetDate);
  const holidayDateStr = normalizeDateString(holiday.tanggal);
  if (todayStr === holidayDateStr) return true;

  const daysOrder = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayDay = daysOrder[targetDate.getDay()];
  if (holiday.hari && holiday.hari.toLowerCase() === todayDay.toLowerCase()) {
    if (!holiday.tanggal || holiday.tanggal === '-') return true;
  }
  return false;
};

// Cek apakah suatu jadwal KBM atau waktu tertentu overlap dengan kegiatan sekolah
export const checkScheduleHolidayOverlap = (
  sched: { jam_mulai?: string; jam_selesai?: string },
  holiday: HolidayEvent,
  targetDate: Date = new Date()
): { isOverlap: boolean; isFullDay: boolean } => {
  if (!isHolidayActiveToday(holiday, targetDate)) {
    return { isOverlap: false, isFullDay: false };
  }

  const hStart = timeStrToMinutes(holiday.jam_mulai);
  const hEnd = timeStrToMinutes(holiday.jam_selesai);

  // Jika jam_mulai & jam_selesai kosong atau "-", artinya berlaku seharian penuh
  if (hStart < 0 && hEnd < 0) {
    return { isOverlap: true, isFullDay: true };
  }

  const sStart = timeStrToMinutes(sched.jam_mulai);
  const sEnd = timeStrToMinutes(sched.jam_selesai);

  if (sStart >= 0 && sEnd >= 0) {
    const effHStart = hStart >= 0 ? hStart : 0;
    const effHEnd = hEnd >= 0 ? hEnd : 24 * 60;
    const overlap = sStart < effHEnd && effHStart < sEnd;
    return { isOverlap: overlap, isFullDay: false };
  }

  const nowMin = targetDate.getHours() * 60 + targetDate.getMinutes();
  const effHStart = hStart >= 0 ? hStart : 0;
  const effHEnd = hEnd >= 0 ? hEnd : 24 * 60;
  const activeNow = nowMin >= effHStart && nowMin <= effHEnd;
  return { isOverlap: activeNow, isFullDay: false };
};

interface ScanResultState {
  id_kelas: string;
  nama_kelas: string;
  lokasi_ruang: string;
  ruang_belajar: string;
  jam_ke: string;
  mapel_ke: string | number;
  kode_guru: string;
  kode_mapel: string;
  teacherName: string;
  nip: string;
  subject: string;
  waktu_mulai: string;
  waktu_selesai: string;
  nextTeacher: { nama: string; mapel: string } | null;
  scan_time?: string;
  timestamp?: string;
  tanggal?: string;
  hari?: string;
  [key: string]: any;
}

interface OfflineQueueItem {
  id: string;
  payload: any;
  timestamp: string;
}

interface HistoryItem {
  id: string;
  nama_kelas: string;
  mapel_ke: string | number;
  teacherName: string;
  subject: string;
  waktu_mulai: string;
  waktu_selesai: string;
  timestamp: string;
  jam_ke?: string;
  jenis_kehadiran?: string;
}

// Versi Aplikasi & Stempel Build Terpadu
export const APP_VERSION = 'v2.6.5';
export const BUILD_NUMBER = 'Build 20261028.2';

export default function App() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  });
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('id-ID', options);
  });
  const [currentDay, setCurrentDay] = useState(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
  });
  
  // Status Proses Pembaruan Service Worker (Update Progress)
  const [appUpdateState, setAppUpdateState] = useState<'downloading' | 'completed' | null>(null);
  const [currentBuildNumber, setCurrentBuildNumber] = useState(BUILD_NUMBER);
  const [updateSuccessToast, setUpdateSuccessToast] = useState<string | null>(null);
  
  const prevDayRef = useRef('');
  
  // Inisialisasi instan (0 detik): Baca langsung cache hari ini dari penyimpanan lokal
  const [localCache, setLocalCache] = useState<LocalCache | null>(() => {
    try {
      const daysOrder = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const today = daysOrder[new Date().getDay()];
      const cached = localStorage.getItem(`tapak_master_v1_${today}`);
      const holidaysCached = localStorage.getItem('tapak_holidays_v1');
      let holidays: HolidayEvent[] | undefined = undefined;
      if (holidaysCached) {
        try { holidays = JSON.parse(holidaysCached); } catch {}
      }
      if (cached) {
        const parsed: LocalCache = JSON.parse(cached);
        if (holidays && (!parsed.hari_libur || parsed.hari_libur.length === 0)) {
          parsed.hari_libur = holidays;
        }
        return parsed;
      }
    } catch {}
    return null;
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>(() => {
    try {
      const daysOrder = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const today = daysOrder[new Date().getDay()];
      const cached = localStorage.getItem(`tapak_master_v1_${today}`);
      if (cached) return 'success';
    } catch {}
    return 'idle';
  }); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<
    'CLOSED' | 'SCANNING' | 'PIN_VERIFICATION' | 'SELECT_CLASS' | 'NO_SCHEDULE' | 'SCHOOL_EVENT' | 'FORM' | 'LOADING' | 'ERROR' | 'SUCCESS' | 'SUCCESS_OFFLINE'
  >('CLOSED');
  const [apiError, setApiError] = useState<string | null>(null);
  const [matchedSchoolEvent, setMatchedSchoolEvent] = useState<HolidayEvent | null>(null);

  // Daftar kegiatan / hari libur sekolah hari ini
  const todayHolidayEvents = useMemo(() => {
    if (!localCache?.hari_libur || !Array.isArray(localCache.hari_libur)) return [];
    const now = new Date();
    return localCache.hari_libur.filter(h => isHolidayActiveToday(h, now));
  }, [localCache?.hari_libur, dateStr]);

  // Kegiatan sekolah yang sedang berlangsung detik ini (baik seharian maupun rentang jam)
  const currentActiveEvent = useMemo(() => {
    const now = new Date();
    for (const h of todayHolidayEvents) {
      const check = checkScheduleHolidayOverlap({}, h, now);
      if (check.isOverlap) return h;
    }
    return null;
  }, [todayHolidayEvents, time]);

  // Tabel Jadwal Master SMP Negeri 1 Pagaden
  // Regular: Senin s/d Kamis (9 Jam Pelajaran + 2 Istirahat)
  // Jumat: 5 Jam Pelajaran + 1 Istirahat
  // Sabtu & Minggu: Libur KBM
  const MASTER_SLOTS_REGULAR = useMemo(() => [
    { jam_ke: '1', label: 'Jam Ke 1', start: '07:00', end: '07:40', startMins: 7 * 60, endMins: 7 * 60 + 40, isBreak: false },
    { jam_ke: '2', label: 'Jam Ke 2', start: '07:40', end: '08:20', startMins: 7 * 60 + 40, endMins: 8 * 60 + 20, isBreak: false },
    { jam_ke: '3', label: 'Jam Ke 3', start: '08:20', end: '09:00', startMins: 8 * 60 + 20, endMins: 9 * 60, isBreak: false },
    { jam_ke: '4', label: 'Jam Ke 4', start: '09:00', end: '09:40', startMins: 9 * 60, endMins: 9 * 60 + 40, isBreak: false },
    { jam_ke: '-', label: 'Istirahat 1', start: '09:40', end: '10:00', startMins: 9 * 60 + 40, endMins: 10 * 60, isBreak: true },
    { jam_ke: '5', label: 'Jam Ke 5', start: '10:00', end: '10:40', startMins: 10 * 60, endMins: 10 * 60 + 40, isBreak: false },
    { jam_ke: '6', label: 'Jam Ke 6', start: '10:40', end: '11:20', startMins: 10 * 60 + 40, endMins: 11 * 60 + 20, isBreak: false },
    { jam_ke: '7', label: 'Jam Ke 7', start: '11:20', end: '12:00', startMins: 11 * 60 + 20, endMins: 12 * 60, isBreak: false },
    { jam_ke: '-', label: 'Istirahat 2', start: '12:00', end: '12:40', startMins: 12 * 60, endMins: 12 * 60 + 40, isBreak: true },
    { jam_ke: '8', label: 'Jam Ke 8', start: '12:40', end: '13:20', startMins: 12 * 60 + 40, endMins: 13 * 60 + 20, isBreak: false },
    { jam_ke: '9', label: 'Jam Ke 9', start: '13:20', end: '14:00', startMins: 13 * 60 + 20, endMins: 14 * 60, isBreak: false }
  ], []);

  const MASTER_SLOTS_FRIDAY = useMemo(() => [
    { jam_ke: '1', label: 'Jam Ke 1', start: '07:30', end: '08:00', startMins: 7 * 60 + 30, endMins: 8 * 60, isBreak: false },
    { jam_ke: '2', label: 'Jam Ke 2', start: '08:00', end: '08:30', startMins: 8 * 60, endMins: 8 * 60 + 30, isBreak: false },
    { jam_ke: '3', label: 'Jam Ke 3', start: '08:30', end: '09:00', startMins: 8 * 60 + 30, endMins: 9 * 60, isBreak: false },
    { jam_ke: '-', label: 'Istirahat', start: '09:00', end: '09:45', startMins: 9 * 60, endMins: 9 * 60 + 45, isBreak: true },
    { jam_ke: '4', label: 'Jam Ke 4', start: '09:45', end: '10:15', startMins: 9 * 60 + 45, endMins: 10 * 60 + 15, isBreak: false },
    { jam_ke: '5', label: 'Jam Ke 5', start: '10:15', end: '10:45', startMins: 10 * 60 + 15, endMins: 10 * 60 + 45, isBreak: false }
  ], []);

  // Deteksi sesi KBM aktif hari ini persis sesuai tabel master SMP Negeri 1 Pagaden
  const currentSessionInfo = useMemo<{
    type: 'ACTIVE' | 'BREAK' | 'OFF_HOURS';
    label: string;
  }>(() => {
    if (currentActiveEvent) {
      return {
        type: 'OFF_HOURS',
        label: currentActiveEvent.keterangan ? currentActiveEvent.keterangan : 'KBM Non-Efektif'
      };
    }

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Minggu, 5 = Jumat, 6 = Sabtu

    // Hari Sabtu dan Minggu adalah libur KBM
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        type: 'OFF_HOURS',
        label: 'Di Luar Jam KBM'
      };
    }

    const currentMins = now.getHours() * 60 + now.getMinutes();
    const activeTable = dayOfWeek === 5 ? MASTER_SLOTS_FRIDAY : MASTER_SLOTS_REGULAR;

    // Cari slot yang cocok
    const matchedSlot = activeTable.find(slot => currentMins >= slot.startMins && currentMins < slot.endMins);

    if (matchedSlot) {
      if (matchedSlot.isBreak) {
        return {
          type: 'BREAK',
          label: `${matchedSlot.label} (${matchedSlot.start} - ${matchedSlot.end})`
        };
      }
      return {
        type: 'ACTIVE',
        label: `Jam Ke ${matchedSlot.jam_ke} (${matchedSlot.start} - ${matchedSlot.end})`
      };
    }

    return {
      type: 'OFF_HOURS',
      label: 'Di Luar Jam KBM'
    };
  }, [currentActiveEvent, MASTER_SLOTS_FRIDAY, MASTER_SLOTS_REGULAR, time]);
  
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const [kegiatan, setKegiatan] = useState('');
  const [kegiatanError, setKegiatanError] = useState(false);
  
  const [isPengganti, setIsPengganti] = useState(false);
  const [penggantiSearch, setPenggantiSearch] = useState('');
  const [selectedPenggantiName, setSelectedPenggantiName] = useState('');
  const [selectedPenggantiId, setSelectedPenggantiId] = useState('');
  const [isPenggantiDropdownOpen, setIsPenggantiDropdownOpen] = useState(false);
  const [penggantiError, setPenggantiError] = useState(false);

  const [scanResult, setScanResult] = useState<ScanResultState | null>(null);
  const [scannedToken, setScannedToken] = useState('');
  const [initialScanTime, setInitialScanTime] = useState('');
  const [isScanSuccess, setIsScanSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualForm, setManualForm] = useState({
    kode_guru: '',
    kode_mapel: '',
    jam_ke: '',
    mapel_ke: '',
    waktu_mulai_hh: '',
    waktu_mulai_mm: '',
    waktu_selesai_hh: '',
    waktu_selesai_mm: ''
  });
  const [manualFormError, setManualFormError] = useState('');
  
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState(false);
  const [sentHistory, setSentHistory] = useState<HistoryItem[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [showOfflineInfoTooltip, setShowOfflineInfoTooltip] = useState(false);
  const [syncBannerStatus, setSyncBannerStatus] = useState<'syncing' | 'success' | 'online' | null>(null);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number } | null>(null);

  // Pull-to-Refresh & Offline Feedback States
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pullStartYRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [offlineToast, setOfflineToast] = useState<string | null>(null);

  // PWA Install Banner & Swipe-Up States
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isIosInstallModalOpen, setIsIosInstallModalOpen] = useState<boolean>(false);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveModalPhase, setLeaveModalPhase] = useState<
    'LEAVE_FORM' | 'LOADING_LEAVE' | 'SUCCESS_LEAVE' | 'SUCCESS_LEAVE_OFFLINE'
  >('LEAVE_FORM');
  const [leaveForm, setLeaveForm] = useState({
    teacherId: '',
    type: 'Sakit',
    isFullDay: false,
    sessions: [] as string[], 
    reason: '',
    assigner: 'Kepala Sekolah'
  });
  const [leaveReasonError, setLeaveReasonError] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);

  const [pinInput, setPinInput] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [pinErrorShake, setPinErrorShake] = useState(false);
  const [dynamicRoomData, setDynamicRoomData] = useState<{ nama_ruangan: string; pin: string | number } | null>(null);

  const teacherList = useMemo(() => {
    return localCache && localCache.master_guru 
      ? Object.entries(localCache.master_guru).map(([id, data]) => ({ id, nama: data.nama, nip: data.nip }))
      : [];
  }, [localCache?.master_guru]);

  const filteredLeaveTeachers = useMemo(() => {
    if (!teacherSearch.trim()) return teacherList;
    const lower = teacherSearch.toLowerCase();
    return teacherList.filter(t => t.nama.toLowerCase().includes(lower));
  }, [teacherList, teacherSearch]);

  const displayedLeaveTeachers = useMemo(() => {
    return filteredLeaveTeachers.slice(0, 15);
  }, [filteredLeaveTeachers]);

  const filteredPenggantiTeachers = useMemo(() => {
    if (!penggantiSearch.trim()) return teacherList;
    const lower = penggantiSearch.toLowerCase();
    return teacherList.filter(t => t.nama.toLowerCase().includes(lower));
  }, [teacherList, penggantiSearch]);

  const displayedPenggantiTeachers = useMemo(() => {
    return filteredPenggantiTeachers.slice(0, 15);
  }, [filteredPenggantiTeachers]);

  const sortedClassGroups = useMemo(() => {
    if (!localCache?.classes) return [];
    const uniqueClasses = Array.from(new Set(Object.values(localCache.classes).map(c => c.nama_kelas)));
    
    const groupedClasses: Record<string, { num: number; classes: string[] }> = {};
    uniqueClasses.forEach(className => {
      const upperName = className.toUpperCase();
      let gradeKey = "Kelas Lainnya";
      let gradeNum = 99; 
      
      if (upperName.includes("VIII")) { gradeKey = "Tingkat 8 (VIII)"; gradeNum = 8; }
      else if (upperName.includes("VII")) { gradeKey = "Tingkat 7 (VII)"; gradeNum = 7; }
      else if (upperName.includes("IX")) { gradeKey = "Tingkat 9 (IX)"; gradeNum = 9; }
      
      if (!groupedClasses[gradeKey]) {
        groupedClasses[gradeKey] = { num: gradeNum, classes: [] };
      }
      groupedClasses[gradeKey].classes.push(className);
    });

    return Object.keys(groupedClasses)
      .sort((a, b) => groupedClasses[a].num - groupedClasses[b].num)
      .map(groupKey => ({
        groupKey,
        classes: groupedClasses[groupKey].classes.sort((a, b) => a.localeCompare(b))
      }));
  }, [localCache?.classes]);

  const getTeacherSchedules = (tId: string) => {
    if (!localCache || !localCache.schedules) return [];
    const schedules: ScheduleItem[] = [];
    const now = new Date();
    for (const className in localCache.schedules) {
      localCache.schedules[className].forEach((sched, index) => {
        if (sched.kode_guru === tId) {
          let isKegiatanSekolah = false;
          let kegiatanName = '';
          if (todayHolidayEvents && todayHolidayEvents.length > 0) {
            for (const h of todayHolidayEvents) {
              const overlap = checkScheduleHolidayOverlap(
                { jam_mulai: sched.jam_mulai, jam_selesai: sched.jam_selesai },
                h,
                now
              );
              if (overlap.isOverlap) {
                isKegiatanSekolah = true;
                kegiatanName = h.keterangan;
                break;
              }
            }
          }
          schedules.push({ 
            ...sched, 
            id: `${className}_${sched.jam_ke}_${index}`, 
            nama_kelas: className,
            isKegiatanSekolah,
            kegiatanName
          });
        }
      });
    }
    schedules.sort((a, b) => {
      if (!a.jam_mulai || !b.jam_mulai) return 0;
      return a.jam_mulai.localeCompare(b.jam_mulai);
    });
    return schedules;
  };

  const currentTeacherSchedules = useMemo(() => {
    if (!leaveForm.teacherId || !localCache?.schedules) return [];
    return getTeacherSchedules(leaveForm.teacherId);
  }, [leaveForm.teacherId, localCache?.schedules, todayHolidayEvents]);

  const handleLeaveSessionToggle = (sessionId: string) => {
    setLeaveForm(prev => {
      const newSessions = prev.sessions.includes(sessionId) 
        ? prev.sessions.filter(id => id !== sessionId)
        : [...prev.sessions, sessionId];
        
      const teacherSchedules = getTeacherSchedules(prev.teacherId);
      const effectiveSchedules = teacherSchedules.filter(s => !s.isKegiatanSekolah);
      const targetCount = effectiveSchedules.length > 0 ? effectiveSchedules.length : teacherSchedules.length;
      const isAllSelected = targetCount > 0 && newSessions.length === targetCount;
        
      return { ...prev, sessions: newSessions, isFullDay: isAllSelected };
    });
  };

  const submitLeaveRequest = async () => {
    if (!leaveForm.reason.trim()) {
      setLeaveReasonError(true);
      return;
    }
    setLeaveReasonError(false);
    setLeaveModalPhase('LOADING_LEAVE');
    
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    
    const _dNow = new Date();
    const timestampStr = String(_dNow.getHours()).padStart(2, '0') + ':' + String(_dNow.getMinutes()).padStart(2, '0');
    
    const bulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const leaveDateFormatted = `${dd}-${bulanIndo[d.getMonth()]}-${yyyy}`;

    const schedules = getTeacherSchedules(leaveForm.teacherId);
    let anyOffline = false;

    let infoDetail = leaveForm.reason;
    if (leaveForm.type === 'Instruksi Pimpinan') {
      infoDetail = `[Instruksi: ${leaveForm.assigner}] ${leaveForm.reason}`;
    }

    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDayIndo = daysIndo[d.getDay()];
    const tanggalFormatStandard = `${dd}/${mm}/${yyyy}`;

    // Jalur A: Pendidik TIDAK memiliki jadwal KBM hari ini (Izin Harian Non-KBM -> Sheet IzinHarian)
    if (schedules.length === 0) {
      const cleanGuru = leaveForm.teacherId ? leaveForm.teacherId.toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "UNK";
      const structuredId = `${dd}${mm}${yyyy}NONKBM${cleanGuru}`;
      const teacherObj = localCache?.master_guru?.[leaveForm.teacherId];
      const teacherName = teacherObj?.nama || teacherSearch || "Pendidik";
      const teacherNip = teacherObj?.nip || "-";

      const payload = {
        id_kiriman: structuredId,
        target_sheet: "IzinHarian",
        is_leave: true,
        is_non_kbm: true,
        jam_kbm: 0,
        kategori: "Izin Harian Non-KBM",
        leave_type: leaveForm.type,
        info_ketidakhadiran: infoDetail,
        pemberi_instruksi: leaveForm.type === 'Instruksi Pimpinan' ? leaveForm.assigner : '-',
        kegiatan_pembelajaran: "-",
        pengganti: "N",
        leave_time: timestampStr,
        leave_date_formatted: leaveDateFormatted,
        waktu_absen_asli: timestampStr,
        tanggal_absen_asli: tanggalFormatStandard,
        hari_absen_asli: currentDayIndo,
        waktu_presensi: timestampStr,
        tanggal_presensi: tanggalFormatStandard,
        hari_presensi: currentDayIndo,
        client_time: timestampStr,
        is_offline_sync: !isOnline,
        ruang_belajar: "Non-KBM",
        data_jadwal: {
          id: structuredId,
          kode_guru: leaveForm.teacherId,
          nama_guru: teacherName,
          nip: teacherNip,
          teacherName: teacherName,
          subject: "Izin Harian (0 Jam KBM)",
          mata_pelajaran: "Izin Harian",
          nama_kelas: "- (Non-KBM)",
          jam_ke: "0",
          mapel_ke: "0",
          jam_mulai: "-",
          jam_selesai: "-",
          waktu_mulai: "-",
          waktu_selesai: "-",
          kode_mapel: "NONKBM",
          timestamp: timestampStr,
          tanggal: tanggalFormatStandard,
          hari: currentDayIndo
        }
      };

      const pushToOffline = () => {
        anyOffline = true;
        const queueItem: OfflineQueueItem = { id: structuredId + '_' + Date.now(), payload: payload, timestamp: timestampStr };
        let currentQueue: OfflineQueueItem[] = [];
        try { currentQueue = JSON.parse(localStorage.getItem('tapak_offline_queue') || '[]'); } catch {}
        currentQueue.push(queueItem);
        localStorage.setItem('tapak_offline_queue', JSON.stringify(currentQueue));
        setOfflineQueue(currentQueue);
      };

      if (!isOnline) {
        pushToOffline();
      } else {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'submit', payload: payload })
          });
          const resData = await response.json();
          if (resData.status === 'success' || (resData.status === 'error' && resData.message && resData.message.includes('sudah melakukan presensi'))) {
            addToHistory({
              id: structuredId + '_' + Date.now(),
              nama_kelas: "- (Non-KBM)",
              mapel_ke: 0,
              jam_ke: "-",
              jenis_kehadiran: leaveForm.type,
              teacherName: teacherName,
              subject: `Izin Harian: ${leaveForm.type}`,
              waktu_mulai: "-",
              waktu_selesai: "-",
              timestamp: resData.data ? resData.data.waktu_absen : timestampStr
            });
          } else {
            pushToOffline();
          }
        } catch {
          pushToOffline();
        }
      }
    } else {
      // Jalur B: Pendidik MEMILIKI jadwal tatap muka KBM hari ini (Target: AttendanceLogs)
      const selectedSchedules = leaveForm.isFullDay 
        ? schedules 
        : schedules.filter(s => s.id && leaveForm.sessions.includes(s.id));

      if (selectedSchedules.length === 0) {
        setLeaveModalPhase('LEAVE_FORM');
        return; 
      }

      for (const sched of selectedSchedules) {
        const cleanClass = sched.nama_kelas ? sched.nama_kelas.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "UNK";
        const cleanMapel = sched.mapel_ke ? sched.mapel_ke.toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "0";
        const cleanGuru = sched.kode_guru ? sched.kode_guru.toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "UNK";
        const structuredId = `${dd}${mm}${yyyy}${cleanClass}${cleanMapel}${cleanGuru}`;

        const payload = {
          id_kiriman: structuredId,
          target_sheet: "AttendanceLogs",
          is_leave: true,
          leave_type: leaveForm.type,
          info_ketidakhadiran: infoDetail,
          kegiatan_pembelajaran: "-",
          pengganti: "N", 
          leave_time: timestampStr,
          leave_date_formatted: leaveDateFormatted,
          waktu_absen_asli: timestampStr,
          tanggal_absen_asli: tanggalFormatStandard,
          hari_absen_asli: currentDayIndo,
          waktu_presensi: timestampStr,
          tanggal_presensi: tanggalFormatStandard,
          hari_presensi: currentDayIndo,
          client_time: timestampStr,
          is_offline_sync: !isOnline,
          ruang_belajar: "Ruang Kelas",
          data_jadwal: {
            ...sched,
            teacherName: sched.nama_guru,
            subject: sched.mata_pelajaran,
            waktu_mulai: sched.jam_mulai,
            waktu_selesai: sched.jam_selesai,
            kode_mapel: sched.kode_mapel,
            timestamp: timestampStr,
            tanggal: tanggalFormatStandard,
            hari: currentDayIndo
          }
        };

        const pushToOffline = () => {
          anyOffline = true;
          const queueItem: OfflineQueueItem = { id: structuredId + '_' + Date.now(), payload: payload, timestamp: timestampStr };
          let currentQueue: OfflineQueueItem[] = [];
          try { currentQueue = JSON.parse(localStorage.getItem('tapak_offline_queue') || '[]'); } catch {}
          currentQueue.push(queueItem);
          localStorage.setItem('tapak_offline_queue', JSON.stringify(currentQueue));
          setOfflineQueue(currentQueue);
        };

        if (!isOnline) {
          pushToOffline();
        } else {
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ action: 'submit', payload: payload })
            });
            const resData = await response.json();
            if (resData.status === 'success' || (resData.status === 'error' && resData.message.includes('sudah melakukan presensi'))) {
              addToHistory({
                id: structuredId + '_' + Date.now(),
                nama_kelas: sched.nama_kelas || "Kelas",
                mapel_ke: sched.mapel_ke,
                jam_ke: sched.jam_ke || "-",
                jenis_kehadiran: leaveForm.type,
                teacherName: sched.nama_guru,
                subject: sched.mata_pelajaran,
                waktu_mulai: sched.jam_mulai,
                waktu_selesai: sched.jam_selesai,
                timestamp: resData.data ? resData.data.waktu_absen : timestampStr
              });
            } else { pushToOffline(); }
          } catch {
            pushToOffline();
          }
        }
      }
    }

    triggerHaptic([60, 40, 80]);
    playSuccessChime();
    if (anyOffline) {
      setLeaveModalPhase('SUCCESS_LEAVE_OFFLINE');
    } else {
      setLeaveModalPhase('SUCCESS_LEAVE');
    }
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setDateStr(now.toLocaleDateString('id-ID', options));
      
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      setCurrentDay(days[now.getDay()]);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prevDayRef.current && prevDayRef.current !== currentDay && currentDay) {
      // Saat pergantian hari: baca instan jadwal hari baru dari penyimpanan lokal jika sudah ada
      const cached = localStorage.getItem(`tapak_master_v1_${currentDay}`);
      if (cached) {
        try {
          setLocalCache(JSON.parse(cached));
          setSyncStatus('success');
        } catch {
          setSyncStatus('idle');
        }
      } else {
        setSyncStatus('idle');
      }
    }
    prevDayRef.current = currentDay;
  }, [currentDay]);

  useEffect(() => {
    const storedQueue = localStorage.getItem('tapak_offline_queue');
    if (storedQueue) {
      try { setOfflineQueue(JSON.parse(storedQueue)); } catch {}
    }

    const todayStr = new Date().toLocaleDateString('id-ID');
    const storedDate = localStorage.getItem('tapak_history_date');
    const storedHistory = localStorage.getItem('tapak_sent_history');
    
    if (storedDate !== todayStr) {
      localStorage.removeItem('tapak_sent_history');
      localStorage.setItem('tapak_history_date', todayStr);
      setSentHistory([]);
    } else if (storedHistory) {
      try { setSentHistory(JSON.parse(storedHistory)); } catch {}
    }

    const handleOnline = () => {
      setIsOnline(true);
      // PENTING: Pertahankan seluruh jadwal Senin s/d Jumat di penyimpanan lokal tanpa dihapus!
      syncWeeklyScheduleInBackground(false);

      // Deteksi antrean presensi lokal untuk langsung disinkronkan saat tersambung kembali
      const currentQueueStr = localStorage.getItem('tapak_offline_queue');
      let currentQueue: OfflineQueueItem[] = [];
      try {
        if (currentQueueStr) currentQueue = JSON.parse(currentQueueStr);
      } catch {}

      if (currentQueue && currentQueue.length > 0) {
        setOfflineQueue(currentQueue);
        setSyncBannerStatus('syncing');
        // Picu sinkronisasi segera bahkan jika hanya ada 1 item di antrean
        autoSyncOfflineData(true);
      } else {
        setSyncBannerStatus('online');
        setTimeout(() => {
          setSyncBannerStatus((prev) => (prev === 'online' ? null : prev));
        }, 3000);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncBannerStatus(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Registrasi Service Worker PWA & pengecekan versi terbaru secara hening setiap aplikasi dibuka
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Periksa pembaruan Service Worker di server secara otomatis saat online
          if (navigator.onLine) {
            registration.update().catch(() => {});
          }

          // Jika ada worker baru dalam status waiting, minta skipWaiting agar aktif untuk sesi berikutnya
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              setAppUpdateState('downloading');
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Berkas tampilan baru berhasil diunduh di latar belakang
                    installingWorker.postMessage({ type: 'SKIP_WAITING' });
                    setAppUpdateState('completed');
                    setTimeout(() => {
                      setAppUpdateState(null);
                    }, 3000);
                  } else {
                    setAppUpdateState('completed');
                    setTimeout(() => {
                      setAppUpdateState(null);
                    }, 2500);
                  }
                }
              });
            }
          });
        })
        .catch(() => {});
    }

    // 1. Cek apakah aplikasi sudah berjalan dalam mode PWA Standalone (terpasang)
    const isStandalone = 
      typeof window !== 'undefined' && (
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://')
      );

    // 2. Tangkap event instalasi browser Chrome / Edge / Samsung Internet
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      const dismissedUntil = localStorage.getItem('tapak_install_dismissed_until');
      if (!isStandalone && (!dismissedUntil || Number(dismissedUntil) <= Date.now())) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Tampilkan banner dengan jeda halus jika belum terpasang dan belum ditutup 7 hari
    const bannerTimer = setTimeout(() => {
      const dismissedUntil = localStorage.getItem('tapak_install_dismissed_until');
      if (!isStandalone && (!dismissedUntil || Number(dismissedUntil) <= Date.now())) {
        setShowInstallBanner(true);
      }
    }, 1200);

    // Tangani notifikasi pembaruan berhasil dari Service Worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SW_UPDATE_SUCCESS') {
        if (event.data.build) {
          setCurrentBuildNumber(event.data.build);
        }
        setUpdateSuccessToast(event.data.message || 'Aplikasi telah diperbarui ke versi terbaru!');
        triggerHaptic([40, 30, 60]);
        setTimeout(() => {
          setUpdateSuccessToast(null);
        }, 3500);
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
      clearTimeout(bannerTimer);
    };
  }, []);

  const handleDismissInstallBanner = () => {
    // Kunci penutupan selama 7 hari sesuai preferensi pengguna
    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('tapak_install_dismissed_until', String(sevenDaysLater));
    setShowInstallBanner(false);
    triggerHaptic(40);
  };

  const handleTriggerInstall = async () => {
    triggerHaptic(60);
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setShowInstallBanner(false);
        }
        setDeferredInstallPrompt(null);
      } catch {
        setShowInstallBanner(false);
      }
    } else {
      // Jika browser tidak mendukung event otomatis (misal iOS Safari), tampilkan modal panduan
      setIsIosInstallModalOpen(true);
    }
  };

  const addToHistory = (itemData: HistoryItem) => {
    setSentHistory(prev => {
      const newHist = [itemData, ...prev];
      localStorage.setItem('tapak_sent_history', JSON.stringify(newHist));
      return newHist;
    });
  };

  const autoSyncOfflineData = async (forceSync: boolean = false) => {
    const actuallyOnline = forceSync || isOnline || (typeof navigator !== 'undefined' ? navigator.onLine : false);
    if (!actuallyOnline || isBackgroundSyncing) return;
    
    const currentQueueStr = localStorage.getItem('tapak_offline_queue');
    if (!currentQueueStr) return;
    
    let currentQueue: OfflineQueueItem[] = [];
    try { currentQueue = JSON.parse(currentQueueStr); } catch { return; }
    
    if (currentQueue.length === 0) return;

    // Simulasi responsif pada lingkungan uji coba / URL placeholder
    if (API_URL.includes("ISI_DENGAN")) {
      setIsBackgroundSyncing(true);
      setSyncBannerStatus('syncing');
      const total = currentQueue.length;
      setSyncProgress({ current: 0, total });
      
      for (let i = 0; i < currentQueue.length; i++) {
        const item = currentQueue[i];
        const originalTime = item.payload?.waktu_absen_asli || item.timestamp || '07:30';
        addToHistory({
          id: item.id,
          nama_kelas: item.payload?.data_jadwal?.nama_kelas || "- (Non-KBM)",
          mapel_ke: item.payload?.data_jadwal?.mapel_ke || 0,
          jam_ke: item.payload?.data_jadwal?.jam_ke || "-",
          jenis_kehadiran: item.payload?.is_leave || item.payload?.is_non_kbm ? (item.payload?.leave_type || 'Izin') : 'Hadir',
          teacherName: item.payload?.data_jadwal?.teacherName || item.payload?.nama_guru || "-",
          subject: item.payload?.data_jadwal?.subject || (item.payload?.is_non_kbm ? `Izin Harian: ${item.payload?.leave_type || 'Izin'}` : '-'),
          waktu_mulai: item.payload?.data_jadwal?.waktu_mulai || "-",
          waktu_selesai: item.payload?.data_jadwal?.waktu_selesai || "-",
          timestamp: originalTime
        });
        setSyncProgress({ current: i + 1, total });
      }
      localStorage.setItem('tapak_offline_queue', JSON.stringify([]));
      setOfflineQueue([]);
      setIsBackgroundSyncing(false);
      setSyncBannerStatus('success');
      setTimeout(() => {
        setSyncProgress(null);
        setSyncBannerStatus((prev) => (prev === 'success' ? null : prev));
      }, 3500);
      return;
    }

    setIsBackgroundSyncing(true);
    setSyncBannerStatus('syncing');
    const totalItems = currentQueue.length;
    setSyncProgress({ current: 0, total: totalItems });

    let remainingQueue = [...currentQueue];
    let syncedCount = 0;
    let processedCount = 0;

    // KASUS TUNGGAL: Jika HANYA ADA 1 ITEM di antrean, segera kirim langsung seketika saat tersambung kembali
    // tanpa menunggu akumulasi batch 3 data.
    if (currentQueue.length === 1) {
      const singleItem = currentQueue[0];
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'submit', payload: singleItem.payload })
        });
        const resData = await response.json();
        const isSuccess = resData.status === 'success' || 
          (resData.status === 'error' && (
            resData.message?.includes('sudah melakukan presensi') ||
            resData.message?.includes('sudah melakukan pengajuan')
          ));

        if (isSuccess) {
          syncedCount++;
          const originalTime = singleItem.payload?.waktu_absen_asli || singleItem.timestamp || (resData.data ? resData.data.waktu_absen : '00:00');
          addToHistory({
            id: singleItem.id,
            nama_kelas: singleItem.payload?.data_jadwal?.nama_kelas || "- (Non-KBM)",
            mapel_ke: singleItem.payload?.data_jadwal?.mapel_ke || 0,
            jam_ke: singleItem.payload?.data_jadwal?.jam_ke || "-",
            jenis_kehadiran: singleItem.payload?.is_leave || singleItem.payload?.is_non_kbm ? (singleItem.payload?.leave_type || 'Izin') : 'Hadir',
            teacherName: singleItem.payload?.data_jadwal?.teacherName || singleItem.payload?.nama_guru || "-",
            subject: singleItem.payload?.data_jadwal?.subject || (singleItem.payload?.is_non_kbm ? `Izin Harian: ${singleItem.payload?.leave_type || 'Izin'}` : '-'),
            waktu_mulai: singleItem.payload?.data_jadwal?.waktu_mulai || "-",
            waktu_selesai: singleItem.payload?.data_jadwal?.waktu_selesai || "-",
            timestamp: originalTime
          });
          remainingQueue = [];
          localStorage.setItem('tapak_offline_queue', JSON.stringify([]));
          setOfflineQueue([]);
        }
      } catch {
        // Gagal jaringan, data tetap tersimpan di antrean untuk dicoba lagi
      }

      setSyncProgress({ current: syncedCount, total: totalItems });
      setIsBackgroundSyncing(false);

      if (syncedCount > 0 && remainingQueue.length === 0) {
        setSyncBannerStatus('success');
        setTimeout(() => {
          setSyncProgress(null);
          setSyncBannerStatus((prev) => (prev === 'success' ? null : prev));
        }, 3500);
      } else {
        setTimeout(() => setSyncProgress(null), 1500);
        if (remainingQueue.length === 0) setSyncBannerStatus(null);
      }
      return;
    }

    // KASUS ANTREAN LEBIH BESAR (> 1 item): Gunakan Batch Processing (3 item per request)
    // untuk menyeimbangkan performa, meminimalkan overhead jaringan & handshake koneksi
    const BATCH_SIZE = 3;
    for (let i = 0; i < currentQueue.length; i += BATCH_SIZE) {
      const batch = currentQueue.slice(i, i + BATCH_SIZE);
      setSyncProgress({ current: processedCount, total: totalItems });
      
      try {
        // Kirim kelompok 3 item dalam 1 HTTP request
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'batch_submit',
            items: batch.map(item => ({
              id: item.id,
              payload: item.payload,
              timestamp: item.timestamp
            }))
          })
        });

        const resData = await response.json();

        // Jalur 1: Backend merespons sukses batch_submit
        if (resData.status === 'success' && Array.isArray(resData.results)) {
          for (const resItem of resData.results) {
            const queueItem = batch.find(b => b.id === resItem.id);
            if (!queueItem) continue;

            const isSuccess = resItem.status === 'success' || 
              (resItem.status === 'error' && (
                resItem.message?.includes('sudah melakukan presensi') ||
                resItem.message?.includes('sudah melakukan pengajuan')
              ));

            if (isSuccess) {
              syncedCount++;
              const originalTime = queueItem.payload?.waktu_absen_asli || queueItem.timestamp || (resItem.data?.waktu_absen || '00:00');
              
              addToHistory({
                id: queueItem.id,
                nama_kelas: queueItem.payload?.data_jadwal?.nama_kelas || "- (Non-KBM)",
                mapel_ke: queueItem.payload?.data_jadwal?.mapel_ke || 0,
                jam_ke: queueItem.payload?.data_jadwal?.jam_ke || "-",
                jenis_kehadiran: queueItem.payload?.is_leave || queueItem.payload?.is_non_kbm ? (queueItem.payload?.leave_type || 'Izin') : 'Hadir',
                teacherName: queueItem.payload?.data_jadwal?.teacherName || queueItem.payload?.nama_guru || "-",
                subject: queueItem.payload?.data_jadwal?.subject || (queueItem.payload?.is_non_kbm ? `Izin Harian: ${queueItem.payload?.leave_type || 'Izin'}` : '-'),
                waktu_mulai: queueItem.payload?.data_jadwal?.waktu_mulai || "-",
                waktu_selesai: queueItem.payload?.data_jadwal?.waktu_selesai || "-",
                timestamp: originalTime
              });
              remainingQueue = remainingQueue.filter(q => q.id !== queueItem.id);
            }
          }

          processedCount += batch.length;
          setSyncProgress({ current: Math.min(processedCount, totalItems), total: totalItems });

          // Simpan progres incremental agar jika koneksi putus, batch yang selesai tidak terulang
          localStorage.setItem('tapak_offline_queue', JSON.stringify(remainingQueue));
          setOfflineQueue(remainingQueue);
        } else {
          // Jalur 2 Fallback: Jika backend lama belum ada batch_submit, proses item batch ini secara berurutan
          for (const item of batch) {
            try {
              const singleRes = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'submit', payload: item.payload })
              });
              const singleData = await singleRes.json();
              if (singleData.status === 'success' || (singleData.status === 'error' && singleData.message?.includes('sudah melakukan presensi'))) {
                syncedCount++;
                const originalTime = item.payload?.waktu_absen_asli || item.timestamp || (singleData.data?.waktu_absen || '00:00');
                
                addToHistory({
                  id: item.id,
                  nama_kelas: item.payload?.data_jadwal?.nama_kelas || "- (Non-KBM)",
                  mapel_ke: item.payload?.data_jadwal?.mapel_ke || 0,
                  jam_ke: item.payload?.data_jadwal?.jam_ke || "-",
                  jenis_kehadiran: item.payload?.is_leave || item.payload?.is_non_kbm ? (item.payload?.leave_type || 'Izin') : 'Hadir',
                  teacherName: item.payload?.data_jadwal?.teacherName || item.payload?.nama_guru || "-",
                  subject: item.payload?.data_jadwal?.subject || (item.payload?.is_non_kbm ? `Izin Harian: ${item.payload?.leave_type || 'Izin'}` : '-'),
                  waktu_mulai: item.payload?.data_jadwal?.waktu_mulai || "-",
                  waktu_selesai: item.payload?.data_jadwal?.waktu_selesai || "-",
                  timestamp: originalTime
                });
                remainingQueue = remainingQueue.filter(q => q.id !== item.id);
              }
              processedCount++;
              setSyncProgress({ current: Math.min(processedCount, totalItems), total: totalItems });
            } catch {
              break;
            }
          }
          localStorage.setItem('tapak_offline_queue', JSON.stringify(remainingQueue));
          setOfflineQueue(remainingQueue);
        }
      } catch {
        // Terjadi gangguan jaringan pada batch ini, simpan progres antrean dan hentikan
        break;
      }
    }
    
    localStorage.setItem('tapak_offline_queue', JSON.stringify(remainingQueue));
    setOfflineQueue(remainingQueue);
    setIsBackgroundSyncing(false);

    if (syncedCount > 0 && remainingQueue.length === 0) {
      setSyncProgress({ current: totalItems, total: totalItems });
      setSyncBannerStatus('success');
      setTimeout(() => {
        setSyncProgress(null);
        setSyncBannerStatus((prev) => (prev === 'success' ? null : prev));
      }, 3500);
    } else {
      setTimeout(() => {
        setSyncProgress(null);
      }, 1500);
      if (remainingQueue.length === 0) {
        setSyncBannerStatus(null);
      }
    }
  };

  const syncWeeklyScheduleInBackground = async (isManual = false) => {
    const daysOrder = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    const todayDay = currentDay || daysOrder[now.getDay()];

    if (!isOnline && !API_URL.includes("ISI_DENGAN")) {
      if (isManual) {
        setOfflineToast('Mode Luring: Menggunakan jadwal lokal tersimpan');
        setTimeout(() => setOfflineToast(null), 3000);
      }
      return;
    }

    if (API_URL.includes("ISI_DENGAN")) {
      const dummyData: LocalCache = {
        classes: { "SIMULASI-123": { id_kelas: "K-01", nama_kelas: "Kelas VII A", lokasi_ruang: "Ruang 1" } },
        schedules: { "Kelas VII A": [{ jam_ke: "1-2", mapel_ke: "1", jam_mulai: "07:00", jam_selesai: "23:00", nama_guru: "Drs. Budi Santoso", mata_pelajaran: "Matematika", nip: "123456", kode_guru: "G-01", kode_mapel: "MP-01" }] },
        master_guru: { "G-01": { nama: "Drs. Budi Santoso", nip: "123456" }, "G-02": { nama: "Siti Aminah, S.Pd", nip: "-" } },
        master_mapel: { "MP-01": "Matematika", "MP-02": "Bahasa Indonesia" },
        master_ruangan: { "QR-LAPANGAN": { nama_ruangan: "Lapangan Olahraga", pin: "1234" } } 
      };
      setLocalCache(dummyData);
      localStorage.setItem(`tapak_master_v1_${todayDay}`, JSON.stringify(dummyData));
      setSyncStatus('success');
      return;
    }

    // 1. Coba unduh paket jadwal sepekan penuh (Senin s/d Jumat/Sabtu) via init_week
    try {
      const res = await fetch(`${API_URL}?action=init_week`);
      const resData = await res.json();
      if (resData.status === 'success' && resData.data && resData.data.schedules_by_day) {
        const { master_guru, master_mapel, master_ruangan, classes, schedules_by_day, hari_libur } = resData.data;
        const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        if (hari_libur && Array.isArray(hari_libur)) {
          localStorage.setItem('tapak_holidays_v1', JSON.stringify(hari_libur));
        }

        weekDays.forEach(d => {
          const dayPayload: LocalCache = {
            classes,
            master_guru,
            master_mapel,
            master_ruangan,
            schedules: schedules_by_day[d] || {},
            hari_libur: hari_libur || []
          };
          localStorage.setItem(`tapak_master_v1_${d}`, JSON.stringify(dayPayload));
          if (d === todayDay) {
            setLocalCache(dayPayload);
          }
        });

        setSyncStatus('success');
        if (isManual) {
          setSyncBannerStatus('online');
          setTimeout(() => setSyncBannerStatus(null), 3000);
        }
        return;
      }
    } catch {}

    // 2. Fallback: Ambil jadwal hari ini secara individual (in-place silent update)
    try {
      const resToday = await fetch(`${API_URL}?action=init&hariIni=${encodeURIComponent(todayDay)}`);
      const resTodayData = await resToday.json();
      if (resTodayData.status === 'success' && resTodayData.data) {
        if (resTodayData.data.hari_libur && Array.isArray(resTodayData.data.hari_libur)) {
          localStorage.setItem('tapak_holidays_v1', JSON.stringify(resTodayData.data.hari_libur));
        }
        setLocalCache(resTodayData.data);
        localStorage.setItem(`tapak_master_v1_${todayDay}`, JSON.stringify(resTodayData.data));
        setSyncStatus('success');
      }
    } catch {
      if (!localCache && !localStorage.getItem(`tapak_master_v1_${todayDay}`)) {
        setSyncStatus('error');
      }
    }

    // 3. Fallback pra-muat hening hari kerja lainnya (Senin s/d Jumat) ke local storage
    const schoolDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
    for (const d of schoolDays) {
      if (d !== todayDay && !localStorage.getItem(`tapak_master_v1_${d}`)) {
        try {
          const r = await fetch(`${API_URL}?action=init&hariIni=${encodeURIComponent(d)}`);
          const rData = await r.json();
          if (rData.status === 'success' && rData.data) {
            localStorage.setItem(`tapak_master_v1_${d}`, JSON.stringify(rData.data));
          }
        } catch {}
      }
    }

    if (isManual) {
      setSyncBannerStatus('online');
      setTimeout(() => setSyncBannerStatus(null), 3000);
    }
  };

  const handleManualRefresh = async () => {
    if (!isOnline) {
      setOfflineToast('Mode Luring: Menggunakan jadwal lokal tersimpan');
      setTimeout(() => setOfflineToast(null), 3000);
      setTimeout(() => {
        setPullDistance(0);
        setIsPullRefreshing(false);
      }, 500);
      return;
    }

    try {
      await syncWeeklyScheduleInBackground(true);
      autoSyncOfflineData();
    } finally {
      setTimeout(() => {
        setPullDistance(0);
        setIsPullRefreshing(false);
      }, 600);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPullRefreshing) return;
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop <= 0) {
      pullStartYRef.current = e.touches[0].clientY;
    } else {
      pullStartYRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pullStartYRef.current <= 0 || isPullRefreshing) return;
    if (scrollContainerRef.current && scrollContainerRef.current.scrollTop <= 0) {
      const currentY = e.touches[0].clientY;
      const diffY = currentY - pullStartYRef.current;
      if (diffY > 0) {
        // Hambatan elastis (damping curve)
        const damped = Math.min(85, Math.pow(diffY, 0.82) * 1.6);
        setPullDistance(damped);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullStartYRef.current <= 0 || isPullRefreshing) return;
    pullStartYRef.current = 0;
    if (pullDistance >= 60) {
      // Haptik getaran halus saat tarikan berhasil dilepas
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(20); } catch {}
      }
      setIsPullRefreshing(true);
      handleManualRefresh();
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      autoSyncOfflineData();
    }
  }, [isOnline, offlineQueue.length]);

  useEffect(() => {
    if (!currentDay) return;

    const cacheKey = `tapak_master_v1_${currentDay}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        setLocalCache(JSON.parse(cachedData));
        setSyncStatus('success');
      } catch {
        localStorage.removeItem(cacheKey);
      }
    } else {
      setSyncStatus('syncing');
    }

    // Jalankan sinkronisasi sepekan hening di latar belakang
    if (isOnline || API_URL.includes("ISI_DENGAN")) {
      syncWeeklyScheduleInBackground(false);
    }
  }, [currentDay, isOnline]);

  const processScheduleMatch = (namaKelasStr: string, idKelasStr: string, lokasiRuangAsli: string, isRuangKhusus = false, scanTimeOverride?: string) => {
    const schedules = localCache?.schedules ? localCache.schedules[namaKelasStr.trim()] : undefined;
    let activeSched: ScheduleItem | null = null;
    let nextSched: ScheduleItem | null = null;

    if (schedules && schedules.length > 0) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (let i = 0; i < schedules.length; i++) {
        const sched = schedules[i];
        if (!sched.jam_mulai || !sched.jam_selesai) continue;
        
        const startParts = sched.jam_mulai.toString().replace('.', ':').split(':');
        const endParts = sched.jam_selesai.toString().replace('.', ':').split(':');
        if (startParts.length < 2 || endParts.length < 2) continue;

        const startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        const endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        if (currentMinutes >= startMins && currentMinutes <= endMins) {
          activeSched = sched;
          if (i + 1 < schedules.length) {
            nextSched = schedules[i + 1];
          }
          break;
        }
      }
    }

    const ruangBelajarStr = isRuangKhusus && dynamicRoomData ? dynamicRoomData.nama_ruangan : "Ruang Kelas";
    const lokasiRuangTampil = isRuangKhusus && dynamicRoomData ? dynamicRoomData.nama_ruangan : lokasiRuangAsli;

    // Cek apakah waktu KBM saat ini atau sesi aktif sedang dalam kegiatan sekolah (non-efektif)
    const now = new Date();
    let matchedHoliday: HolidayEvent | null = null;
    if (todayHolidayEvents && todayHolidayEvents.length > 0) {
      for (const h of todayHolidayEvents) {
        const overlap = checkScheduleHolidayOverlap(
          activeSched ? { jam_mulai: activeSched.jam_mulai, jam_selesai: activeSched.jam_selesai } : {},
          h,
          now
        );
        if (overlap.isOverlap) {
          matchedHoliday = h;
          break;
        }
      }
    }

    if (matchedHoliday) {
      setMatchedSchoolEvent(matchedHoliday);
      setModalPhase('SCHOOL_EVENT');
      return;
    }

    const _nowD = new Date();
    const fallbackScanTime = String(_nowD.getHours()).padStart(2, '0') + ':' + String(_nowD.getMinutes()).padStart(2, '0');
    const lockedScanTime = scanTimeOverride || initialScanTime || fallbackScanTime;

    if (activeSched) {
      setIsManualMode(false);
      setScanResult({
        id_kelas: idKelasStr, 
        nama_kelas: namaKelasStr, 
        lokasi_ruang: lokasiRuangTampil,
        ruang_belajar: ruangBelajarStr,
        jam_ke: activeSched.jam_ke,
        mapel_ke: activeSched.mapel_ke,
        kode_guru: activeSched.kode_guru,
        kode_mapel: activeSched.kode_mapel,
        teacherName: activeSched.nama_guru, 
        nip: activeSched.nip, 
        subject: activeSched.mata_pelajaran,
        waktu_mulai: activeSched.jam_mulai, 
        waktu_selesai: activeSched.jam_selesai,
        nextTeacher: nextSched ? { nama: nextSched.nama_guru, mapel: nextSched.mata_pelajaran } : null,
        scan_time: lockedScanTime
      });
      setModalPhase('FORM');
    } else {
      setIsManualMode(true);
      setManualForm({ kode_guru: '', kode_mapel: '', jam_ke: '', mapel_ke: '', waktu_mulai_hh: '', waktu_mulai_mm: '', waktu_selesai_hh: '', waktu_selesai_mm: '' });
      setManualFormError('');
      setScanResult({
        id_kelas: idKelasStr, 
        nama_kelas: namaKelasStr, 
        lokasi_ruang: lokasiRuangTampil,
        ruang_belajar: ruangBelajarStr,
        jam_ke: "-", mapel_ke: "-", kode_guru: "-", kode_mapel: "-", teacherName: "-", nip: "-", subject: "-", waktu_mulai: "-", waktu_selesai: "-", nextTeacher: null,
        scan_time: lockedScanTime
      });
      setModalPhase('NO_SCHEDULE');
    }
  };

  const handleQrMatch = (token: string) => {
    setScannedToken(token);
    const _nowScan = new Date();
    const scanTimeStr = String(_nowScan.getHours()).padStart(2, '0') + ':' + String(_nowScan.getMinutes()).padStart(2, '0');
    setInitialScanTime(scanTimeStr);
    
    if (!localCache || !localCache.classes) {
      setApiError('Aplikasi masih mengunduh jadwal. Tunggu sebentar.');
      setModalPhase('ERROR');
      return;
    }

    const kelas = localCache.classes[token.trim()];
    const ruangKhusus = localCache.master_ruangan ? localCache.master_ruangan[token.trim()] : null;

    if (kelas) {
      setIsScanSuccess(true);
      triggerHaptic(70);
      playSuccessChime();
      setTimeout(() => {
        processScheduleMatch(kelas.nama_kelas, kelas.id_kelas, kelas.lokasi_ruang, false, scanTimeStr);
      }, 450);
    } else if (ruangKhusus) {
      setIsScanSuccess(true);
      setDynamicRoomData(ruangKhusus);
      setPinInput('');
      setPinAttempts(0);
      setPinErrorShake(false);
      triggerHaptic(70);
      playSuccessChime();
      setTimeout(() => {
        setModalPhase('PIN_VERIFICATION');
      }, 450);
    } else {
      triggerHaptic([100, 50, 100]);
      setApiError('QR Code tidak dikenali oleh sistem.');
      setModalPhase('ERROR');
    }
  };

  const handlePinPress = (numStr: string) => {
    const expectedLength = dynamicRoomData?.pin.toString().length || 4;
    
    if (pinInput.length < expectedLength) {
      const newPin = pinInput + numStr;
      setPinInput(newPin);
      
      if (newPin.length === expectedLength) {
        if (newPin === dynamicRoomData?.pin.toString()) {
          triggerHaptic([50, 40, 50]);
          setTimeout(() => { setModalPhase('SELECT_CLASS'); }, 200);
        } else {
          triggerHaptic([100, 50, 100]);
          setPinErrorShake(true);
          setTimeout(() => setPinErrorShake(false), 500);
          setTimeout(() => setPinInput(''), 300);
          
          const fails = pinAttempts + 1;
          setPinAttempts(fails);
          if (fails >= 3) {
            setTimeout(() => {
              setApiError('Keamanan: Akses ditolak karena 3x salah PIN. Mohon scan ulang dari awal.');
              setModalPhase('ERROR');
            }, 400);
          }
        }
      }
    }
  };

  const handleDynamicClassSelect = (namaKelasStr: string) => {
    if (!localCache) return;
    const selectedKelasObj = Object.values(localCache.classes).find(c => c.nama_kelas === namaKelasStr);
    if (selectedKelasObj) {
      processScheduleMatch(selectedKelasObj.nama_kelas, selectedKelasObj.id_kelas, selectedKelasObj.lokasi_ruang, true);
    }
  };

  const handleStartCamera = () => {
    if (syncStatus === 'syncing' || syncStatus === 'error' || isCameraStarting) return;
    
    setIsCameraStarting(true); 
    setIsCameraReady(false);
    setApiError(null);
    setIsScanSuccess(false);

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length > 0) {
        setCameras(devices);
        let defaultCam = devices[0].id;
        for (let i = 0; i < devices.length; i++) {
          const label = devices[i].label.toLowerCase();
          if (label.includes("back") || label.includes("belakang") || label.includes("environment")) {
            defaultCam = devices[i].id;
            break;
          }
        }
        setSelectedCameraId(defaultCam);
        setIsModalOpen(true);
        setModalPhase('SCANNING'); 
      } else {
        setIsCameraStarting(false); 
        setIsCameraReady(false);
        setIsModalOpen(true);
        setApiError("Kamera tidak terdeteksi di perangkat Anda.");
        setModalPhase('ERROR');
      }
    }).catch(() => {
      setIsCameraStarting(false);
      setIsCameraReady(false);
      setIsModalOpen(true);
      setApiError("Izin kamera ditolak. Mohon izinkan akses kamera pada pop-up browser.");
      setModalPhase('ERROR');
    });
  };

  const handleSwitchCamera = () => {
    if (cameras.length > 1) {
      setIsCameraReady(false);
      const currentIndex = cameras.findIndex(cam => cam.id === selectedCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCameraId(cameras[nextIndex].id);
    }
  };

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    if (isModalOpen && modalPhase === 'SCANNING' && selectedCameraId) {
      setIsCameraReady(false);
      scanner = new Html5Qrcode("reader");
      html5QrCodeRef.current = scanner;
      
      // Konfigurasi pemindaian seluruh layar (100% full-viewport scanning) tanpa batasan qrbox
      // Memungkinkan pembacaan seketika di mana pun QR code tampak di layar pada 20 FPS responsif
      const config = { 
        fps: 20 
      };

      scanner.start(
        selectedCameraId, config,
        (decodedText) => { 
          if (scanner && scanner.isScanning) scanner.stop().catch(() => {}); 
          handleQrMatch(decodedText); 
        },
        () => {}
      ).then(() => {
        setIsCameraReady(true);
        setIsCameraStarting(false);
      }).catch(err => { 
        console.warn("Camera init failed:", err); 
        setIsCameraStarting(false);
        setIsCameraReady(false);
        setApiError("Gagal memulai video kamera. Silakan muat ulang halaman.");
        setModalPhase('ERROR');
      });
    }
    return () => { 
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(() => {}); 
      }
    };
  }, [isModalOpen, modalPhase, selectedCameraId]);

  const submitData = async () => {
    setModalPhase('LOADING');
    
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const currentDayIndo = daysIndo[d.getDay()];
    const tanggalFormatStandard = `${dd}/${mm}/${yyyy}`;
    
    let finalScanResult = { ...scanResult } as ScanResultState;
    
    if (isManualMode && localCache) {
      const selectedGuru = localCache.master_guru[manualForm.kode_guru];
      const selectedMapel = localCache.master_mapel[manualForm.kode_mapel];
      
      finalScanResult = {
        ...finalScanResult,
        jam_ke: manualForm.jam_ke,
        mapel_ke: manualForm.mapel_ke,
        kode_guru: manualForm.kode_guru,
        kode_mapel: manualForm.kode_mapel, 
        teacherName: selectedGuru ? selectedGuru.nama : manualForm.kode_guru,
        nip: selectedGuru ? selectedGuru.nip : "-",
        subject: selectedMapel || manualForm.kode_mapel, 
        waktu_mulai: `${manualForm.waktu_mulai_hh.padStart(2, '0')}:${manualForm.waktu_mulai_mm.padStart(2, '0')}`,
        waktu_selesai: `${manualForm.waktu_selesai_hh.padStart(2, '0')}:${manualForm.waktu_selesai_mm.padStart(2, '0')}`
      };
    }
    
    const cleanClass = finalScanResult.nama_kelas ? finalScanResult.nama_kelas.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "UNK";
    const cleanMapel = finalScanResult.mapel_ke ? finalScanResult.mapel_ke.toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "0";
    const cleanGuru = finalScanResult.kode_guru ? finalScanResult.kode_guru.toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : "UNK";
    
    const structuredId = `${dd}${mm}${yyyy}${cleanClass}${cleanMapel}${cleanGuru}`;

    const _dNowClient = new Date();
    const fallbackTime = String(_dNowClient.getHours()).padStart(2, '0') + ':' + String(_dNowClient.getMinutes()).padStart(2, '0');
    const clientTimeStr = scanResult?.scan_time || initialScanTime || fallbackTime;

    // KUNCI PERMANEN: Menjamin waktu dan tanggal yang terkirim ke spreadsheet
    // persis sama dengan saat QR code dipindai, bukan saat konfirmasi atau sinkronisasi nanti.
    const updatedFinalScanResult: ScanResultState = {
      ...finalScanResult,
      timestamp: clientTimeStr,
      scan_time: clientTimeStr,
      tanggal: tanggalFormatStandard,
      hari: currentDayIndo
    };

    const payload = {
      qr_code: scannedToken,
      id_kiriman: structuredId,
      kegiatan_pembelajaran: kegiatan.trim() !== '' ? kegiatan : '-',
      pengganti: isPengganti ? `Y - ${selectedPenggantiId}` : 'N',
      ruang_belajar: finalScanResult.ruang_belajar || "Ruang Kelas",
      data_jadwal: updatedFinalScanResult,
      client_time: clientTimeStr,
      waktu_absen_asli: clientTimeStr,
      tanggal_absen_asli: tanggalFormatStandard,
      hari_absen_asli: currentDayIndo,
      waktu_presensi: clientTimeStr,
      tanggal_presensi: tanggalFormatStandard,
      hari_presensi: currentDayIndo,
      is_offline_sync: !isOnline
    };

    const saveToOfflineQueue = () => {
      const timestampStr = clientTimeStr;
      const queueItem: OfflineQueueItem = {
        id: structuredId + '_' + Date.now(),
        payload: payload,
        timestamp: timestampStr
      };
      
      let currentQueue: OfflineQueueItem[] = [];
      try { currentQueue = JSON.parse(localStorage.getItem('tapak_offline_queue') || '[]'); } catch {}
      currentQueue.push(queueItem);
      
      localStorage.setItem('tapak_offline_queue', JSON.stringify(currentQueue));
      setOfflineQueue(currentQueue);
      setScanResult({ ...finalScanResult, timestamp: timestampStr, scan_time: clientTimeStr });
      setModalPhase('SUCCESS_OFFLINE');
      triggerHaptic([60, 40, 80]);
      playSuccessChime();
    };

    if (API_URL.includes("ISI_DENGAN")) {
      setTimeout(() => {
        const simTime = clientTimeStr;
        setScanResult({ ...finalScanResult, timestamp: simTime, scan_time: clientTimeStr });
        addToHistory({
          id: structuredId + '_' + Date.now(),
          nama_kelas: finalScanResult.nama_kelas,
          jam_ke: finalScanResult.jam_ke,
          mapel_ke: finalScanResult.mapel_ke,
          teacherName: finalScanResult.teacherName,
          subject: finalScanResult.subject,
          waktu_mulai: finalScanResult.waktu_mulai,
          waktu_selesai: finalScanResult.waktu_selesai,
          timestamp: simTime,
          jenis_kehadiran: 'Hadir'
        });
        setModalPhase('SUCCESS'); 
        triggerHaptic([60, 40, 80]);
        playSuccessChime();
      }, 1000);
      return;
    }

    if (!isOnline) {
      saveToOfflineQueue();
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'submit', payload: payload })
      });
      
      const resData = await response.json();
      if (resData.status === 'success') {
        triggerHaptic([60, 40, 80]);
        playSuccessChime();
        setScanResult({ ...finalScanResult, timestamp: clientTimeStr, scan_time: clientTimeStr });
        addToHistory({
          id: structuredId + '_' + Date.now(),
          nama_kelas: finalScanResult.nama_kelas,
          jam_ke: finalScanResult.jam_ke,
          mapel_ke: finalScanResult.mapel_ke,
          teacherName: finalScanResult.teacherName,
          subject: finalScanResult.subject,
          waktu_mulai: finalScanResult.waktu_mulai,
          waktu_selesai: finalScanResult.waktu_selesai,
          timestamp: clientTimeStr,
          jenis_kehadiran: 'Hadir'
        });
        setModalPhase('SUCCESS');
      } else {
        if (resData.message && resData.message.includes('sudah melakukan presensi')) {
          setApiError(resData.message);
          setModalPhase('ERROR');
        } else {
          setApiError(resData.message || 'Gagal menyimpan data.');
          setModalPhase('ERROR');
        }
      }
    } catch {
      saveToOfflineQueue();
    }
  };

  const handleCloseModal = () => {
    if (html5QrCodeRef.current?.isScanning) {
      html5QrCodeRef.current.stop().catch(() => {});
    }
    setIsCameraStarting(false);
    setIsCameraReady(false);
    setIsModalOpen(false); 
    setModalPhase('CLOSED'); 
    setScannedToken('');
    setInitialScanTime('');
    setIsScanSuccess(false);
    setKegiatan(''); 
    setKegiatanError(false); 
    setIsPengganti(false); 
    setScanResult(null); 
    setCameras([]); 
    setSelectedCameraId('');
    setShowConfirmation(false); 
    setIsManualMode(false); 
    setManualFormError('');
    setPinInput(''); 
    setPinAttempts(0); 
    setPinErrorShake(false); 
    setDynamicRoomData(null); 
    setPenggantiSearch(''); 
    setSelectedPenggantiName(''); 
    setSelectedPenggantiId(''); 
    setPenggantiError(false);
    setMatchedSchoolEvent(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050812] sm:py-6 select-none">
      {/* Ambient Radial Glow on Large Screens */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Smartphone Presisi Frame Container */}
      <div className="relative flex flex-col justify-between items-center w-full min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:max-w-[430px] sm:rounded-[2.5rem] sm:border sm:border-slate-800/80 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_35px_rgba(59,130,246,0.12)] bg-[#080c17] p-5 overflow-hidden">
        
        {/* Soft Background Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Banner Notifikasi Proses Pembaruan Aplikasi (Update Progress Banner) */}
        <AnimatePresence>
          {appUpdateState && (
            <motion.div
              key="app-update-progress-banner"
              initial={{ y: -60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -60, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="absolute top-2 left-3 right-3 sm:left-4 sm:right-4 z-[60] pointer-events-none"
            >
              <div 
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl backdrop-blur-xl border shadow-xl transition-all ${
                  appUpdateState === 'downloading'
                    ? 'bg-slate-900/95 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.35)] text-cyan-200'
                    : 'bg-slate-900/95 border-emerald-400/50 shadow-[0_0_25px_rgba(52,211,153,0.4)] text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {appUpdateState === 'downloading' ? (
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center animate-spin">
                      <RefreshIcon className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-emerald-400">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex flex-col">
                    <span className="text-xs font-bold tracking-tight truncate">
                      {appUpdateState === 'downloading'
                        ? 'Mengunduh pembaruan versi baru...'
                        : 'Pembaruan versi berhasil diunduh'}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {appUpdateState === 'downloading'
                        ? 'Memperbarui berkas sistem di latar belakang'
                        : 'Tampilan baru aktif otomatis pada sesi berikutnya'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded-md font-bold ${
                    appUpdateState === 'downloading'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {APP_VERSION}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notifikasi Pembaruan Berhasil */}
        <AnimatePresence>
          {updateSuccessToast && (
            <motion.div
              key="update-success-toast"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-[70] pointer-events-none"
            >
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-emerald-400/60 shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_24px_rgba(52,211,153,0.35)] backdrop-blur-xl text-emerald-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-300 flex-shrink-0">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-emerald-100 truncate">{updateSuccessToast}</span>
                    <span className="text-[10px] text-emerald-300/80 font-mono">Versi {APP_VERSION} ({currentBuildNumber}) aktif</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[9px] font-bold ml-2 flex-shrink-0">
                  Terbaru
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pop-up Banner Mengambang "Install TAPAK Scan" dengan Gesture Geser Atas (Swipe-Up) */}
        <AnimatePresence>
          {showInstallBanner && (
            <motion.div
              key="tapak-install-banner"
              initial={{ y: -80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0, scale: 0.92, transition: { duration: 0.2, ease: 'easeInOut' } }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              drag="y"
              dragConstraints={{ top: -120, bottom: 0 }}
              dragElastic={{ top: 0.3, bottom: 0 }}
              onDragEnd={(_, info) => {
                // Jika ditarik ke atas lebih dari 25px atau di-flick ke atas (kecepatan negatif)
                if (info.offset.y < -25 || info.velocity.y < -250) {
                  handleDismissInstallBanner();
                }
              }}
              className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-50 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="relative overflow-hidden rounded-2xl p-3 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_14px_36px_rgba(0,0,0,0.75),0_0_24px_rgba(34,211,238,0.22)]">
                {/* Indikator Geser ke Atas (Swipe-Up Handle) */}
                <div className="w-9 h-1 bg-slate-600/80 hover:bg-cyan-400/80 rounded-full mx-auto -mt-0.5 mb-2 transition-colors flex items-center justify-center">
                  <div className="w-2.5 h-0.5 bg-cyan-400/80 rounded-full animate-pulse" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  {/* Ikon Aplikasi & Judul */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-cyan-500/40 p-1 flex-shrink-0 flex items-center justify-center shadow-inner relative overflow-hidden">
                      <img 
                        src="/pwa-192x192.png" 
                        alt="TAPAK Scan Icon" 
                        className="w-full h-full object-contain rounded-lg drop-shadow"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-[13px] font-bold text-white tracking-tight truncate">
                          Install TAPAK Scan
                        </h4>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                      </div>
                      <p className="text-[10.5px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                        <span className="text-slate-300 font-medium">Akses Cepat</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-300">Mode Luring Siap</span>
                      </p>
                    </div>
                  </div>

                  {/* Tombol Instal & Tombol Tutup */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <motion.button
                      type="button"
                      onClick={handleTriggerInstall}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 22px rgba(34,211,238,0.7)' }}
                      whileTap={{ scale: 0.93 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="relative overflow-hidden px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.45)] flex items-center gap-1.5 cursor-pointer group"
                    >
                      {/* Efek kilau lembut saat di-hover */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                      
                      <svg className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="tracking-tight">Instal</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={handleDismissInstallBanner}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(30, 41, 59, 0.9)' }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.15 }}
                      title="Geser ke atas atau ketuk untuk menutup"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Petunjuk Geser */}
                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400/90 font-medium">
                    <svg className="w-3 h-3 text-cyan-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Geser atas untuk sembunyikan (7 hari)
                  </span>
                  <span className="text-slate-400">SMPN 1 Pagaden</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section: Logo Lockup Terpadu */}
        <header className="z-10 text-center mt-3 w-full flex flex-col items-center select-none">
          <div className="flex flex-col items-center">
            <h1 className="text-[3.75rem] font-black tracking-widest text-transparent bg-clip-text drop-shadow-md select-none leading-none" style={{ backgroundImage: 'linear-gradient(90deg, #44d0f5, #3b82f6)' }}>
              TAPAK
            </h1>
            
            <div className="-mt-0.5 inline-block px-3.5 py-1 rounded-full border shadow-md backdrop-blur-md" style={{ borderColor: '#214e6c', backgroundColor: 'rgba(15, 23, 42, 0.75)' }}>
              <p className="text-[9.5px] font-semibold text-slate-300 tracking-wide uppercase leading-tight">
                <span className="text-cyan-400 font-bold">T</span>ATA KEH<span className="text-cyan-400 font-bold">A</span>DIRAN <span className="text-cyan-400 font-bold">P</span>ENDIDIK DAL<span className="text-cyan-400 font-bold">A</span>M <span className="text-cyan-400 font-bold">K</span>ELAS
              </p>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content Area with Bottom Padding to avoid overlapping with bottom bar */}
        <div 
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col items-center justify-start pb-36 mt-4 space-y-5 z-10 relative"
        >
          {/* Pull-to-Refresh Floating Neon Cyan Spinner Indicator */}
          <AnimatePresence>
            {(pullDistance > 0 || isPullRefreshing) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -16 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="w-full flex justify-center items-center pt-1 pb-1 sticky top-0 z-40 pointer-events-none"
              >
                <div 
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl bg-slate-900/95 border border-cyan-400/50 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.45)] transition-all duration-150 ${
                    isPullRefreshing 
                      ? 'scale-100 ring-2 ring-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.6)]' 
                      : pullDistance >= 60 
                      ? 'scale-105 border-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.55)]' 
                      : 'scale-95'
                  }`}
                  style={{
                    boxShadow: '0 0 22px rgba(34, 211, 238, 0.45), inset 0 0 10px rgba(34, 211, 238, 0.2)'
                  }}
                >
                  <div
                    className={`w-4 h-4 flex items-center justify-center ${isPullRefreshing ? 'animate-spin' : ''}`}
                    style={{
                      transform: isPullRefreshing ? undefined : `rotate(${pullDistance * 4.5}deg)`
                    }}
                  >
                    <RefreshIcon className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-cyan-200">
                    {isPullRefreshing
                      ? 'Menyinkronkan jadwal...'
                      : pullDistance >= 60
                      ? 'Lepaskan untuk sinkronisasi'
                      : 'Tarik ke bawah untuk perbarui'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifikasi Halus Mode Luring saat Tarik-ke-Bawah */}
          <AnimatePresence>
            {offlineToast && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="w-[92%] max-w-[360px] mx-auto px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-[0_8px_25px_rgba(6,182,212,0.25)] backdrop-blur-md flex items-center gap-2.5 text-cyan-200 text-xs font-semibold z-30"
              >
                <div className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </div>
                <span className="text-[11px] sm:text-xs font-medium tracking-tight text-cyan-100 flex-1">{offlineToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Welcome Card & Educator Appreciation */}
          <div className="w-full rounded-2xl p-4 shadow-lg transition-transform" style={{ backgroundColor: '#16233d', border: '1px solid #1e3a5f' }}>
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1d3257', color: '#60a5fa' }}>
                <HeartIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-blue-200 leading-snug">Selamat datang, Bapak/Ibu Guru hebat.</p>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5 opacity-90">Terima kasih atas dedikasi tiada henti bagi anak bangsa. Jangan khawatir, TAPAK hadir untuk mempermudah tugas Anda.</p>
              </div>
            </div>
          </div>

          {/* Clock & Daily Status Section */}
          <div className="flex flex-col items-center justify-center text-center w-full py-2 px-2">
            
            {/* Kotak Status Mode Offline Aktif / Auto-Sync Indicator saat Koneksi Pulih */}
            <AnimatePresence mode="wait">
              {(!isOnline || offlineQueue.length > 0 || syncBannerStatus !== null) && (
                <motion.div 
                  key={
                    !isOnline 
                      ? "offline-banner" 
                      : (isBackgroundSyncing || syncBannerStatus === 'syncing')
                      ? "syncing-banner"
                      : syncBannerStatus === 'success'
                      ? "success-banner"
                      : syncBannerStatus === 'online'
                      ? "online-banner"
                      : "idle-queue-banner"
                  }
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`mb-3 sm:mb-4 z-20 flex items-center justify-between w-[90%] max-w-[360px] px-3.5 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 ${
                    !isOnline 
                      ? 'bg-rose-950/90 border-rose-500/40 shadow-[0_8px_20px_rgba(244,63,94,0.18)] text-rose-100' 
                      : (isBackgroundSyncing || syncBannerStatus === 'syncing')
                      ? 'bg-sky-950/90 border-sky-400/50 shadow-[0_8px_22px_rgba(14,165,233,0.24)] text-sky-100'
                      : syncBannerStatus === 'success'
                      ? 'bg-emerald-950/90 border-emerald-400/50 shadow-[0_8px_22px_rgba(16,185,129,0.22)] text-emerald-100'
                      : syncBannerStatus === 'online'
                      ? 'bg-teal-950/90 border-teal-400/40 shadow-[0_8px_20px_rgba(20,184,166,0.2)] text-teal-100'
                      : 'bg-indigo-950/85 border-indigo-500/40 shadow-[0_8px_20px_rgba(99,102,241,0.18)] text-indigo-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left flex-1 min-w-0">
                    {!isOnline ? (
                      <>
                        <div className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </div>
                        <WifiOffIcon className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-semibold text-rose-100 tracking-tight leading-snug">
                          Mode Offline: Presensi otomatis disimpan ke antrean lokal
                        </span>
                      </>
                    ) : (isBackgroundSyncing || syncBannerStatus === 'syncing') ? (
                      <>
                        <div className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                        </div>
                        <RefreshIcon className="w-3.5 h-3.5 text-cyan-300 animate-spin flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-semibold text-sky-100 tracking-tight leading-snug">
                          Koneksi Pulih: Mengirim {offlineQueue.length > 0 ? `${offlineQueue.length} ` : ''}data ke server...
                        </span>
                      </>
                    ) : syncBannerStatus === 'success' ? (
                      <>
                        <div className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[11px] sm:text-xs font-semibold text-emerald-100 tracking-tight leading-snug">
                          Sinkronisasi Berhasil: Data tersimpan ke server!
                        </span>
                      </>
                    ) : syncBannerStatus === 'online' ? (
                      <>
                        <div className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                        </div>
                        <CloudSyncIcon className="w-3.5 h-3.5 text-teal-300 flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-semibold text-teal-100 tracking-tight leading-snug">
                          Jadwal hari ini telah sinkron
                        </span>
                      </>
                    ) : (
                      <>
                        <RefreshIcon className="w-3.5 h-3.5 text-indigo-300 flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs font-semibold text-indigo-200 tracking-tight leading-snug">
                          Antrean Tersedia
                        </span>
                      </>
                    )}
                  </div>
                  {offlineQueue.length > 0 && (
                    <span className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm ml-2 flex-shrink-0 ${
                      !isOnline 
                        ? 'bg-rose-600 text-white' 
                        : (isBackgroundSyncing || syncBannerStatus === 'syncing')
                        ? 'bg-cyan-600 text-white animate-pulse'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {offlineQueue.length}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SPANDUK KEGIATAN SEKOLAH AKTIF SAAT INI */}
            {currentActiveEvent && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-[420px] mb-3.5 p-3.5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-slate-900/90 to-amber-950/70 shadow-[0_6px_25px_rgba(245,158,11,0.2)] text-left backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5 flex-shrink-0 border border-amber-500/30">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black tracking-wider uppercase text-amber-300">
                        Kegiatan Sekolah Berlangsung
                      </span>
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40 font-mono">
                        {currentActiveEvent.jam_mulai && currentActiveEvent.jam_selesai
                          ? `${currentActiveEvent.jam_mulai} - ${currentActiveEvent.jam_selesai} WIB`
                          : 'Seharian Penuh'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                      {currentActiveEvent.keterangan || 'KBM Non-Efektif'}
                    </h3>
                    <p className="text-[11px] text-amber-200/90 mt-1.5 leading-relaxed">
                      Sesi KBM pada rentang jam ini dinonaktifkan dan otomatis dikecualikan dari total target mengajar. Anda tidak perlu melakukan scan QR pada jam ini.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* AGENDA KEGIATAN SEKOLAH HARI INI (DI LUAR JAM AKTIF) */}
            {!currentActiveEvent && todayHolidayEvents.length > 0 && (
              <div className="w-full max-w-[420px] mb-3 p-3 rounded-xl border border-indigo-500/30 bg-slate-900/70 shadow-sm text-left backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 flex-shrink-0">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-indigo-300">Agenda Hari Ini</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-200 font-mono">
                        {todayHolidayEvents[0].jam_mulai && todayHolidayEvents[0].jam_selesai
                          ? `${todayHolidayEvents[0].jam_mulai} - ${todayHolidayEvents[0].jam_selesai}`
                          : 'Seharian'}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-200 truncate mt-0.5">
                      {todayHolidayEvents[0].keterangan} (KBM non-efektif)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Clock Display (Terpusat & Angka Ekstra Besar Menonjol - Zero Blur GPU-Free Gradient) */}
            <div className="flex flex-col items-center justify-center text-center my-0.5 select-none">
              <span className="text-5xl sm:text-[3.6rem] font-mono font-black tracking-wider tabular-nums leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 select-none">
                {time || '00:00:00'}
              </span>

              {/* Indikator Sesi Jam Ke Berapa Sedang Berlangsung Sesuai Tabel Master */}
              <div className="mt-2.5 mb-1 flex items-center justify-center">
                {currentSessionInfo.type === 'ACTIVE' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-tight">
                      {currentSessionInfo.label}
                    </span>
                  </div>
                ) : currentSessionInfo.type === 'BREAK' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-tight text-amber-100">
                      {currentSessionInfo.label}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium tracking-tight">
                    <ClockIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentSessionInfo.label}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center mt-0.5 w-full max-w-[260px]">
              <span className="text-xs font-medium text-slate-300 mb-1">{dateStr}</span>
              
              <div className="flex flex-col items-center transition-colors duration-300 text-center">
                {syncStatus === 'syncing' && (
                  <>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 animate-pulse">Menyinkronkan Jadwal...</span>
                    <span className="text-[9px] font-medium text-slate-500 normal-case tracking-normal mt-1">Pastikan Anda memiliki koneksi internet</span>
                  </>
                )}
                {syncStatus === 'success' && (
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">Aplikasi Siap Digunakan</span>
                )}
                {syncStatus === 'error' && (
                  <>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-rose-400">Jadwal Lokal Aktif</span>
                    <span className="text-[9px] font-medium text-slate-500 normal-case tracking-normal mt-1">Gagal memuat jadwal baru. Menggunakan riwayat offline.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Panduan Langkah KBM (Dipertahankan Sesuai Permintaan) */}
          <div className="w-full rounded-2xl p-4 text-left space-y-3.5 text-[11px] text-slate-300 shadow-md" style={{ backgroundColor: '#131c33', border: '1px solid #1e2c4a' }}>
            <div className="flex items-center gap-2 mb-1 text-slate-200">
              <div className="w-1.5 h-3.5 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Panduan Presensi</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full font-bold text-[10px] flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1d3257', color: '#60a5fa' }}>1</span>
              <p>Ketuk tombol <strong className="text-white">Scan QR</strong> di bagian tengah bilah bawah.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full font-bold text-[10px] flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1d3257', color: '#60a5fa' }}>2</span>
              <p>Izinkan akses kamera pada pop-up browser Anda.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full font-bold text-[10px] flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1d3257', color: '#60a5fa' }}>3</span>
              <p>Arahkan kamera ke Kode QR di kelas Anda.</p>
            </div>
          </div>

          {/* School Name Tagline & App Version Footer */}
          <div className="w-full flex flex-col items-center justify-center pt-2 pb-4 space-y-1.5 select-none">
            <h2 className="text-xs font-bold text-slate-400 tracking-wide">SMP Negeri 1 Pagaden</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9.5px] font-medium text-slate-400 tracking-wider">
                {APP_VERSION} • {currentBuildNumber}
              </span>
            </div>
          </div>

        </div>

        {/* ----------------- FIXED FOOTER NAVIGATION CONTAINER ----------------- */}
        <footer 
          aria-label="Navigasi Utama TAPAK"
          className="fixed sm:absolute bottom-0 left-0 right-0 z-30 w-full bg-[#0b1329]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-12px_32px_rgba(0,0,0,0.65)] px-4 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] flex items-center justify-between select-none"
        >
          {/* Sisi Kiri: Tab Riwayat Server Terpusat */}
          <div className="flex-1 flex justify-center items-center">
            <motion.button
              whileHover={!isCameraStarting ? { scale: 1.05 } : {}}
              whileTap={!isCameraStarting ? { scale: 0.92 } : {}}
              onClick={() => {
                if (isCameraStarting) return;
                setIsHistoryModalOpen(true);
              }}
              disabled={isCameraStarting}
              className={`relative flex flex-col items-center justify-center min-w-[76px] min-h-[52px] py-1 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl ${
                isCameraStarting 
                  ? 'opacity-40 cursor-not-allowed pointer-events-none text-slate-600' 
                  : 'text-slate-300 hover:text-cyan-400 cursor-pointer'
              }`}
              title="Riwayat Presensi Hari Ini"
              aria-label="Buka Riwayat Presensi"
            >
              <div className="relative p-1 rounded-xl group-hover:bg-slate-800/80 transition-colors">
                <HistoryIcon className="w-7 h-7 text-slate-200 group-hover:text-cyan-400 transition-colors" />
                {offlineQueue.length > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-black text-white bg-rose-600 rounded-full border-2 border-[#0b1329] shadow-md animate-pulse"
                    aria-label={`${offlineQueue.length} antrean luring belum terkirim`}
                  >
                    {offlineQueue.length}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-200 group-hover:text-cyan-400 mt-1">
                Riwayat
              </span>
            </motion.button>
          </div>

          {/* Sisi Tengah: Tombol Sentral Ekstra Besar 100px (Menempel ke Batas Bawah) */}
          <div className="flex-none flex flex-col items-center justify-center relative -top-8 px-1">
            {/* Efek Putaran Luar: Dual Glowing Radar Sweep atau Pulse Ring */}
            {isCameraStarting ? (
              <DualRadarSweep speed={1.1} />
            ) : syncStatus === 'syncing' ? (
              <DualRadarSweep speed={2.0} />
            ) : syncStatus === 'success' ? (
              <div className="absolute -inset-2 rounded-full animate-pulse-ring pointer-events-none" style={{ backgroundColor: 'rgba(59, 130, 246, 0.4)' }}></div>
            ) : null}

            <motion.button
              whileHover={syncStatus === 'success' && !isCameraStarting ? { scale: 1.04 } : {}}
              whileTap={syncStatus === 'success' && !isCameraStarting ? { scale: 0.94 } : {}}
              onClick={handleStartCamera}
              disabled={syncStatus === 'syncing' || syncStatus === 'error' || isCameraStarting}
              className={`relative flex flex-col items-center justify-center w-[6.25rem] h-[6.25rem] rounded-full shadow-[0_14px_35px_rgba(37,99,235,0.5)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50 ${
                syncStatus === 'success' && !isCameraStarting
                  ? 'cursor-pointer hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] border-[3px] border-[#486ae0]'
                  : isCameraStarting
                  ? 'cursor-wait pointer-events-none border-[3px] border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.5)]'
                  : 'cursor-not-allowed grayscale opacity-75 border-2 border-slate-700 pointer-events-none'
              }`}
              style={{
                background: syncStatus === 'success' || isCameraStarting
                  ? 'linear-gradient(145deg, #2f52b8, #18265e)'
                  : 'linear-gradient(145deg, #1e293b, #0f172a)'
              }}
              title={isCameraStarting ? "Sedang membuka kamera..." : "Mulai Absen / Scan QR"}
              aria-label={isCameraStarting ? "Sedang membuka kamera..." : "Mulai Absen dengan Scan QR"}
            >
              <div className="flex flex-col items-center justify-center pointer-events-none">
                {isCameraStarting ? (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 0.94, 1],
                        opacity: [0.75, 1, 0.85, 0.75],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.3,
                        ease: "easeInOut"
                      }}
                      className="relative flex items-center justify-center mb-1"
                    >
                      <div className="absolute inset-0 bg-cyan-400/25 rounded-full blur-md animate-pulse"></div>
                      <CameraIcon className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                    </motion.div>
                    <span className="text-xs font-black tracking-wider uppercase text-cyan-200 animate-pulse">
                      Membuka...
                    </span>
                  </>
                ) : (
                  <>
                    <CameraIcon className={`w-8 h-8 mb-1 transition-colors duration-300 ${syncStatus === 'success' ? 'text-white' : 'text-slate-500'}`} />
                    <span className={`text-xs font-black tracking-wider uppercase ${syncStatus === 'success' ? 'text-white' : 'text-slate-400'}`}>
                      Scan QR
                    </span>
                  </>
                )}
              </div>
            </motion.button>
          </div>

          {/* Sisi Kanan: Tab Perizinan Terpusat */}
          <div className="flex-1 flex justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (syncStatus === 'syncing' || syncStatus === 'error' || isCameraStarting) return;
                setIsLeaveModalOpen(true);
                setLeaveModalPhase('LEAVE_FORM');
                setLeaveForm({ teacherId: '', type: 'Sakit', isFullDay: false, sessions: [], reason: '', assigner: 'Kepala Sekolah' });
                setLeaveReasonError(false);
              }}
              disabled={syncStatus === 'syncing' || syncStatus === 'error' || isCameraStarting}
              className={`relative flex flex-col items-center justify-center min-w-[76px] min-h-[52px] py-1 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl ${
                syncStatus === 'success' && !isCameraStarting ? 'cursor-pointer text-slate-300 hover:text-amber-400' : 'opacity-50 cursor-not-allowed pointer-events-none text-slate-600'
              }`}
              title="Formulir Perizinan / Cuti"
              aria-label="Buka Formulir Perizinan"
            >
              <div className="p-1 rounded-xl group-hover:bg-slate-800/80 transition-colors">
                <DocumentIcon className={`w-7 h-7 transition-colors ${syncStatus === 'success' && !isCameraStarting ? 'text-amber-400 group-hover:text-amber-300' : 'text-slate-600'}`} />
              </div>
              <span className={`text-xs font-bold tracking-tight mt-1 transition-colors ${syncStatus === 'success' && !isCameraStarting ? 'text-slate-200 group-hover:text-amber-400' : 'text-slate-600'}`}>
                Perizinan
              </span>
            </motion.button>
          </div>

        </footer>

        {/* Ambient Darkening Transition Overlay saat kamera sedang dipersiapkan sebelum modal muncul */}
        <AnimatePresence>
          {isCameraStarting && !isModalOpen && (
            <motion.div
              key="camera-init-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
              style={{ backgroundColor: 'rgba(5, 8, 18, 0.98)' }}
            />
          )}
        </AnimatePresence>

        {/* ----------------- FULL SCREEN CAMERA OVERLAY ----------------- */}
        <AnimatePresence>
          {isModalOpen && modalPhase === 'SCANNING' && (
            <motion.div 
              key="camera-scanner-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-50 bg-black overflow-hidden flex flex-col"
            >
              {/* Background Layer: Layar Kamera Penuh */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div id="reader" className="w-full h-full bg-black flex items-center justify-center [&_video]:w-full [&_video]:h-full [&_video]:object-cover overflow-hidden"></div>
              </div>

              {/* Seamless Camera Stream Fade-In Overlay to eliminate flicker */}
              <AnimatePresence>
                {!isCameraReady && (
                  <motion.div
                    key="camera-warming-overlay"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0 z-20 bg-[#080c17] flex flex-col items-center justify-center pointer-events-none"
                  >
                    <div className="relative flex items-center justify-center mb-3">
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                        <CameraIcon className="w-10 h-10 text-cyan-300" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-cyan-200 tracking-wider uppercase animate-pulse">
                      Menyiapkan Kamera...
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Menghubungkan sensor video kelas
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Foreground Layer: UI Navigasi & Pembidik */}
              <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                
                {/* Top Bar */}
                <div className="absolute top-0 left-0 w-full z-20 flex justify-start items-start p-5 pointer-events-auto bg-gradient-to-b from-black/70 via-black/40 to-transparent pb-12">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseModal} 
                    className="p-2.5 rounded-full text-white bg-slate-900/80 hover:bg-slate-900 transition-colors border border-white/10 cursor-pointer"
                  >
                    <ArrowLeftIcon className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Reticle Pembidik dengan Animasi Ringan & Garis Laser CSS */}
                <div className="flex-1 flex items-center justify-center relative pointer-events-none">
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={
                      isScanSuccess 
                        ? { scale: [1, 1.06, 1], opacity: 1 }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative w-[70vw] max-w-[280px] aspect-square"
                  >
                    {/* Garis Pemindai QR CSS Border-Based Ringan (Bebas Efek Glow/Bayangan GPU) */}
                    {!isScanSuccess && (
                      <div className="absolute inset-x-2 top-2 border-b-2 border-cyan-400 animate-laser-scan pointer-events-none" />
                    )}

                    {/* Efek Flash Mengembang saat Sukses */}
                    {isScanSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: [0, 0.75, 0], scale: [0.95, 1.08, 1.04] }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute -inset-1.5 rounded-[2rem] border-2 border-emerald-400 pointer-events-none"
                      />
                    )}

                    {/* 4 Sudut Pembidik (Garis Border Bersih Bebas Filter Komposit) */}
                    <div className={`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 rounded-tl-[1.5rem] transition-colors duration-200 ${
                      isScanSuccess ? 'border-emerald-400' : 'border-white'
                    }`}></div>
                    
                    <div className={`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 rounded-tr-[1.5rem] transition-colors duration-200 ${
                      isScanSuccess ? 'border-emerald-400' : 'border-white'
                    }`}></div>
                    
                    <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 rounded-bl-[1.5rem] transition-colors duration-200 ${
                      isScanSuccess ? 'border-emerald-400' : 'border-white'
                    }`}></div>
                    
                    <div className={`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 rounded-br-[1.5rem] transition-colors duration-200 ${
                      isScanSuccess ? 'border-emerald-400' : 'border-white'
                    }`}></div>

                    {/* Lencana Centang Sukses Pop-In di Tengah Frame (Bebas Backdrop Blur) */}
                    {isScanSuccess && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                        transition={{ duration: 0.3, ease: "backOut" }}
                        className="absolute inset-0 flex items-center justify-center text-emerald-400 pointer-events-none"
                      >
                        <div className="p-3.5 bg-slate-900/95 rounded-full border border-emerald-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Bottom Sheet info & camera switch */}
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex-none relative pointer-events-none"
                >
                  <div className="absolute bottom-full left-0 w-full h-40 translate-y-8 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent pointer-events-none z-0"></div>
                  
                  <div className="bg-[#0f172a] rounded-t-[2rem] p-5 pb-8 pointer-events-auto flex flex-col items-center relative z-10">
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full mb-4"></div>
                    
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/30">
                          <QrCodeIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-[11px] font-medium text-slate-300 leading-snug">
                          Arahkan pada <br/><strong className="text-white text-xs">Kode QR Kelas</strong>
                        </p>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.93 }}
                        onClick={handleSwitchCamera} 
                        disabled={cameras.length <= 1} 
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 shadow-md ${cameras.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:text-blue-400 text-slate-300 transition-all cursor-pointer'}`}
                      >
                        <SwitchCameraIcon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Kamera</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------- MODAL POPUP DIALOGS ----------------- */}
        <AnimatePresence>
          {isModalOpen && modalPhase !== 'SCANNING' && (
            <motion.div 
              key="modal-popup-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4" 
              style={{ backgroundColor: 'rgba(5, 8, 18, 0.98)' }}
            >
              <motion.div 
                key="modal-popup-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
                className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col" 
                style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
              >
                
                {/* Header Modal */}
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#1e293b', backgroundColor: '#111827' }}>
                  <span className="text-sm font-bold text-slate-200">
                    {modalPhase === 'PIN_VERIFICATION' ? 'Akses Keamanan' :
                     modalPhase === 'SELECT_CLASS' ? 'Konfigurasi Ruangan' : 'Sistem'}
                  </span>
                  <button onClick={handleCloseModal} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-5 flex flex-col items-center justify-center min-h-[300px]">

                  {/* 1. PIN VERIFICATION */}
                  {modalPhase === 'PIN_VERIFICATION' && (
                    <div className={`flex flex-col items-center w-full ${pinErrorShake ? 'animate-shake' : ''}`}>
                      <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full mb-3 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-black text-slate-200 mb-1 tracking-wide uppercase">Verifikasi Akses</h3>
                      <p className="text-xs text-slate-400 mb-6 text-center">
                        Otorisasi PIN untuk <strong className="text-blue-400">{dynamicRoomData?.nama_ruangan}</strong>
                      </p>
                      
                      <div className="flex gap-3 mb-8">
                        {Array.from({ length: dynamicRoomData?.pin.toString().length || 4 }).map((_, i) => (
                          <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-colors ${pinInput.length > i ? 'border-blue-500 bg-blue-500/20 text-blue-100 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'border-slate-700 bg-slate-800 text-transparent'}`}>
                            {pinInput.length > i ? '•' : ''}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <motion.button 
                            key={num} 
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handlePinPress(num.toString())} 
                            className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xl font-bold shadow-md cursor-pointer transition-colors"
                          >
                            {num}
                          </motion.button>
                        ))}
                        <motion.button 
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setPinInput('')} 
                          className="h-14 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-sm font-bold shadow-md cursor-pointer transition-colors"
                        >
                          C
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handlePinPress('0')} 
                          className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xl font-bold shadow-md cursor-pointer transition-colors"
                        >
                          0
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setPinInput(prev => prev.slice(0, -1))} 
                          className="h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path>
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* 2. SELECT CLASS FOR SPECIAL ROOM */}
                  {modalPhase === 'SELECT_CLASS' && (
                    <div className="flex flex-col items-center w-full">
                      <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full mb-3 shadow-md">
                        <LocationIcon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-black text-slate-200 mb-1 uppercase tracking-wide">{dynamicRoomData?.nama_ruangan}</h3>
                      <p className="text-[10px] text-slate-400 mb-4 text-center leading-relaxed">
                        Sistem mendeteksi Anda di ruang khusus. Pilih kelas mana yang sedang Anda bawa ke ruangan ini.
                      </p>
                      
                      <div className="w-full max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {sortedClassGroups.map(group => (
                          <div key={group.groupKey} className="mb-4">
                            <h4 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest border-b border-slate-700/50 pb-1">{group.groupKey}</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {group.classes.map(namaKelas => (
                                <button 
                                  key={namaKelas} 
                                  onClick={() => handleDynamicClassSelect(namaKelas)} 
                                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700 active:bg-blue-600 transition-colors flex justify-center items-center shadow-md cursor-pointer"
                                >
                                  <span className="text-xs font-bold text-slate-200 truncate w-full text-center">
                                    {namaKelas.replace(/Kelas\s/i, '')}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2.5 KEGIATAN SEKOLAH (NON-EFEKTIF KBM) */}
                  {modalPhase === 'SCHOOL_EVENT' && (
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="p-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full mb-3 shadow-lg shadow-indigo-900/20">
                        <CalendarIcon className="w-12 h-12" />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                        Kegiatan Sekolah
                      </span>
                      <h3 className="text-xl font-black text-white mb-2 leading-snug">
                        {matchedSchoolEvent?.keterangan || 'KBM Non-Efektif'}
                      </h3>
                      <div className="text-[11px] text-slate-300 bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 mb-6 w-full leading-relaxed shadow-inner text-left space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                          <span className="text-slate-400 font-medium">Rentang Waktu:</span>
                          <span className="font-bold text-cyan-300">
                            {matchedSchoolEvent?.jam_mulai && matchedSchoolEvent?.jam_selesai
                              ? `${matchedSchoolEvent.jam_mulai} - ${matchedSchoolEvent.jam_selesai} WIB`
                              : 'Seharian Penuh'}
                          </span>
                        </div>
                        <p className="text-slate-300">
                          Sesi KBM pada jam ini dinonaktifkan untuk kegiatan resmi sekolah dan <strong>otomatis dikecualikan</strong> dari total target mengajar Anda.
                        </p>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10.5px] font-medium">
                          <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                          <span>Tidak dihitung alpa dan tidak perlu melakukan scan QR.</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5 w-full">
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCloseModal}
                          className="w-full py-3.5 rounded-xl font-bold text-sm shadow-md text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 cursor-pointer"
                        >
                          Mengerti & Kembali ke Beranda
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* 3. NO SCHEDULE */}
                  {modalPhase === 'NO_SCHEDULE' && (
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="p-4 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full mb-4 shadow-lg shadow-amber-900/20">
                        <AlertIcon className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-black text-amber-400 mb-2 uppercase tracking-wide">Tidak Ada Jadwal</h3>
                      <p className="text-[11px] text-slate-300 bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6 w-full leading-relaxed shadow-inner text-justify">
                        Sistem tidak menemukan jadwal aktif Anda di <span className="font-bold text-white">{scanResult?.ruang_belajar}</span>. Silakan pindai di waktu KBM yang sesuai atau infokan pada admin apabila terdapat kesalahan jadwal.
                      </p>
                      <div className="flex flex-col gap-3 w-full">
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setScannedToken('');
                            setScanResult(null);
                            setDynamicRoomData(null);
                            handleStartCamera();
                          }} 
                          className="w-full py-3.5 rounded-xl font-bold text-sm shadow-md text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 cursor-pointer"
                        >
                          Kembali Pindai QR
                        </motion.button>
                        <button 
                          onClick={() => setModalPhase('FORM')}
                          className="text-[10px] text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors mt-2 pb-1 cursor-pointer"
                        >
                          Tetap isi presensi darurat secara manual
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. FORM JURNAL & PRESENSI */}
                  {modalPhase === 'FORM' && scanResult && (
                    <div className="w-full">
                      
                      {!isManualMode ? (
                        <div className="rounded-2xl p-4 mb-4 shadow-lg relative overflow-hidden border" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderColor: '#334155' }}>
                          <div className="flex flex-col gap-2.5 mb-3 pb-3 border-b" style={{ borderColor: 'rgba(51, 65, 85, 0.6)' }}>
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-2.5">
                                <div className="relative flex-shrink-0">
                                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                                  <div className="relative w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                </div>
                                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wide uppercase">
                                  {scanResult.nama_kelas}
                                </span>
                              </div>
                              <div className="bg-indigo-600/30 border border-indigo-500/50 text-indigo-200 text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-inner">
                                Jam Ke: {scanResult.jam_ke}
                              </div>
                            </div>
                            <div className="flex">
                              <span className="bg-slate-800/80 text-slate-400 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-slate-700/60">
                                Mapel Ke-{scanResult.mapel_ke}
                              </span>
                            </div>
                          </div>
                          
                          <h4 className="text-base font-extrabold text-white mt-3 leading-tight">{scanResult.teacherName}</h4>
                          <p className="text-xs text-blue-300 font-medium mt-1.5 flex items-center gap-1.5"><BookIcon /> {scanResult.subject}</p>
                          
                          <div className="flex items-center gap-2 mt-3.5 pt-1 text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1"><ClockIcon /> {scanResult.waktu_mulai} - {scanResult.waktu_selesai} WIB</span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1"><LocationIcon /> {scanResult.ruang_belajar}</span>
                          </div>

                          {scanResult.nextTeacher && (
                            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(51, 65, 85, 0.6)' }}>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><NextIcon /> Selanjutnya:</p>
                              <p className="text-[11px] text-slate-300 truncate">
                                <span className="font-bold text-slate-200">{scanResult.nextTeacher.nama}</span> <span className="text-slate-500">({scanResult.nextTeacher.mapel})</span>
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl p-4 mb-4 shadow-lg relative overflow-hidden border border-amber-500/30" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                          <div className="flex items-center gap-2 mb-2 text-amber-400">
                            <AlertIcon className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Jadwal Tidak Ditemukan</span>
                          </div>
                          <p className="text-[10px] text-slate-300 mb-4 leading-relaxed">
                            Sistem tidak menemukan jadwal aktif. Silakan isi detail presensi secara manual untuk <strong className="text-white px-1.5 py-0.5 bg-slate-800 rounded">{scanResult.nama_kelas}</strong>.
                          </p>
                          
                          <div className="space-y-3.5">
                            {manualFormError && (
                              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] p-2 rounded-lg text-center font-bold">
                                {manualFormError}
                              </div>
                            )}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-slate-400 font-bold uppercase">Pendidik</label>
                              <select 
                                value={manualForm.kode_guru} 
                                onChange={e => { setManualForm({ ...manualForm, kode_guru: e.target.value }); setManualFormError(''); }} 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                              >
                                <option value="">-- Pilih Nama Guru --</option>
                                {localCache && localCache.master_guru && Object.entries(localCache.master_guru).map(([kode, data]) => (
                                  <option key={kode} value={kode}>{data.nama}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] text-slate-400 font-bold uppercase">Mata Pelajaran</label>
                              <select 
                                value={manualForm.kode_mapel} 
                                onChange={e => { setManualForm({ ...manualForm, kode_mapel: e.target.value }); setManualFormError(''); }} 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                              >
                                <option value="">-- Pilih Mata Pelajaran --</option>
                                {localCache && localCache.master_mapel && Object.entries(localCache.master_mapel).map(([kode, mapel]) => (
                                  <option key={kode} value={kode}>{mapel}</option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-slate-400 font-bold uppercase">Jam Ke</label>
                                <input 
                                  type="text" 
                                  placeholder="Misal: 1-2" 
                                  value={manualForm.jam_ke} 
                                  onChange={e => { setManualForm({ ...manualForm, jam_ke: e.target.value }); setManualFormError(''); }} 
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-slate-600" 
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-slate-400 font-bold uppercase">Mapel Ke</label>
                                <input 
                                  type="number" 
                                  placeholder="Misal: 1" 
                                  value={manualForm.mapel_ke} 
                                  onChange={e => { setManualForm({ ...manualForm, mapel_ke: e.target.value }); setManualFormError(''); }} 
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 placeholder:text-slate-600" 
                                />
                              </div>
                            </div>
                            
                            <datalist id="jamList">
                              {Array.from({ length: 24 }, (_, i) => <option key={i} value={String(i).padStart(2, '0')} />)}
                            </datalist>
                            <datalist id="menitList">
                              {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => <option key={m} value={m} />)}
                            </datalist>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-slate-400 font-bold uppercase">Mulai (WIB)</label>
                                <div className="flex items-center gap-1">
                                  <input type="text" inputMode="numeric" list="jamList" placeholder="HH" maxLength={2} value={manualForm.waktu_mulai_hh} onChange={e => { setManualForm({ ...manualForm, waktu_mulai_hh: e.target.value.replace(/\D/g, '') }); setManualFormError(''); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 text-center font-mono" />
                                  <span className="text-slate-400 font-bold">:</span>
                                  <input type="text" inputMode="numeric" list="menitList" placeholder="MM" maxLength={2} value={manualForm.waktu_mulai_mm} onChange={e => { setManualForm({ ...manualForm, waktu_mulai_mm: e.target.value.replace(/\D/g, '') }); setManualFormError(''); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 text-center font-mono" />
                                </div>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] text-slate-400 font-bold uppercase">Selesai (WIB)</label>
                                <div className="flex items-center gap-1">
                                  <input type="text" inputMode="numeric" list="jamList" placeholder="HH" maxLength={2} value={manualForm.waktu_selesai_hh} onChange={e => { setManualForm({ ...manualForm, waktu_selesai_hh: e.target.value.replace(/\D/g, '') }); setManualFormError(''); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 text-center font-mono" />
                                  <span className="text-slate-400 font-bold">:</span>
                                  <input type="text" inputMode="numeric" list="menitList" placeholder="MM" maxLength={2} value={manualForm.waktu_selesai_mm} onChange={e => { setManualForm({ ...manualForm, waktu_selesai_mm: e.target.value.replace(/\D/g, '') }); setManualFormError(''); }} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 text-center font-mono" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 w-full">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Kegiatan Pembelajaran Sesi Ini <span className="text-red-500 text-xs">*</span>
                          </label>
                          <textarea 
                            value={kegiatan} 
                            onChange={(e) => {
                              setKegiatan(e.target.value);
                              if (e.target.value.trim() !== '') setKegiatanError(false);
                            }} 
                            placeholder="Tulis ringkasan kegiatan belajar disini..." 
                            className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white placeholder:text-slate-600 transition-all resize-none h-20 outline-none ${kegiatanError ? 'border-red-500 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-blue-500'}`}
                          ></textarea>
                          {kegiatanError && (
                            <span className="text-[10px] text-red-400 font-medium animate-pulse mt-0.5">
                              Keterangan kegiatan pembelajaran wajib diisi sebelum mengirim presensi.
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-3 p-3 border border-slate-700 rounded-xl transition-colors" style={{ backgroundColor: '#131e33' }}>
                          <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-200">Guru Pengganti (Inval)</span>
                              <span className="text-[10px] text-slate-400">Aktifkan jika Anda menggantikan guru lain.</span>
                            </div>
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                checked={isPengganti} 
                                onChange={(e) => {
                                  setIsPengganti(e.target.checked);
                                  if (!e.target.checked) {
                                    setPenggantiSearch('');
                                    setSelectedPenggantiName('');
                                    setSelectedPenggantiId('');
                                    setPenggantiError(false);
                                  }
                                }} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </div>
                          </label>

                          {isPengganti && (
                            <div className="flex flex-col gap-1.5 relative pt-2 border-t border-slate-700/50">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cari Nama Anda <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={penggantiSearch}
                                  onChange={(e) => {
                                    setPenggantiSearch(e.target.value);
                                    setIsPenggantiDropdownOpen(true);
                                    setSelectedPenggantiName(''); 
                                    setSelectedPenggantiId('');
                                    setPenggantiError(false);
                                  }}
                                  onFocus={() => setIsPenggantiDropdownOpen(true)}
                                  placeholder="Ketik nama Anda..."
                                  className={`w-full bg-slate-900 border ${penggantiError ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-blue-500'} rounded-xl p-3 text-sm text-slate-200 outline-none relative z-20`}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-slate-400">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                              </div>
                              
                              {isPenggantiDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setIsPenggantiDropdownOpen(false)}></div>
                                  <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-slate-800 border border-slate-700 rounded-xl max-h-48 overflow-y-auto shadow-2xl">
                                    {displayedPenggantiTeachers.length > 0 ? (
                                      <>
                                        {displayedPenggantiTeachers.map(t => (
                                          <div
                                            key={t.id}
                                            onClick={() => {
                                              setSelectedPenggantiName(t.nama);
                                              setSelectedPenggantiId(t.id);
                                              setPenggantiSearch(t.nama);
                                              setIsPenggantiDropdownOpen(false);
                                              setPenggantiError(false);
                                            }}
                                            className="p-3 text-sm text-slate-200 hover:bg-slate-700 hover:text-blue-400 cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors"
                                          >
                                            <span className="block font-semibold">{t.nama}</span>
                                          </div>
                                        ))}
                                        {filteredPenggantiTeachers.length > 15 && (
                                          <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-900/80 border-t border-slate-700">
                                            Menampilkan 15 dari {filteredPenggantiTeachers.length} guru. Ketik lebih spesifik...
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div className="p-3 text-sm text-slate-500 italic text-center">Nama tidak ditemukan</div>
                                    )}
                                  </div>
                                </>
                              )}
                              {penggantiError && (
                                <span className="text-[10px] text-red-400 font-medium animate-pulse mt-0.5">
                                  Wajib memilih nama guru pengganti dari daftar.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          if (isManualMode) {
                            if (!manualForm.kode_guru || !manualForm.kode_mapel || !manualForm.jam_ke || !manualForm.mapel_ke || !manualForm.waktu_mulai_hh || !manualForm.waktu_mulai_mm || !manualForm.waktu_selesai_hh || !manualForm.waktu_selesai_mm) {
                              setManualFormError('Semua kolom manual (Pendidik, Mapel, Jam, Waktu) wajib diisi.');
                              return;
                            }
                            
                            const isValidTime = (hh: string, mm: string) => { 
                              const h = parseInt(hh, 10); 
                              const m = parseInt(mm, 10); 
                              return !isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59; 
                            };
                            if (!isValidTime(manualForm.waktu_mulai_hh, manualForm.waktu_mulai_mm) || !isValidTime(manualForm.waktu_selesai_hh, manualForm.waktu_selesai_mm)) {
                              setManualFormError('Format waktu tidak valid (Jam: 00-23, Menit: 00-59).');
                              return;
                            }
                          }
                          
                          let hasError = false;
                          if (kegiatan.trim() === '') {
                            setKegiatanError(true);
                            hasError = true;
                          }
                          
                          if (isPengganti && !selectedPenggantiName) {
                            setPenggantiError(true);
                            hasError = true;
                          }

                          if (!hasError) {
                            setShowConfirmation(true);
                          }
                        }} 
                        className="mt-6 w-full py-3.5 rounded-xl font-bold text-sm shadow-lg text-white cursor-pointer" 
                        style={{ background: 'linear-gradient(90deg, #2563eb, #4f46e5)' }}
                      >
                        Kirim Presensi Sekarang
                      </motion.button>

                      <div className="mt-4 text-center">
                        <p className="text-[11px] text-slate-400">
                          Bukan jadwal Anda?{' '}
                          <button 
                            onClick={() => {
                              setScannedToken('');
                              setKegiatan('');
                              setKegiatanError(false);
                              setIsPengganti(false);
                              setPenggantiSearch('');
                              setSelectedPenggantiName('');
                              setSelectedPenggantiId('');
                              setPenggantiError(false);
                              setScanResult(null);
                              setShowConfirmation(false);
                              setDynamicRoomData(null);
                              handleStartCamera();
                            }}
                            className="text-blue-400 font-bold hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RefreshIcon /> Klik disini untuk scan ulang
                          </button>
                        </p>
                      </div>
                      
                    </div>
                  )}

                  {/* 5. LOADING */}
                  {modalPhase === 'LOADING' && (
                    <div className="flex flex-col items-center justify-center py-10">
                      <SpinnerIcon className="w-12 h-12 text-blue-400 mb-4" />
                      <p className="text-xs text-slate-300">Memproses Data...</p>
                    </div>
                  )}

                  {/* 6. ERROR */}
                  {modalPhase === 'ERROR' && (
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full mb-3"><CloseIcon className="w-8 h-8" /></div>
                      <p className="text-xs text-slate-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-5 w-full leading-relaxed">{apiError}</p>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartCamera} 
                        className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs cursor-pointer"
                      >
                        Coba Lagi
                      </motion.button>
                    </div>
                  )}

                  {/* 7. SUCCESS OFFLINE */}
                  {modalPhase === 'SUCCESS_OFFLINE' && scanResult && (
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
                        <div className="relative p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                          <CloudSyncIcon className="w-12 h-12" />
                        </div>
                      </div>
                      <h3 className="text-xl font-extrabold text-amber-400 mb-1">Tersimpan Lokal</h3>
                      <p className="text-[10px] text-amber-200/70 mb-4 px-2">Koneksi terputus. Data aman di perangkat Anda dan akan disinkronkan otomatis saat online.</p>
                      
                      <div className="w-full rounded-2xl p-4 text-left space-y-3 text-xs mb-6" style={{ backgroundColor: '#162331', border: '1px solid #1e3a47' }}>
                        <div><span className="text-slate-400 text-[10px] uppercase font-semibold">Nama Pendidik</span><p className="text-sm font-bold text-slate-100 mt-0.5">{scanResult.teacherName}</p></div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                          <div><span className="text-slate-400 text-[10px] uppercase">Waktu Simpan</span><p className="font-medium text-amber-400 font-mono mt-0.5">{scanResult.timestamp}</p></div>
                        </div>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCloseModal} 
                        className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-900/20 transition-colors cursor-pointer"
                      >
                        Selesai (Mengajar Kembali)
                      </motion.button>
                    </div>
                  )}

                  {/* 8. SUCCESS ONLINE */}
                  {modalPhase === 'SUCCESS' && scanResult && (
                    <div className="flex flex-col items-center text-center w-full">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                        <div className="relative p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                          <CheckCircleIcon className="w-12 h-12" />
                        </div>
                      </div>
                      <h3 className="text-xl font-extrabold text-emerald-400 mb-4">Berhasil!</h3>
                      <div className="w-full rounded-2xl p-4 text-left space-y-3 text-xs mb-6" style={{ backgroundColor: '#162331', border: '1px solid #1e3a47' }}>
                        <div><span className="text-slate-400 text-[10px] uppercase font-semibold">Nama Pendidik</span><p className="text-sm font-bold text-slate-100 mt-0.5">{scanResult.teacherName}</p></div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                          <div><span className="text-slate-400 text-[10px] uppercase">Waktu Tercatat</span><p className="font-medium text-emerald-400 font-mono mt-0.5">{scanResult.timestamp}</p></div>
                        </div>
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCloseModal} 
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                      >
                        Selesai
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------- KONFIRMASI INTEGRITAS AKADEMIK ----------------- */}
        <AnimatePresence>
          {showConfirmation && modalPhase === 'FORM' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
              style={{ backgroundColor: 'rgba(5, 8, 18, 0.98)' }}
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
                className="w-full max-w-md max-h-[85vh] flex flex-col border border-slate-200 rounded-2xl shadow-2xl bg-slate-50 overflow-hidden"
              >
                
                <div className="p-5 overflow-y-auto flex-1">
                  <div className="flex items-center gap-3 mb-5 text-red-600">
                    <AlertIcon className="w-7 h-7 flex-shrink-0" />
                    <h3 className="font-black text-base uppercase tracking-wide">Konfirmasi Integritas</h3>
                  </div>
                  
                  <p className="text-base font-bold text-slate-800 mb-5 leading-relaxed">
                    Apakah Anda mengonfirmasi bahwa presensi ini diisi langsung oleh Guru yang bersangkutan di <strong className="text-blue-600">{scanResult?.ruang_belajar}</strong> sesuai jadwal?
                  </p>
                  
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4 shadow-sm">
                    <p className="text-sm font-bold text-red-600 leading-relaxed text-justify">
                      Perhatian: Mewakilkan presensi kepada siswa, mengisi di luar ruang kelas, atau menggunakan duplikat QR Code merupakan pelanggaran integritas akademik dan kode etik guru.
                    </p>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-[10px] text-slate-500 leading-relaxed text-justify">
                      Sistem mencatat rekam jejak digital secara otomatis. Apabila terdapat kendala atau penyalahgunaan, mohon segera laporkan kepada Kepala Sekolah.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col gap-2.5">
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setShowConfirmation(false);
                        submitData();
                      }}
                      className="w-full py-3.5 rounded-xl font-bold text-sm shadow-md text-white text-center leading-snug px-3 cursor-pointer" 
                      style={{ background: 'linear-gradient(90deg, #0284c7, #2563eb)' }}
                    >
                      Ya, Saya Guru Bersangkutan dan mengisi di kelas
                    </motion.button>
                    <button 
                      onClick={() => setShowConfirmation(false)}
                      className="w-full py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------- MODAL FORMULIR PERIZINAN / CUTI ----------------- */}
        <AnimatePresence>
          {isLeaveModalOpen && (
            <motion.div 
              key="leave-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4" 
              style={{ backgroundColor: 'rgba(5, 8, 18, 0.98)' }}
            >
              <motion.div 
                key="leave-modal-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
                className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" 
                style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
              >
                
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#1e293b', backgroundColor: '#111827' }}>
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <DocumentIcon className="w-4 h-4"/> Pengajuan Izin Pendidik
                  </span>
                  <button onClick={() => setIsLeaveModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto">
                  {leaveModalPhase === 'LEAVE_FORM' && (
                    <div className="space-y-4">
                      
                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Guru</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={teacherSearch}
                            onChange={(e) => {
                              setTeacherSearch(e.target.value);
                              setIsTeacherDropdownOpen(true);
                              if (leaveForm.teacherId) setLeaveForm({ ...leaveForm, teacherId: '', sessions: [] });
                            }}
                            onFocus={() => setIsTeacherDropdownOpen(true)}
                            placeholder="Ketik atau cari nama Anda..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 outline-none relative z-20"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>

                        {isTeacherDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsTeacherDropdownOpen(false)}></div>
                            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-slate-800 border border-slate-700 rounded-xl max-h-48 overflow-y-auto shadow-2xl">
                              {displayedLeaveTeachers.length > 0 ? (
                                <>
                                  {displayedLeaveTeachers.map(t => (
                                    <div 
                                      key={t.id} 
                                      onClick={() => {
                                        setLeaveForm({ ...leaveForm, teacherId: t.id, sessions: [] });
                                        setTeacherSearch(t.nama);
                                        setIsTeacherDropdownOpen(false);
                                      }}
                                      className="p-3 text-sm text-slate-200 hover:bg-slate-700 hover:text-amber-400 cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors"
                                    >
                                      <span className="block font-semibold">{t.nama}</span>
                                      <span className="text-[10px] text-slate-400">NIP: {t.nip !== '-' ? t.nip : 'Non-ASN'}</span>
                                    </div>
                                  ))}
                                  {filteredLeaveTeachers.length > 15 && (
                                    <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-900/80 border-t border-slate-700">
                                      Menampilkan 15 dari {filteredLeaveTeachers.length} guru. Ketik lebih spesifik...
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="p-3 text-sm text-slate-500 italic text-center">Nama tidak ditemukan</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanggal (Hari Ini)</label>
                          <div className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-400 cursor-not-allowed">
                            {dateStr}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jenis Izin</label>
                          <select 
                            value={leaveForm.type} 
                            onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value, reason: '', assigner: 'Kepala Sekolah' })} 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 outline-none"
                          >
                            <option value="Sakit">Sakit</option>
                            <option value="Keperluan Pribadi">Keperluan Pribadi</option>
                            <option value="Dinas Luar">Dinas Luar</option>
                            <option value="Instruksi Pimpinan">Instruksi Pimpinan</option>
                          </select>
                        </div>
                      </div>

                      {/* Opsi Izin Seharian Penuh (Hanya jika guru memiliki jadwal jam pelajaran) */}
                      {(!leaveForm.teacherId || currentTeacherSchedules.length > 0) && (
                        <div className="pt-2">
                          <label className="flex items-center justify-between p-3 border border-slate-700 rounded-xl cursor-pointer transition-colors" style={{ backgroundColor: leaveForm.isFullDay ? '#1e293b' : '#0f172a' }}>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-200">Izin Seharian Penuh</span>
                              <span className="text-[10px] text-slate-400">Apabila izin seluruh jam mengajar hari ini, silakan aktifkan.</span>
                            </div>
                            <div className="relative inline-flex items-center">
                              <input 
                                type="checkbox" 
                                checked={leaveForm.isFullDay} 
                                onChange={(e) => setLeaveForm({ ...leaveForm, isFullDay: e.target.checked, sessions: [] })} 
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* Sesi KBM atau Panel Informasi Izin Harian Non-KBM */}
                      {leaveForm.teacherId && (
                        currentTeacherSchedules.length > 0 ? (
                          <div className={`mt-4 p-3 rounded-xl border border-blue-500/30 bg-blue-900/10 transition-all duration-300 ${leaveForm.isFullDay ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2">Centang Sesi Yang Ditinggalkan:</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                              {currentTeacherSchedules.map(sched => {
                                const isEvent = sched.isKegiatanSekolah;
                                return (
                                  <label 
                                    key={sched.id} 
                                    className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                                      isEvent
                                        ? 'border-indigo-500/30 bg-indigo-950/20 opacity-80 cursor-default'
                                        : 'border-slate-700 cursor-pointer hover:bg-slate-800/50'
                                    }`} 
                                    style={{ backgroundColor: !isEvent && sched.id && leaveForm.sessions.includes(sched.id) ? '#1e3a5f' : undefined }}
                                  >
                                    <input 
                                      type="checkbox" 
                                      disabled={isEvent}
                                      checked={isEvent ? false : (sched.id ? leaveForm.sessions.includes(sched.id) : false)} 
                                      onChange={() => !isEvent && sched.id && handleLeaveSessionToggle(sched.id)} 
                                      className="mt-1" 
                                    />
                                    <div className="flex flex-col w-full">
                                      <div className="flex justify-between items-center w-full">
                                        <span className="text-xs font-bold text-slate-200">{sched.nama_kelas}</span>
                                        {isEvent ? (
                                          <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-medium">
                                            Kegiatan Sekolah (Dikecualikan)
                                          </span>
                                        ) : (
                                          <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Jam {sched.jam_ke}</span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-slate-400 mt-0.5">{sched.mata_pelajaran} • {sched.jam_mulai} - {sched.jam_selesai}</span>
                                      {isEvent && (
                                        <span className="text-[9.5px] text-indigo-200/80 mt-1 italic">
                                          {sched.kegiatanName || 'KBM Non-Efektif'} • Jam ini bebas presensi & tidak dihitung alpa
                                        </span>
                                      )}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3.5 p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 shadow-sm flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-amber-400">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-bold uppercase tracking-wider">Izin Harian (Non-KBM)</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Pendidik tidak memiliki jadwal tatap muka kelas hari ini. Pengajuan akan dicatat ke sheet <strong className="text-amber-300 font-mono">IzinHarian</strong> untuk rekap presensi harian tanpa mengurangi persentase jam KBM (0 jam mengajar).
                            </p>
                          </div>
                        )
                      )}

                      <div key={leaveForm.type} className="flex flex-col gap-3 pt-2">
                        {leaveForm.type === 'Sakit' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jenis Sakit / Keterangan Medis <span className="text-red-500 text-xs">*</span></label>
                            <textarea 
                              value={leaveForm.reason} 
                              onChange={(e) => { setLeaveForm({ ...leaveForm, reason: e.target.value }); if (e.target.value.trim()) setLeaveReasonError(false); }} 
                              placeholder="Contoh: Demam, tifus, atau lampirkan surat keterangan dokter ke TU..." 
                              className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white placeholder:text-slate-600 transition-all resize-none h-16 outline-none ${leaveReasonError ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-amber-500'}`}
                            ></textarea>
                          </div>
                        )}
                        
                        {leaveForm.type === 'Keperluan Pribadi' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detail Keperluan Pribadi <span className="text-red-500 text-xs">*</span></label>
                            <textarea 
                              value={leaveForm.reason} 
                              onChange={(e) => { setLeaveForm({ ...leaveForm, reason: e.target.value }); if (e.target.value.trim()) setLeaveReasonError(false); }} 
                              placeholder="Contoh: Mengantar orang tua kontrol ke rumah sakit..." 
                              className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white placeholder:text-slate-600 transition-all resize-none h-16 outline-none ${leaveReasonError ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-amber-500'}`}
                            ></textarea>
                          </div>
                        )}
                        
                        {leaveForm.type === 'Dinas Luar' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Kegiatan, Tempat & Penyelenggara <span className="text-red-500 text-xs">*</span></label>
                            <textarea 
                              value={leaveForm.reason} 
                              onChange={(e) => { setLeaveForm({ ...leaveForm, reason: e.target.value }); if (e.target.value.trim()) setLeaveReasonError(false); }} 
                              placeholder="Contoh: Rapat MGMP Bahasa Indonesia di Disdik Kabupaten..." 
                              className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white placeholder:text-slate-600 transition-all resize-none h-16 outline-none ${leaveReasonError ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-amber-500'}`}
                            ></textarea>
                          </div>
                        )}
                        
                        {leaveForm.type === 'Instruksi Pimpinan' && (
                          <>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pemberi Instruksi / Tugas</label>
                              <select 
                                value={leaveForm.assigner} 
                                onChange={(e) => setLeaveForm({ ...leaveForm, assigner: e.target.value })} 
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 outline-none"
                              >
                                <option value="Kepala Sekolah">Kepala Sekolah</option>
                                <option value="Wakasek Kurikulum">Wakasek Kurikulum</option>
                                <option value="Wakasek Kesiswaan">Wakasek Kesiswaan</option>
                                <option value="Wakasek Sarpras">Wakasek Sarpras</option>
                                <option value="Wakasek Humas">Wakasek Humas</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Detail Instruksi <span className="text-red-500 text-xs">*</span></label>
                              <textarea 
                                value={leaveForm.reason} 
                                onChange={(e) => { setLeaveForm({ ...leaveForm, reason: e.target.value }); if (e.target.value.trim()) setLeaveReasonError(false); }} 
                                placeholder="Contoh: Menyelesaikan tugas membuat laporan..." 
                                className={`w-full bg-slate-900 border rounded-xl p-3 text-sm text-white placeholder:text-slate-600 transition-all resize-none h-16 outline-none ${leaveReasonError ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-slate-700 focus:border-amber-500'}`}
                              ></textarea>
                            </div>
                          </>
                        )}
                        {leaveReasonError && (
                          <span className="text-[10px] text-red-400 font-medium animate-pulse mt-0.5">
                            Detail/alasan izin wajib diisi sebelum mengajukan.
                          </span>
                        )}
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.96 }}
                        onClick={submitLeaveRequest} 
                        disabled={
                          !leaveForm.teacherId || 
                          (currentTeacherSchedules.length > 0 && !leaveForm.isFullDay && leaveForm.sessions.length === 0)
                        } 
                        className="mt-4 w-full py-3.5 rounded-xl font-bold text-sm shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" 
                        style={{ background: 'linear-gradient(90deg, #d97706, #b45309)' }}
                      >
                        Ajukan Perizinan
                      </motion.button>
                    </div>
                  )}

                  {leaveModalPhase === 'LOADING_LEAVE' && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <SpinnerIcon className="w-12 h-12 text-amber-400 mb-4" />
                      <p className="text-xs text-slate-300">Mengirim pengajuan izin...</p>
                    </div>
                  )}
                  
                  {leaveModalPhase === 'SUCCESS_LEAVE_OFFLINE' && (
                    <div className="flex flex-col items-center text-center w-full py-4">
                      <div className="relative mb-3"><div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div><div className="relative p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full"><CloudSyncIcon className="w-12 h-12" /></div></div>
                      <h3 className="text-xl font-extrabold text-amber-400 mb-2">Tersimpan Lokal</h3>
                      <p className="text-xs text-amber-200/70 mb-6 px-4 leading-relaxed">Koneksi terputus. Data perizinan aman di antrean dan akan dikirim otomatis ke server saat Anda online kembali.</p>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsLeaveModalOpen(false)} 
                        className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Tutup Layar Ini
                      </motion.button>
                    </div>
                  )}

                  {leaveModalPhase === 'SUCCESS_LEAVE' && (
                    <div className="flex flex-col items-center text-center w-full py-4">
                      <div className="relative mb-3"><div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div><div className="relative p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full"><CheckCircleIcon className="w-12 h-12" /></div></div>
                      <h3 className="text-xl font-extrabold text-emerald-400 mb-2">Pengajuan Berhasil!</h3>
                      <p className="text-xs text-slate-300 mb-6 px-4 leading-relaxed">Data izin Anda telah tercatat pada server secara otomatis per jadwal kelas yang dipilih.</p>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsLeaveModalOpen(false)} 
                        className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Tutup Layar Ini
                      </motion.button>
                    </div>
                  )}

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------- MODAL RIWAYAT & ANTREAN LURING ----------------- */}
        <AnimatePresence>
          {isHistoryModalOpen && (
            <motion.div 
              key="history-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4" 
              style={{ backgroundColor: 'rgba(5, 8, 18, 0.98)' }}
            >
              <motion.div 
                key="history-modal-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
                className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" 
                style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
              >
                
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#1e293b', backgroundColor: '#111827' }}>
                  <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5 text-blue-400"/> Riwayat Hari Ini
                  </span>
                  <button onClick={() => setIsHistoryModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 bg-slate-900/50 custom-scrollbar">
                  
                  {/* Antrean Luring */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 relative">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <CloudSyncIcon className="w-4 h-4 text-amber-500" /> Antrean Luring ({offlineQueue.length})
                        </h3>
                        {/* Tombol Info Tooltip */}
                        <div className="relative inline-flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowOfflineInfoTooltip(prev => !prev)}
                            onMouseEnter={() => setShowOfflineInfoTooltip(true)}
                            onMouseLeave={() => setShowOfflineInfoTooltip(false)}
                            className="p-0.5 rounded-full text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
                            title="Penjelasan Sinkronisasi Otomatis"
                            aria-label="Info sinkronisasi otomatis"
                          >
                            <InfoIcon className="w-3.5 h-3.5 text-amber-400/90" />
                          </button>
                          
                          {/* Tooltip Popover Floating */}
                          <AnimatePresence>
                            {showOfflineInfoTooltip && (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute left-0 bottom-full mb-2 w-64 p-2.5 rounded-xl bg-slate-950 border border-amber-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.2)] text-[10.5px] text-amber-200 z-50 pointer-events-none"
                              >
                                <div className="font-semibold text-amber-100 flex items-center gap-1 mb-1">
                                  <InfoIcon className="w-3.5 h-3.5 text-amber-400" />
                                  Sinkronisasi Otomatis
                                </div>
                                <p className="leading-relaxed text-slate-300">
                                  Data presensi tersimpan aman di memori perangkat dan akan terkirim otomatis ke server segera setelah koneksi internet kembali stabil tanpa perlu scan ulang.
                                </p>
                                <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-slate-950 border-r border-b border-amber-500/40 transform rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {isOnline && offlineQueue.length > 0 && !isBackgroundSyncing && (
                        <button
                          onClick={() => autoSyncOfflineData()}
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          Sinkronkan Sekarang
                        </button>
                      )}
                    </div>

                    {/* Info Card Penjelas Kepercayaan Pengguna */}
                    <div className="mb-3 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 shadow-sm">
                      <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5">
                        <InfoIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-amber-200 leading-snug">
                          {offlineQueue.length > 0 
                            ? 'Data presensi tersimpan aman di perangkat' 
                            : 'Penyimpanan luring aktif & otomatis'}
                        </p>
                        <p className="text-[10px] text-amber-300/80 leading-relaxed mt-0.5">
                          Data akan <span className="text-amber-100 font-semibold underline decoration-amber-400/50">terkirim otomatis</span> segera setelah koneksi internet kembali stabil, sehingga Anda tidak perlu khawatir atau memindai ulang.
                        </p>
                      </div>
                    </div>

                    {/* Real-Time Sync Progress Indicator (Batch Processing Feedback) */}
                    {(isBackgroundSyncing || syncProgress) && (
                      <div className="mb-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            Syncing {syncProgress ? `${syncProgress.current} of ${syncProgress.total}` : '...'}
                          </span>
                          <span className="font-mono text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                            {syncProgress && syncProgress.total > 0
                              ? `${Math.round((syncProgress.current / syncProgress.total) * 100)}%`
                              : '0%'}
                          </span>
                        </div>
                        {/* Percentage Progress Bar */}
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-amber-500/20">
                          <div
                            className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full rounded-full transition-all duration-300 ease-out"
                            style={{
                              width: `${
                                syncProgress && syncProgress.total > 0
                                  ? Math.max(8, Math.min(100, Math.round((syncProgress.current / syncProgress.total) * 100)))
                                  : 12
                              }%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-amber-200/80 leading-tight">
                          Mengirim antrean luring dalam batch per 3 sesi ke server...
                        </p>
                      </div>
                    )}

                    {offlineQueue.length === 0 ? (
                      <div className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500">Tidak ada antrean tertunda.</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {offlineQueue.map((item, idx) => {
                          const isLeave = item.payload?.is_leave || item.payload?.is_non_kbm || item.payload?.target_sheet === 'IzinHarian';
                          const leaveType = item.payload?.leave_type || (item.payload?.is_non_kbm ? 'Izin Harian' : 'Izin');
                          const jamKe = item.payload?.data_jadwal?.jam_ke;
                          const namaKelas = item.payload?.data_jadwal?.nama_kelas || (item.payload?.is_non_kbm ? 'Non-KBM' : 'Kelas');
                          const subject = item.payload?.data_jadwal?.subject || (isLeave ? `Pengajuan: ${leaveType}` : '-');
                          const teacherName = item.payload?.data_jadwal?.teacherName || item.payload?.nama_guru || '-';

                          return (
                            <div key={idx} className="flex flex-col gap-1.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl shadow-sm">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide ${
                                      isLeave ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}>
                                      {isLeave ? (leaveType === 'Hadir' ? 'Hadir KBM' : leaveType) : 'Hadir KBM'}
                                    </span>
                                    {jamKe && jamKe !== '-' && (
                                      <span className="text-[9px] font-bold text-amber-200/90 bg-slate-800/90 px-1.5 py-0.5 rounded border border-amber-500/20">
                                        Jam Ke {jamKe}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs font-bold text-amber-100 truncate">{teacherName}</p>
                                  <p className="text-[11px] text-amber-200/90 font-medium truncate">{subject}</p>
                                </div>
                                <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 px-2 py-1 rounded-md border border-amber-500/30 flex-shrink-0 mt-0.5">
                                  {item.timestamp}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-amber-200/70 border-t border-amber-500/20 pt-2 mt-0.5">
                                <span className="font-semibold text-amber-300 truncate max-w-[140px]">{namaKelas}</span>
                                <span className="flex items-center gap-1 font-mono bg-amber-900/40 px-1.5 py-0.5 rounded flex-shrink-0">
                                  <ClockIcon className="w-2.5 h-2.5"/> 
                                  {item.payload?.data_jadwal?.waktu_mulai ? `${item.payload.data_jadwal.waktu_mulai} - ${item.payload.data_jadwal.waktu_selesai} WIB` : item.timestamp}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Sudah Terkirim */}
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Sudah Terkirim ({sentHistory.length})
                    </h3>
                    {sentHistory.length === 0 ? (
                      <div className="p-3 bg-slate-800/30 border border-slate-700/30 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500">Belum ada riwayat presensi hari ini.</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sentHistory.map((item, idx) => {
                          const isLeave = item.jenis_kehadiran && item.jenis_kehadiran !== 'Hadir';
                          const statusLabel = isLeave ? item.jenis_kehadiran : 'Hadir KBM';

                          return (
                            <div key={idx} className="flex flex-col gap-1.5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-sm">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      {statusLabel}
                                    </span>
                                    {item.jam_ke && item.jam_ke !== '-' && (
                                      <span className="text-[9px] font-bold text-emerald-200/90 bg-slate-800/90 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                        Jam Ke {item.jam_ke}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs font-bold text-emerald-100 truncate">{item.teacherName}</p>
                                  <p className="text-[11px] text-emerald-200/90 font-medium truncate">{item.subject}</p>
                                </div>
                                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1 flex-shrink-0 mt-0.5">
                                  <CheckCircleIcon className="w-3 h-3"/> {item.timestamp}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-emerald-200/70 border-t border-emerald-500/20 pt-2 mt-0.5">
                                <span className="font-semibold text-emerald-300 truncate max-w-[140px]">{item.nama_kelas}</span>
                                <span className="flex items-center gap-1 font-mono bg-emerald-900/40 px-1.5 py-0.5 rounded flex-shrink-0">
                                  <ClockIcon className="w-2.5 h-2.5"/> 
                                  {item.waktu_mulai && item.waktu_selesai && item.waktu_mulai !== '-' ? `${item.waktu_mulai} - ${item.waktu_selesai} WIB` : item.timestamp}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Panduan Tambah ke Layar Utama (iOS / Browser Tanpa Prompt Otomatis) */}
        <AnimatePresence>
          {isIosInstallModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(5, 8, 18, 0.98)' }}
              onClick={() => setIsIosInstallModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/30 p-5 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Pasang TAPAK Scan</h3>
                      <p className="text-[10px] text-slate-400">Panduan Layar Utama Ponsel</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsIosInstallModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <p className="leading-relaxed text-[11px] text-slate-300">
                    Browser Anda memerlukan satu langkah konfirmasi manual untuk menambahkan ikon aplikasi:
                  </p>
                  <div className="space-y-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                      <span className="text-[11px]">Ketuk menu titik tiga (<strong className="text-white">⋮</strong>) di Chrome atau tombol Bagikan (<strong className="text-cyan-400">Share</strong>) di Safari.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                      <span className="text-[11px]">Pilih opsi <strong className="text-white">"Tambahkan ke Layar Utama"</strong> atau <strong className="text-white">"Instal Aplikasi"</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                      <span className="text-[11px]">Aplikasi siap dibuka langsung dari layar utama HP Anda dengan kecepatan instan dan dukungan mode luring penuh.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsIosInstallModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  Mengerti
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
