import { useRef } from "react";
import clsx from "clsx";

interface Props {
  label: string;
  hint?: string;
  photos: string[];
  onUpdate: (photos: string[]) => void;
  maxCount?: number;
}

export default function PhotoCaptureGroup({
  label,
  hint,
  photos,
  onUpdate,
  maxCount = 3,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const remaining = maxCount - photos.length;
    const toProcess = files.slice(0, remaining);

    const readers = toProcess.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((urls) => {
      onUpdate([...photos, ...urls]);
    });
  }

  function removePhoto(index: number) {
    onUpdate(photos.filter((_, i) => i !== index));
  }

  const canAdd = photos.length < maxCount;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-text-body">{label}</span>
        <span className="text-xs text-text-dim">
          {photos.length}/{maxCount}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {photos.map((src, i) => (
          <div
            key={i}
            className="relative w-[80px] h-[80px] shrink-0 rounded-xl overflow-hidden border border-border"
          >
            <img
              src={src}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-black/60 flex items-center justify-center text-white"
              aria-label="삭제"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5">
                <line x1="2" y1="2" x2="8" y2="8" />
                <line x1="8" y1="2" x2="2" y2="8" />
              </svg>
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={clsx(
              "w-[80px] h-[80px] shrink-0 rounded-xl border-[1.5px] border-dashed border-border",
              "flex flex-col items-center justify-center gap-1",
              "bg-bg-secondary text-text-dim text-[10px] font-medium",
              "hover:border-text-muted hover:text-text-muted transition-all cursor-pointer"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>추가</span>
          </button>
        )}
      </div>

      {hint && (
        <p className="text-xs text-text-muted mt-1.5">{hint}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
