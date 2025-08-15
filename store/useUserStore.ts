import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usage, quizzesLeft } from '../lib/quotas';

export type Plan = 'free' | 'premium' | 'pro';

interface State {
  plan: Plan;
  usage: Usage;
  canUseQuiz: () => boolean;
  recordUsage: () => void;
}

export const useUserStore = create<State>()(
  persist(
    (set, get) => ({
      plan: 'free',
      usage: { total: 0, daily: { date: '', count: 0 } },
      canUseQuiz: () => {
        const { plan, usage } = get();
        return quizzesLeft(plan, usage) > 0;
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
