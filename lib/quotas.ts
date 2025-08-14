export const QUOTA = {
  free:    { daily: 0,        total: 1 },
  premium: { daily: 7,        total: Infinity },
  pro:     { daily: Infinity, total: Infinity },
} as const;

export function countToday(recent:{date:string}[]){
  const today = new Date().toISOString().slice(0,10);
  return recent.filter(r=>r.date===today).length;
}
export function countTotal(recent:{date:string}[]){
  return recent.length;
}
export function canStartQuiz(user:{plan:'free'|'premium'|'pro'}, recent:{date:string}[]){
  const q = QUOTA[user.plan];
  if(countToday(recent) >= q.daily) return { ok:false, reason:'daily' };
  if(countTotal(recent) >= q.total) return { ok:false, reason:'total' };
  return { ok:true };
}
