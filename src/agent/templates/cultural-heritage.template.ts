export const CULTURAL_HERITAGE_EXTRACTION_TEMPLATE = `
You are an expert in UNESCO heritage documentation and metadata extraction. 
Analyze the following UNESCO heritage document and extract comprehensive structured information.

Document text:
{text}

Extract information following UNESCO classification systems and cultural heritage standards.

Return ONLY a valid JSON object with this exact structure:
{{
  "title": "Title of the heritage element or site",
  "inscription_year": 2009,
  "nomination_number": "00258",
  "author": "if not provided mock",
  "affiliation": "if not provided mock",;
  contactEmail": "if not provided mock",;
  description": "if not provided mock",;
  "ipfsHash": {cid},;
  "blockchainAttestation": "if not provided mock",;
  
  "entities": {{
    "persons": ["individual people mentioned"],
    "organizations": ["UNESCO", "Ministerio de Cultura", "institutions"],
    "locations": ["Buenos Aires", "Montevideo", "Río de la Plata"],
    "dates": ["2009", "historical periods"],
    "events": ["inscription", "nominations", "celebrations"],
    "artists": ["musicians", "dancers", "performers"],
    "composers": ["music creators", "choreographers"]
  }},

  "heritage_info": {{
    "heritage_type": "Cultural|Natural|Mixed|Intangible",
    "unesco_list": "World Heritage|Representative List ICH|Urgent Safeguarding|Best Practices|Memory of World",
    "inscription_criteria": ["criteria used for inscription"],
    "outstanding_universal_value": "statement of universal value"
  }},

  "geographic_info": {{
    "countries": ["Argentina", "Uruguay"],
    "regions": ["Río de la Plata basin", "South America"],
    "cities": ["Buenos Aires", "Montevideo"],
    "coordinates": [{{ "lat": -34.6118, "lng": -58.3960 }}],
    "biomes": ["Urban zone", "River basin"]
  }},

  "cultural_info": {{
    "periods": ["19th century", "early 20th century"],
    "significance": ["cultural identity", "urban popular music"],
    "cultural_practices": ["dance", "music", "poetry"],
    "traditions": ["milongas", "social dancing"],
    "languages": ["Spanish"],
    "communities": ["Argentine", "Uruguayan", "immigrant communities"]
  }},

  "unesco_classifications": {{
    "convention_domains": ["Artes escénicas", "Tradiciones y expresiones orales"],
    "concepts": ["Danza", "Música vocal", "Música instrumental", "Poesía"],
    "sdg_objectives": ["ODS 10: Reducción de las desigualdades", "ODS 11: Ciudades y comunidades sostenibles"]
  }},

  "keywords": ["tango", "UNESCO", "intangible heritage", "dance", "music"],
  "topics": ["cultural identity", "urban music", "immigration", "cultural fusion"],
  "summary": "Comprehensive paragraph describing the heritage element, its significance, and cultural context",
  
  "confidence": 0.95,
  "processing_info": {{
    "ai_model": "gemini-2.0-flash",
    "extraction_date": "{current_date}",
    "language_detected": "Spanish|English|French"
  }}
}}

IMPORTANT INSTRUCTIONS:
1. **Heritage Type**: Determine if Cultural, Natural, Mixed, or Intangible based on content
2. **UNESCO List**: Identify which UNESCO list (World Heritage, Representative List ICH, etc.)
3. **Geographic Precision**: Extract specific countries, regions, cities mentioned
4. **Cultural Context**: Capture cultural practices, traditions, communities involved
5. **Classification Systems**: Map to UNESCO convention domains and SDG objectives when mentioned
6. **Temporal Context**: Extract historical periods, inscription years, cultural periods
7. **Institutional Framework**: Capture organizations, institutions, governmental bodies

FOCUS AREAS:
- UNESCO terminology and classification systems
- Cultural practices and traditions
- Geographic and political contexts
- Historical and temporal significance
- Community and social aspects
- Institutional and legal frameworks
- Conservation and safeguarding measures

Ensure all arrays contain relevant, specific, non-duplicate entries. Use empty arrays [] if no information is found for a category.
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
