import { useRef, useState } from "react";
import clsx from "clsx";

interface Props {
  label: string;
  onCapture: (dataUrl: string) => void;
}

export default function PhotoCapture({ label, onCapture }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPreview(url);
      onCapture(url);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={clsx(
        "relative w-[80px] h-[80px] shrink-0 rounded-xl border-[1.5px] border-dashed border-border",
        "flex flex-col items-center justify-center gap-1 cursor-pointer transition-all",
        "bg-bg-secondary text-text-dim text-[10px] font-medium overflow-hidden",
        "hover:border-text-muted hover:text-text-muted",
        preview && "border-solid border-border"
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {preview ? (
        <img
          src={preview}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-center leading-tight px-1">{label}</span>
        </>
      )}
    </div>
  );
}
