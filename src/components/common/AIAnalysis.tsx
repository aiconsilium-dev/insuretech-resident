import { useEffect, useState } from "react";
import clsx from "clsx";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  "사진 분석 중...",
  "피해 원인 판단 중...",
  "TYPE A/B/C 분류 중...",
  "예상 보상금액 산출 중...",
];

export default function AIAnalysis({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDoneSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div>
      <div className="text-center pt-8 pb-2.5">
        <h2 className="text-[22px] font-bold mb-2">AI가 분석하고 있습니다</h2>
        <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
      </div>
      <div className="py-5">
        {STEPS.map((text, i) => {
          const isDone = doneSteps.includes(i);
          const isActive = currentStep === i && !isDone;
          return (
            <div
              key={i}
              className={clsx(
                "flex items-center gap-3.5 py-3 transition-opacity duration-400",
                isDone || isActive ? "opacity-100" : "opacity-30"
              )}
            >
              <div
                className={clsx(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                  isDone && "bg-primary border-primary",
                  isActive && "border-primary",
                  !isDone && !isActive && "border-gray-300"
                )}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isActive ? (
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
                ) : null}
              </div>
              <span className={clsx("text-[15px] font-medium", isDone || isActive ? "text-black" : "text-gray-500")}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
