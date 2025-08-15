import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usage, quizzesLeft } from '../lib/quotas';

export type Plan = 'free' | 'premium' | 'pro';

interface State {
  plan: Plan;
  usage: Usage;
  canUseQuiz: () => { allowed: boolean; reason?: string };
  recordUsage: () => void;
}

export const useUserStore = create<State>()(
  persist(
    (set, get) => ({
      plan: 'free',
      usage: { total: 0, daily: { date: '', count: 0 } },
      canUseQuiz: () => {
        const { plan, usage } = get();
        const left = quizzesLeft(plan, usage);
        return left > 0
          ? { allowed: true }
          : { allowed: false, reason: 'Limite raggiunto' };
      },
      recordUsage: () =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          const daily =
            s.usage.daily.date === today
              ? { date: today, count: s.usage.daily.count + 1 }
              : { date: today, count: 1 };
          return { usage: { total: s.usage.total + 1, daily } };
        }),
    }),
    { name: 'user-store' }
  )
);
