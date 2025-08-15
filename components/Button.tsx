import clsx from 'clsx';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'ghost'|'outline'; size?: 'lg'|'md' };
export default function Button({ className, variant='primary', size='lg', ...rest }: Props) {
  const base = 'btn rounded-2xl';
  const v = variant === 'primary' ? 'bg-[#176d46] text-white'
          : variant === 'ghost' ? 'bg-neutral-200 text-neutral-800'
          : 'border border-neutral-300 bg-white text-neutral-800';
  const s = size === 'lg' ? 'h-14 px-6 text-base' : 'h-12 px-4 text-[15px]';
  return <button className={clsx(base, v, s, className)} {...rest} />;
}
