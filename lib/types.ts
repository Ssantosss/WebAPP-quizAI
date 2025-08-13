export type ChoiceLabel = "A"|"B"|"C"|"D";

export type Extracted = {
  prompt: string;
  options: { label: ChoiceLabel; text: string }[];
  language: string;
  meta: { ocrConfidence: number; warnings?: string[] };
};

export type DeepAnswer = {
  predicted: ChoiceLabel;
  confidence: number; // 0..1
  explanation?: string;
  sources?: { title: string; url: string; publisher?: string }[];
  checks?: { negation: boolean; keywordMatch: number };
};

export type AnalyzeResult = {
  predicted: ChoiceLabel;
  latencyMs: { ocr: number; reason: number; total: number };
};
