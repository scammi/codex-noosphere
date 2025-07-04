export interface ExtractedContent {
  datasetVersion: {
    metadataBlocks: {
      citation: {
        fields: any[];
      };
      geospatial?: {
        fields: any[];
      };
    };
  };
  additional_metadata?: {
    ipfsHash?: string;
    did?: string;
    blockchainAttestation?: string;
    inscription_year?: number;
    nomination_number?: string;
    entities?: any;
    heritage_info?: any;
    geographic_info?: any;
    cultural_info?: any;
    unesco_classifications?: any;
    processing_info?: any;
  };
}
