import Link from 'next/link';
import { ReactNode, CSSProperties } from 'react';

type Props = {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
};

export default function Button({
  href,
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled,
  style,
  className,
}: Props) {
  const base = variant === 'primary' ? 'btn' : 'btn secondary';
  const cls = className ? base + ' ' + className : base;
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}
