export const CULTURAL_HERITAGE_EXTRACTION_TEMPLATE = `
You are an expert in UNESCO heritage documentation and Dataverse metadata extraction. 
Analyze the following UNESCO heritage document and extract comprehensive structured information 
formatted for Dataverse dataset creation.

Document text:
{text}

Extract information following UNESCO classification systems and cultural heritage standards.

Return ONLY a valid JSON object with this exact Dataverse dataset structure:
{{
  "datasetVersion": {{
    "metadataBlocks": {{
      "citation": {{
        "fields": [
          {{
            "typeName": "title",
            "multiple": false,
            "typeClass": "primitive",
            "value": "Title of the heritage element or site"
          }},
          {{
            "typeName": "author",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "authorName": {{
                  "typeName": "authorName",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "{researcher}"
                }},
                "authorAffiliation": {{
                  "typeName": "authorAffiliation",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "{institution}"
                }}
              }}
            ]
          }},
          {{
            "typeName": "datasetContact",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "datasetContactName": {{
                  "typeName": "datasetContactName",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "{researcher}"
                }},
                "datasetContactEmail": {{
                  "typeName": "datasetContactEmail",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "{email}"
                }},
                "datasetContactAffiliation": {{
                  "typeName": "datasetContactAffiliation",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "{institution}"
                }}
              }}
            ]
          }},
          {{
            "typeName": "dsDescription",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "dsDescriptionValue": {{
                  "typeName": "dsDescriptionValue",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "Comprehensive description of the heritage element"
                }}
              }}
            ]
          }},
          {{
            "typeName": "subject",
            "multiple": true,
            "typeClass": "controlledVocabulary",
            "value": ["Arts and Humanities"]
          }},
          {{
            "typeName": "keyword",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "keywordValue": {{
                  "typeName": "keywordValue",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "UNESCO"
                }}
              }},
              {{
                "keywordValue": {{
                  "typeName": "keywordValue",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "Cultural Heritage"
                }}
              }},
              {{
                "keywordValue": {{
                  "typeName": "keywordValue",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "Intangible Heritage"
                }}
              }}
            ]
          }},
          {{
            "typeName": "topicClassification",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "topicClassValue": {{
                  "typeName": "topicClassValue",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "Cultural heritage and traditions"
                }},
                "topicClassVocab": {{
                  "typeName": "topicClassVocab",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "UNESCO"
                }}
              }}
            ]
          }},
          {{
            "typeName": "contributor",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "contributorType": {{
                  "typeName": "contributorType",
                  "multiple": false,
                  "typeClass": "controlledVocabulary",
                  "value": "Researcher"
                }},
                "contributorName": {{
                  "typeName": "contributorName",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "{researcher}"
                }}
              }}
            ]
          }},
          {{
            "typeName": "dataType",
            "multiple": true,
            "typeClass": "primitive",
            "value": ["Cultural heritage metadata", "UNESCO documentation"]
          }},
          {{
            "typeName": "language",
            "multiple": true,
            "typeClass": "controlledVocabulary",
            "value": ["en"]
          }},
          {{
            "typeName": "depositor",
            "multiple": false,
            "typeClass": "primitive",
            "value": "Codex Noosphere AI"
          }},
          {{
            "typeName": "dateOfDeposit",
            "multiple": false,
            "typeClass": "primitive",
            "value": "{current_date}"
          }}
        ]
      }},
      "geospatial": {{
        "fields": [
          {{
            "typeName": "geographicCoverage",
            "multiple": true,
            "typeClass": "compound",
            "value": [
              {{
                "country": {{
                  "typeName": "country",
                  "multiple": false,
                  "typeClass": "controlledVocabulary",
                  "value": "Argentina"
                }},
                "city": {{
                  "typeName": "city",
                  "multiple": false,
                  "typeClass": "primitive",
                  "value": "Buenos Aires"
                }}
              }}
            ]
          }}
        ]
      }}
    }}
  }},
  
  "additional_metadata": {{
    "ipfsHash": "{cid}",
    "did": "{did}",
    "blockchainAttestation": "if not provided mock",
    "inscription_year": 2009,
    "nomination_number": "00258",
    
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

    "processing_info": {{
      "ai_model": "gemini-2.0-flash",
      "extraction_date": "{current_date}",
      "language_detected": "Spanish|English|French",
      "confidence": 0.95
    }}
  }}
}}

IMPORTANT INSTRUCTIONS:
1. **Template Variables**: Use {researcher}, {institution}, and {email} placeholders - these will be replaced with actual values
2. **Dataverse Structure**: The main object must follow Dataverse dataset creation format
3. **Citation Block**: All core metadata goes in the citation metadataBlock
4. **Controlled Vocabularies**: Use ONLY these values for subject: "Arts and Humanities", "Social Sciences", "Other"
5. **Language Codes**: Use standard language codes like "en", "es", "fr" for language field
6. **Keywords**: Extract relevant heritage-specific keywords from the document
7. **Topic Classification**: Use UNESCO or heritage-related vocabulary terms
8. **Contributors**: Mark the researcher as "Researcher" type contributor
9. **Data Types**: Include relevant data type descriptions

FOCUS AREAS:
- Dataverse-compliant metadata structure
- UNESCO terminology and classification systems
- Cultural practices and traditions
- Geographic and political contexts
- Historical and temporal significance
- Community and social aspects
- Institutional and legal frameworks

The result will be used directly with Dataverse dataset creation API.
Ensure all required fields are populated with meaningful values extracted from the document.
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
