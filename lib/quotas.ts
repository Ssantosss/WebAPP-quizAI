import { Plan, StatsRecent } from './store';

export const QUOTA = {
  free:    { daily: 0,        total: 1 },
  premium: { daily: 7,        total: Infinity },
  pro:     { daily: Infinity, total: Infinity },
} as const;

export function canStartQuiz(user:{plan:Plan}, recent:StatsRecent[]){
  const q = QUOTA[user.plan];
  const today = new Date().toISOString().slice(0,10);
  const daily = recent.filter(r=>r.date===today).length;
  const total = recent.length;
  if(daily >= q.daily) return { ok:false, reason:'daily' as const };
  if(total >= q.total) return { ok:false, reason:'total' as const };
  return { ok:true };
}
