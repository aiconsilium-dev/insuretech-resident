export default function ActionBtn({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className='px-3 py-1.5 rounded-full text-[12px] font-semibold border bg-white active:scale-95 transition-transform'
      style={{ borderColor: color, color }}
    >
      {label}
    </button>
  );
}
