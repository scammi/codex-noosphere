export const CULTURAL_HERITAGE_EXTRACTION_TEMPLATE = `
You are an expert in cultural heritage documentation and metadata extraction. 
Analyze the following document and extract structured information following cultural heritage standards.

Document text (first {maxChars} characters):
{text}

Instructions:
1. Extract entities (people, organizations, places, dates, events)
2. Identify cultural heritage keywords and topics
3. Find geographic information and cultural significance
4. Determine heritage types and historical periods
5. Provide a confidence score (0-1) for the extraction quality

Return ONLY a valid JSON object with this exact structure:
{{
  "entities": {{
    "persons": ["array of person names mentioned"],
    "organizations": ["array of organizations/institutions"],
    "locations": ["array of places/geographic locations"],
    "dates": ["array of dates/time periods"],
    "events": ["array of events/activities/processes"]
  }},
  "keywords": ["array of relevant cultural heritage keywords"],
  "topics": ["array of main themes/subjects"],
  "geographicInfo": {{
    "places": ["array of specific geographic locations"],
    "coordinates": [{{ "lat": number, "lng": number }}]
  }},
  "culturalInfo": {{
    "periods": ["array of cultural/historical periods"],
    "significance": ["array of significance statements"],
    "heritage_types": ["array of heritage classifications: Cultural, Natural, Mixed, Intangible, etc."]
  }},
  "summary": "One paragraph summary of the document's main content and cultural heritage significance",
  "confidence": 0.95
}}

Focus on:
- UNESCO World Heritage terminology
- Archaeological and historical contexts
- Conservation and preservation aspects
- Cultural practices and traditions
- Geographic and temporal contexts
- Institutional and legal frameworks

Ensure all arrays contain relevant, non-duplicate entries. If no information is found for a category, return an empty array.
`;

// Alternative template for simpler extraction
export const SIMPLE_EXTRACTION_TEMPLATE = `
Extract key information from this cultural heritage document:

{text}

Return JSON with:
- keywords: important terms
- locations: places mentioned
- summary: brief description
- heritage_type: Cultural/Natural/Mixed

JSON:`;
