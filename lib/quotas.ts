import { Plan } from './store';

const BASE = Number(process.env.ANALYZE_MAX_PER_MIN || 30);

export function analyzeQuota(plan: Plan): number {
  switch (plan) {
    case 'premium':
      return BASE * 2;
    case 'pro':
      return BASE * 4;
    default:
      return BASE;
  }
}
