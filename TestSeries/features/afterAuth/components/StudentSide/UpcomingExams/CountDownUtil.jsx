// CountDownUtil.js
import { useEffect, useRef, useState } from "react";

const IST_TZ = "Asia/Kolkata";
const IST_OFFSET_MIN = 330; // +05:30
const pad2 = (n) => String(n).padStart(2, "0");

// Accepts: "HH:mm", "HH:mm:ss", "HH:mm:ss.sss", and tz: "Z", "+HH", "+HHMM", "+HH:MM", "-HH", "-HHMM", "-HH:MM"
const TIME_RE =
  /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|z|[+\-]\d{2}(?::?\d{2})?)?$/;

function parseTime(timeStr) {
  if (!timeStr) return null;
  const t = String(timeStr).trim();
  const m = t.match(TIME_RE);
  if (!m) return null;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const ss = Number(m[3] ?? 0);
  const ms = Number(m[4] ?? 0);
  const rawTz = m[5] || null;

  if (
    [hh, mm, ss, ms].some(Number.isNaN) ||
    hh < 0 || hh > 23 ||
    mm < 0 || mm > 59 ||
    ss < 0 || ss > 59 ||
    ms < 0 || ms > 999
  ) return null;

  return { hh, mm, ss, ms, rawTz };
}

function isZeroOffset(rawTz) {
  if (!rawTz) return true; // missing tz -> treat as zero -> IST wall clock
  if (/^z$/i.test(rawTz)) return true; // Z
  // Normalize forms: +00, +0000, +00:00, -00, -0000, -00:00
  const digits = rawTz.replace(":", "").replace(/[zZ]/, "");
  return /^([+\-]?0{2}0{2}|[+\-]?0{2})$/.test(digits);
}

function normalizeOffsetToHHMM(rawTz) {
  // Convert "+0530" or "+05" to "+05:30" / "+05:00"
  if (!rawTz || /^z$/i.test(rawTz)) return "Z";
  if (/^[+\-]\d{2}:\d{2}$/.test(rawTz)) return rawTz;
  if (/^[+\-]\d{2}$/.test(rawTz)) return `${rawTz}:00`;
  if (/^[+\-]\d{4}$/.test(rawTz)) return `${rawTz.slice(0,3)}:${rawTz.slice(3)}`;
  return rawTz; // fallback (already fine)
}

function normalizeYMD(dateStr) {
  if (!dateStr) return null;
  const d = new Date(String(dateStr).trim()); // accepts "YYYY-MM-DD"
  if (isNaN(d.getTime())) return null;
  return [
    d.getUTCFullYear(),
    pad2(d.getUTCMonth() + 1),
    pad2(d.getUTCDate()),
  ].join("-");
}

// Build ISO from date + time. Honor **non-zero** offsets; otherwise treat as IST wall-clock.
function buildISO_DateTime_IST(dateStr, timeStr) {
  const ymd = normalizeYMD(dateStr);
  const parts = parseTime(timeStr);
  if (!ymd || !parts) return null;

  const { hh, mm, ss, ms, rawTz } = parts;

  if (rawTz && !isZeroOffset(rawTz)) {
    const tz = normalizeOffsetToHHMM(rawTz);
    const frac = ms ? `.${String(ms).padStart(3, "0")}` : "";
    return `${ymd}T${pad2(hh)}:${pad2(mm)}:${pad2(ss)}${frac}${tz}`;
  }

  // IST wall-clock → convert to UTC
  const [y, mo, d] = ymd.split("-").map(Number);
  const istEpochMs = Date.UTC(y, mo - 1, d, hh, mm, ss, ms);
  const utcEpochMs = istEpochMs - IST_OFFSET_MIN * 60 * 1000;
  const dt = new Date(utcEpochMs);
  return isNaN(dt.getTime()) ? null : dt.toISOString();
}

function normalizeSpaceISO(s) {
  if (!s) return null;
  const str = String(s).trim().replace(" ", "T");
  if (/[zZ]|[+\-]\d{2}:\d{2}$/.test(str)) return str;
  return str + "Z";
}

// ----- public API -----
export function getExamTargetISO(exam) {
  // your schema: date + exam_time (IST intended if tz is missing or zero)
  const date = exam?.date || exam?.start_date || exam?.startDate;
  const time = exam?.exam_time || exam?.examTime;

  const fromDateTime = buildISO_DateTime_IST(date, time);
  if (fromDateTime) return fromDateTime;

  // fallbacks
  const sched =
    normalizeSpaceISO(exam?.scheduled_at) ||
    normalizeSpaceISO(exam?.start_at || exam?.startAt);
  return sched || null;
}

export function useCountdown(targetISO) {
  const compute = () => {
    if (!targetISO) return null;
    const t = new Date(targetISO);
    const ms = t.getTime();
    if (isNaN(ms)) return null;
    return ms - Date.now();
  };

  const [diffMs, setDiffMs] = useState(compute);
  const ref = useRef(null);

  useEffect(() => {
    const tick = () => setDiffMs(compute());
    tick();
    ref.current = setInterval(tick, 1000);
    return () => clearInterval(ref.current);
  }, [targetISO]);

  if (diffMs == null) return { ready: false };

  const remaining = Math.max(diffMs, 0);
  const totalSec = Math.floor(remaining / 1000);

  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return {
    ready: true,
    isPast: diffMs <= 0,
    parts: { days, hours, minutes, seconds },
  };
}

export function ExamCountdown({ exam, theme }) {
  const targetISO = getExamTargetISO(exam);
  const cd = useCountdown(targetISO);
  const baseText = theme === "light" ? "text-gray-700" : "text-gray-300";

  if (!targetISO) return <span className={`text-sm font-medium ${baseText}`}>Starts in: N/A</span>;
  if (!cd.ready)   return <span className={`text-sm font-medium ${baseText}`}>Starts in: …</span>;
  if (cd.isPast)   return <span className={`text-sm font-medium ${baseText}`}>Starting…</span>;

  const { days, hours, minutes, seconds } = cd.parts;
  return (
    <span className={`text-sm font-medium ${baseText}`}>
      {days}d {pad2(hours)}h {pad2(minutes)}m {pad2(seconds)}s
    </span>
  );
}

export function toISTDisplayString(iso) {
  try {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleString("en-IN", {
      timeZone: IST_TZ,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "N/A";
  }
}
