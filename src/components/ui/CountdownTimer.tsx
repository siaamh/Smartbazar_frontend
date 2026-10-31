import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endsAt: string;
  remainingSeconds?: number;
  className?: string;
  compact?: boolean;
}

function formatTime(seconds: number) {
  if (seconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return { days, hours, minutes, seconds: secs };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function CountdownTimer({
  endsAt,
  remainingSeconds,
  className = '',
  compact = false,
}: CountdownTimerProps) {
  // Use remainingSeconds from API as initial value for accuracy
  const getInitialSeconds = () => {
    if (typeof remainingSeconds === 'number' && remainingSeconds > 0) {
      return remainingSeconds;
    }
    const diff = Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
    return diff;
  };

  const [seconds, setSeconds] = useState(getInitialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (seconds <= 0) {
    return (
      <span className={`text-sm text-[#78716C] font-medium ${className}`}>Expired</span>
    );
  }

  const { days, hours, minutes, seconds: secs } = formatTime(seconds);

  if (compact) {
    return (
      <span className={`font-mono text-sm font-semibold text-[#065F46] ${className}`}>
        {days > 0 && `${pad(days)}d `}
        {pad(hours)}:{pad(minutes)}:{pad(secs)}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {days > 0 && (
        <>
          <TimeBlock value={days} label="d" />
          <span className="text-[#78716C] font-bold text-lg">:</span>
        </>
      )}
      <TimeBlock value={hours} label="h" />
      <span className="text-[#78716C] font-bold text-lg">:</span>
      <TimeBlock value={minutes} label="m" />
      <span className="text-[#78716C] font-bold text-lg">:</span>
      <TimeBlock value={secs} label="s" />
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-[#065F46] text-white font-mono font-bold text-sm px-2 py-1 rounded min-w-[2.2rem] text-center">
        {pad(value)}
      </span>
      <span className="text-[#78716C] text-[10px] mt-0.5 uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default CountdownTimer;
