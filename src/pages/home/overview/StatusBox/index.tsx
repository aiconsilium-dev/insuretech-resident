export default function StatusBox({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className='rounded-[10px] border border-[var(--color-border)] py-3 text-center'>
      <div
        className='text-[20px] font-bold tracking-[-0.5px]'
        style={{ color: count > 0 ? color : 'var(--color-text-dim)' }}
      >
        {count}
      </div>
      <div className='text-[11px] text-text-muted mt-0.5'>{label}</div>
    </div>
  );
}
