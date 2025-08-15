'use client';
import { create } from 'zustand';

export type SessionStatus = 'idle' | 'running' | 'ended';
export type QuizItem = { id: string; predicted: 'A'|'B'|'C'|'D'; confidence: number; latencyMs: number };

type SessionState = {
  status: SessionStatus;
  course?: string;
  subject?: string;
  items: QuizItem[];
  startedAt?: number;
  endedAt?: number;
  startSession: (course: string, subject: string) => void;
  appendResult: (item: QuizItem) => void;
  endSession: () => void;
  resetSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: 'idle',
  items: [],
  startSession: (course, subject) =>
    set({ status: 'running', course, subject, items: [], startedAt: Date.now(), endedAt: undefined }),
  appendResult: (item) => set((s) => ({ items: [...s.items, item] })),
  endSession: () => set({ status: 'ended', endedAt: Date.now() }),
  resetSession: () => set({ status: 'idle', items: [], course: undefined, subject: undefined, startedAt: undefined, endedAt: undefined }),
}));
