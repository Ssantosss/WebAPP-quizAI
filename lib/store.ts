import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { quizzesLeft, Usage } from './quotas';

export type Plan = 'free' | 'premium' | 'pro';
export type QA = { index: number; predicted?: 'A' | 'B' | 'C' | 'D' };
export type Session = {
  id: string;
  startedAt: number;
  finishedAt?: number;
  shots: number;
  index: number;
  answers: QA[];
};

type StatsRecent = { date: string; total: number; correct: number };

type State = {
  user: { email?: string; plan: Plan };
  session?: Session;
  recent: StatsRecent[];
  usage: Usage;
  actions: {
    login(email: string): void;
    startSession(): boolean;
    recordAnswer(pred: QA['predicted']): void;
    incShot(): void;
    finishSession(summary: { total: number; correct: number; timeSec: number }): void;
    resetSession(): void;
    upgrade(plan: Plan): void;
    logout(): void;
  };
};

export const useApp = create<State>()(
  persist(
    (set, get) => ({
      user: { plan: 'free' },
      recent: [],
      usage: { total: 0, daily: { date: '', count: 0 } },
      actions: {
        login: (email) => set((s) => ({ user: { ...s.user, email } })),
        startSession: () => {
          const s = get();
          if (quizzesLeft(s.user.plan, s.usage) <= 0) return false;
          const today = new Date().toISOString().slice(0, 10);
          const daily =
            s.usage.daily.date === today
              ? { date: today, count: s.usage.daily.count + 1 }
              : { date: today, count: 1 };
          set({
            session: {
              id: crypto.randomUUID(),
              startedAt: Date.now(),
              shots: 0,
              index: 1,
              answers: [],
            },
            usage: { total: s.usage.total + 1, daily },
          });
          return true;
        },
        recordAnswer: (pred) =>
          set((s) => {
            if (!s.session) return {} as any;
            const ss = s.session;
            const i = ss.index;
            ss.answers.push({ index: i, predicted: pred });
            ss.index = Math.min(30, ss.index + 1);
            return { session: ss };
          }),
        incShot: () =>
          set((s) =>
            s.session ? { session: { ...s.session, shots: s.session.shots + 1 } } : {}
          ),
        finishSession: (sum) =>
          set((s) => {
            if (!s.session) return {} as any;
            const date = new Date().toISOString().slice(0, 10);
            const recent = [{ date, total: sum.total, correct: sum.correct }, ...s.recent].slice(0, 10);
            return { session: undefined, recent };
          }),
        resetSession: () => set({ session: undefined }),
        upgrade: (plan) => set((s) => ({ user: { ...s.user, plan } })),
        logout: () => set({ user: { plan: 'free' }, session: undefined }),
      },
    }),
    { name: 'buddy-store' }
  )
);
