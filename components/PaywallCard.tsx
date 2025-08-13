'use client';

import { Plan } from '../lib/store';

interface Props {
  plan: Plan;
  title: string;
  description: string;
  onSelect(): void;
}

export default function PaywallCard({ plan, title, description, onSelect }: Props) {
  return (
    <div className="card" role="article">
      <h3>{title}</h3>
      <p style={{ fontSize: 14 }}>{description}</p>
      <button className="btn-primary" onClick={onSelect} aria-label={`attiva piano ${plan}`}>
        Prosegui
      </button>
    </div>
  );
}
