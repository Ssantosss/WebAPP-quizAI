import { Plan } from './store';

export type Usage = { total: number; daily: { date: string; count: number } };

export function maxQuizzes(plan: Plan): number {
  switch (plan) {
    case 'premium':
      return 7;
    case 'pro':
      return Infinity;
    default:
      return 1;
  }
}

export function quizzesLeft(plan: Plan, usage: Usage): number {
  const max = maxQuizzes(plan);
  if (max === Infinity) return Infinity;
  if (plan === 'free') {
    return Math.max(0, max - usage.total);
  }
  const today = new Date().toISOString().slice(0, 10);
  const count = usage.daily.date === today ? usage.daily.count : 0;
  return Math.max(0, max - count);
}
