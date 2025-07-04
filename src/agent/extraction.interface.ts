export interface ExtractedContent {
  keywords: string[];
  locations: string[];
  summary: string;
  heritage_type: 'Cultural' | 'Natural' | 'Mixed' | 'Intangible';
  confidence: number;
}
