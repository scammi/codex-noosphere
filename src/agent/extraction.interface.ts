export interface ExtractedContent {
  // Basic Information
  title: string;
  inscription_year?: number;
  nomination_number?: string;

  // Entities
  entities: {
    persons: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    events: string[];
    artists?: string[];
    composers?: string[];
  };

  // Core Heritage Information
  heritage_info: {
    heritage_type: 'Cultural' | 'Natural' | 'Mixed' | 'Intangible';
    unesco_list:
      | 'World Heritage'
      | 'Representative List ICH'
      | 'Urgent Safeguarding'
      | 'Best Practices'
      | 'Memory of World';
    inscription_criteria?: string[];
    outstanding_universal_value?: string;
  };

  // Geographic Information
  geographic_info: {
    countries: string[];
    regions: string[];
    cities: string[];
    coordinates?: { lat: number; lng: number }[];
    biomes?: string[];
  };

  // Cultural Context
  cultural_info: {
    periods: string[];
    significance: string[];
    cultural_practices: string[];
    traditions: string[];
    languages?: string[];
    communities?: string[];
  };

  // UNESCO-Specific Classifications
  unesco_classifications: {
    convention_domains?: string[];
    concepts?: string[];
    sdg_objectives?: string[];
  };

  // Standard Fields
  keywords: string[];
  topics: string[];
  summary: string;
  // Metadata
  confidence: number;
  processing_info?: {
    ai_model: string;
    extraction_date: string;
    language_detected?: string;
  };
}
