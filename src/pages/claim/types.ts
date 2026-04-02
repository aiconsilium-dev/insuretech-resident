export type ClaimType = 'facility' | 'leak' | 'injury' | 'fire';

export interface ClaimTypeOption {
  type: ClaimType;
  title: string;
  desc: string;
  symbol: string;
  color: string;
  completionMsg: string;
}

export interface EstimationItem {
  name: string;
  qty: string;
  unitPrice: number;
  total: number;
}

export interface EstimationData {
  items: EstimationItem[];
  damageTotal: number;
  deductible: number;
  insurance: number;
}
