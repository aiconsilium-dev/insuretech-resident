export default function QuickMenuItem({
  symbol,
  label,
  onClick,
  color,
}: {
  symbol: string;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <div className='text-center cursor-pointer' onClick={onClick}>
      <div
        className='w-12 h-12 rounded-[14px] border border-[var(--color-border)] flex items-center justify-center text-lg mx-auto mb-1.5 bg-white transition-transform hover:scale-105'
        style={{ color }}
      >
        {symbol}
      </div>
      <span className='block text-[11px] font-medium text-text-muted'>
        {label}
      </span>
    </div>
  );
}
