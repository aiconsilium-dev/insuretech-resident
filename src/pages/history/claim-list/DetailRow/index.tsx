export default function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className='flex justify-between py-1.5 text-sm'>
      <span className='text-text-muted shrink-0'>{label}</span>
      <span
        className='font-medium text-text-body text-right ml-4'
        style={valueStyle}
      >
        {value}
      </span>
    </div>
  );
}
