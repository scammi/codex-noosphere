#!/usr/bin/env fish

# Set variables
set TEMP_FILE sample_heritage_doc.txt
set API_TOKEN b0866c6f-bf22-4ebe-930a-69539e41ec04  # Replace with your actual API token
set SERVER_URL https://demo.dataverse.org  # Replace with your Dataverse URL

# Create the file
echo '{
  "title": "Maradonian Church: Contemporary Religious Movement in Football Culture",
  "inscription_year": 2024,
  "nomination_number": "01925",
  "author": "Dr. Alejandro Wall",
  "affiliation": "Maradonian Church, Rosario, Argentina",
  "contactEmail": "info@maradonian-church.com.ar",
  "description": "The Maradonian Church represents a unique contemporary religious movement that deifies Diego Armando Maradona as the god of football. Founded in 1998 in Rosario, Argentina, by Dr. Alejandro Wall, this church has attracted hundreds of thousands of followers worldwide who practice a football-centered religion with Diego Maradona as their deity.",
  "ipfsHash": "bafkreih6ipyc4h3rmnk3yu4qtz27h5x3ky33imtv2lgetgz573ygct7epi",
  "did": "did:quarkid:EiB7S5HPnwl43ot6tumwwjTi-BIiqJ_dtO1M6e1dt0EC2g",
  "blockchainAttestation": "if not provided mock",
  "entities": {
    "persons": [
      "Diego Armando Maradona",
      "Alejandro Wall",
      "Havelange",
      "Tota",
      "Don Diego"
    ],
    "organizations": [ "Maradonian Church" ],
    "locations": [
      "Rosario",
      "Argentina",
      "Buenos Aires",
      "Villa Fiorito",
      "Naples",
      "Barcelona",
      "Mexico City",
      "Italy",
      "Spain",
      "Brazil",
      "Mexico"
    ],
    "dates": [
      "1998",
      "June 22",
      "October 29",
      "October 30",
      "November 25, 2020",
      "2024"
    ],
    "events": [
      "Maradonian Easter",
      "Maradonian Christmas Eve",
      "Maradonian Christmas",
      "Founding of the Maradonian Church",
      "Maradona death",
      "Inscription"
    ],
    "artists": [],
    "composers": []
  },
  "heritage_info": {
    "heritage_type": "Intangible",
    "unesco_list": "Representative List ICH",
    "inscription_criteria": [],
    "outstanding_universal_value": "The Maradonian Church represents a unique contemporary religious movement that deifies Diego Armando Maradona as the god of football."
  },
  "geographic_info": {
    "countries": [ "Argentina", "Italy", "Spain", "Brazil", "Mexico" ],
    "regions": [ "South America" ],
    "cities": [
      "Rosario",
      "Buenos Aires",
      "Villa Fiorito",
      "Naples",
      "Barcelona",
      "Mexico City"
    ],
    "coordinates": [],
    "biomes": [ "Urban zone" ]
  },
  "cultural_info": {
    "periods": [ "1998", "21st century" ],
    "significance": [
      "Religious movement",
      "Football culture",
      "Cultural identity",
      "Deification of a sports figure"
    ],
    "cultural_practices": [
      "Religious rituals",
      "Celebrations",
      "Prayers",
      "Following commandments"
    ],
    "traditions": [ "Football fandom", "Religious devotion" ],
    "languages": [ "Spanish" ],
    "communities": [ "Maradonian Church followers", "Football fans" ]
  },
  "unesco_classifications": {
    "convention_domains": [ "Social practices, rituals and festive events" ],
    "concepts": [ "Religion", "Football", "Cultural Identity" ],
    "sdg_objectives": []
  },
  "keywords": [
    "Maradonian Church",
    "Diego Maradona",
    "football",
    "religion",
    "Argentina",
    "intangible heritage"
  ],
  "topics": [
    "Cultural identity",
    "Religious movement",
    "Sports culture",
    "Deification",
    "Fan culture"
  ],
  "summary": "The Maradonian Church, founded in 1998 in Rosario, Argentina, is a contemporary religious movement that deifies Diego Armando Maradona as the god of football. With hundreds of thousands of followers worldwide, the church practices a football-centered religion, celebrating Maradona life and legacy through rituals, prayers, and commandments. The movement has experienced significant growth, especially after Maradona death, and continues to spread through digital platforms.",
  "confidence": 0.95,
  "processing_info": {
    "ai_model": "gemini-2.0-flash",
    "extraction_date": "2025-07-04",
    "language_detected": "English"
  }
}' > $TEMP_FILE

# Verify the file
ls -l $TEMP_FILE
cat $TEMP_FILE

# Run the curl command
curl -v -H "X-Dataverse-key: $API_TOKEN" \
     -X POST \
     -F "file=@$TEMP_FILE;type=application/json" \
     -F "jsonData={\"description\":\"Sample cultural heritage document with AI-extracted metadata\",\"categories\":[\"Documentation\"]}" \
     "$SERVER_URL/api/datasets/2654808/add"