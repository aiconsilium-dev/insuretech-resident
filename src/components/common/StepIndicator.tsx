import clsx from "clsx";

interface Props {
  total: number;
  current: number;
}

export default function StepIndicator({ total, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={clsx(
            "h-2 rounded-full transition-all",
            i < current ? "w-4 bg-[#00854A]" :
            i === current ? "w-8 bg-[#0061AF]" :
            "w-2 bg-border"
          )}
        />
      ))}
    </div>
  );
}
