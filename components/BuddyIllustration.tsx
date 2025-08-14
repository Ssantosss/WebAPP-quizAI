export function Buddy(props:{size?:number}){
  const s = props.size ?? 120;
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#F2C9A0"/>
      <circle cx="60" cy="60" r="50" stroke="#176d46" strokeWidth="4" fill="none"/>
      <circle cx="45" cy="55" r="6" fill="#176d46"/>
      <circle cx="75" cy="55" r="6" fill="#176d46"/>
      <path d="M45 80c10 10 20 10 30 0" stroke="#176d46" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export function BuddyBook(props:{size?:number}){
  const s = props.size ?? 120;
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="80" height="60" rx="4" fill="#F2C9A0" stroke="#176d46" strokeWidth="4"/>
      <line x1="60" y1="30" x2="60" y2="90" stroke="#176d46" strokeWidth="4"/>
      <circle cx="40" cy="50" r="5" fill="#176d46"/>
      <circle cx="80" cy="50" r="5" fill="#176d46"/>
    </svg>
  );
}

export function BuddyThinking(props:{size?:number}){
  const s = props.size ?? 120;
  return (
    <svg width={s} height={s} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#F2C9A0" stroke="#176d46" strokeWidth="4"/>
      <circle cx="45" cy="55" r="6" fill="#176d46"/>
      <circle cx="75" cy="55" r="6" fill="#176d46"/>
      <path d="M45 80c10 -10 20 -10 30 0" stroke="#176d46" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="85" cy="35" r="8" fill="#F2C9A0" stroke="#176d46" strokeWidth="3"/>
    </svg>
  );
}

export function BuddyAvatar(props:{size?:number}){
  const s = props.size ?? 80;
  return (
    <svg width={s} height={s} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#F2C9A0" stroke="#176d46" strokeWidth="4"/>
      <circle cx="30" cy="34" r="5" fill="#176d46"/>
      <circle cx="50" cy="34" r="5" fill="#176d46"/>
      <path d="M28 52c8 6 16 6 24 0" stroke="#176d46" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
