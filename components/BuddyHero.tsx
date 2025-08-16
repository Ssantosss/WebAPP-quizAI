import Image from 'next/image';
import buddy from '@/public/buddy-home.png';

export default function BuddyHero({ className = '' }: { className?: string }) {
  return (
    <Image
      src={buddy}
      alt="Buddy"
      priority
      placeholder="blur"
      className={className}
      sizes="(max-width: 480px) 192px, 240px"
    />
  );
}
