import type { ClaimType } from './types';

/** HashRouter history.state와 병합해 마법사 스텝을 넣음 (뒤로/앞으로 가기 시 동일 UI) */
export function mergeClaimWizardHistoryState(
  step: number,
  claimType?: ClaimType | null
): Record<string, unknown> {
  const prev = window.history.state;
  const base =
    prev && typeof prev === 'object' && !Array.isArray(prev)
      ? { ...(prev as Record<string, unknown>) }
      : {};
  const out: Record<string, unknown> = { ...base, claimWizard: true, step };
  if (step === 0) {
    out.claimType = claimType ?? null;
  } else if (claimType != null) {
    out.claimType = claimType;
  }
  return out;
}

export function isClaimWizardHistoryState(
  x: unknown
): x is { claimWizard: true; step: number; claimType?: ClaimType | null } {
  return (
    x !== null &&
    typeof x === 'object' &&
    (x as { claimWizard?: boolean }).claimWizard === true &&
    typeof (x as { step?: unknown }).step === 'number'
  );
}

export function isClaimTypeValue(x: unknown): x is ClaimType {
  return (
    x === 'facility' ||
    x === 'leak' ||
    x === 'injury' ||
    x === 'fire'
  );
}
