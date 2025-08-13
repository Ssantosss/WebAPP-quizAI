'use client';

type Mood = 'welcome' | 'thinking' | 'celebrate';

const emoji: Record<Mood, string> = {
  welcome: '🐶',
  thinking: '🤔',
  celebrate: '🎉',
};

export default function BuddyMascot({ mood = 'welcome' }: { mood?: Mood }) {
  return <span style={{ fontSize: '64px' }}>{emoji[mood]}</span>;
}
