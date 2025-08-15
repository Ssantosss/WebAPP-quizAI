import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}

export default function StatBar({ label, value, max, suffix = '' }: StatBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span>{label}</span>
        <span>
          {value}
          {suffix}
        </span>
      </div>
      <div className="progress">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
