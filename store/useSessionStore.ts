import { create } from 'zustand';

export type SessionStatus = 'idle' | 'running' | 'ended';
export type QuizItem = {
  id: string;
  predicted: 'A' | 'B' | 'C' | 'D';
  confidence: number;
  latencyMs: number;
};
export type Session = {
  status: SessionStatus;
  course?: string;
  subject?: string;
  items: QuizItem[];
  startedAt?: number;
  endedAt?: number;
};

const initialState: Session = { status: 'idle', items: [] };

type Store = {
  session: Session;
  startSession(course: string, subject: string): void;
  appendResult(item: QuizItem): void;
  endSession(): void;
  resetSession(): void;
};

export const useSessionStore = create<Store>((set) => ({
  session: initialState,
  startSession: (course, subject) =>
    set({
      session: {
        status: 'running',
        course,
        subject,
        items: [],
        startedAt: Date.now(),
      },
    }),
  appendResult: (item) =>
    set((s) =>
      s.session.status === 'running'
        ? { session: { ...s.session, items: [...s.session.items, item] } }
        : { session: s.session }
    ),
  endSession: () =>
    set((s) => ({
      session:
        s.session.status === 'running'
          ? { ...s.session, status: 'ended', endedAt: Date.now() }
          : s.session,
    })),
  resetSession: () => set({ session: initialState }),
}));
