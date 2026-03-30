export type TabId = "home" | "claim" | "myclaims" | "more";

export type DamageType = "leak" | "fire" | "facility" | "property" | "injury" | "other";

export type OwnerType = "owner" | "tenant";

export type ClaimStep = 1 | 2 | 3;

export type ResultType = "A" | "B" | "C";

export type SubPage = "insurance-info" | "documents" | "profile" | null;

export interface ClaimRecord {
  id: string;
  type: string;
  damageType: DamageType;
  typeClass: ResultType;
  date: string;
  status: "접수" | "검토" | "산정" | "완료";
  statusStep: number; // 0-3
  detail: {
    desc: string;
    amount?: string;
    inspection?: string;
  };
}

export interface UserInfo {
  name: string;
  apt: string;
  dong: string;
  ho: string;
}

export const DAMAGE_LABELS: Record<DamageType, string> = {
  leak: "하자/누수 피해",
  fire: "화재 피해",
  facility: "시설 이용 중 사고",
  property: "가재도구 피해",
  injury: "신체 부상",
  other: "기타 피해",
};

export const TYPE_MAP: Record<DamageType, ResultType> = {
  leak: "C",
  fire: "C",
  facility: "C",
  property: "C",
  injury: "A",
  other: "B",
};

export const AMOUNT_MAP: Record<DamageType, number> = {
  leak: 4250000,
  fire: 8500000,
  facility: 1820000,
  property: 2100000,
  injury: 0,
  other: 0,
};
