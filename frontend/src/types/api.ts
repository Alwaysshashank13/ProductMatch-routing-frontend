// Mirrors backend/src/productmatch_routing/api/schemas.py

export type Decision = "approve" | "review" | "block";

export interface Health {
  status: string;
  version: string;
}

export interface ExperimentInfo {
  name: string;
  finished_at: string | null;
  n_pairs: number | null;
  n_test_pairs: number | null;
}

export interface RouterSummary {
  router: string;
  threshold_low: number;
  threshold_high: number;
  automation_rate: number;
  auto_approve_rate: number;
  unsafe_update_rate: number;
  review_rate: number;
  missed_match_rate: number;
  auto_precision: number;
  auto_recall: number;
  cost_per_pair: number;
}

export interface Pair {
  left_title: string;
  right_title: string;
  label: number;
  confidence: number;
  decision: Decision;
}

export interface PairPage {
  total: number;
  items: Pair[];
}
