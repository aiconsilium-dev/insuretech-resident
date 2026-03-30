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
        "photo-slot !flex-1 !aspect-square !rounded-xl",
        preview && "filled"
      )}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {preview ? (
        <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
      ) : (
        <>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-center px-1">{label}</span>
        </>
      )}
    </div>
  );
}
