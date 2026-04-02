import clsx from 'clsx';
import type { TypeClass } from '@/lib/api/types';

const TypeBadge: React.FC<{ tc: TypeClass }> = ({ tc }) => {
  const map = {
    A: 'border-[#C9252C] text-[#C9252C] bg-white',
    B: 'border-[#888] text-[#888] bg-white',
    C: 'border-[#00854A] text-[#00854A] bg-white',
  } as const;
  const label = { A: 'TYPE A', B: 'TYPE B', C: 'TYPE C' } as const;
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border',
        map[tc]
      )}
    >
      {label[tc]}
    </span>
  );
};

export default TypeBadge;
