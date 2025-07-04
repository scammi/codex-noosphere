# Dataverse Integration Plan

## Goal
Implement a Dataverse Upload Service and integrate it into the document processing flow.

## Plan

1.  **Create Dataverse Service and Module:**
    *   Create a new directory `src/dataverse`.
    *   Create `src/dataverse/dataverse.service.ts` to encapsulate the logic for interacting with the Dataverse API.
    *   Create `src/dataverse/dataverse.module.ts` to define the Dataverse module and make the service available.

2.  **Implement DataverseService:**
    *   Use NestJS `HttpService` (from `@nestjs/axios`) to make HTTP requests to the Dataverse API.
    *   Read the `DATAVERSE_API_TOKEN` environment variable.
    *   Hardcode the target dataset ID as a constant within the service.
    *   Implement a method, e.g., `uploadDocument`, that accepts the PDF content (as a base64 string) and the extracted metadata (as a JSON object). The `datasetId` will be used internally.
    *   Construct the multipart/form-data request payload required by the Dataverse API, including the PDF file and the JSON metadata.
    *   Set the `X-Dataverse-key` header using the retrieved API token.
    *   Send a POST request to the Dataverse upload endpoint (`/api/datasets/:datasetId/add`).
    *   Handle the response from Dataverse, including success and error cases.

3.  **Implement DataverseModule:**
    *   Import `HttpModule` from `@nestjs/axios`.
    *   Declare `DataverseService` as a provider.
    *   Export `DataverseService` so it can be used by other modules.

4.  **Integrate DataverseService into Processing Module and Controller:**
    *   Update `src/processing/processing.module.ts` to import the new `DataverseModule`.
    *   Update `src/processing/processing.controller.ts`.
    *   Inject the `DataverseService` into the `ProcessingController`.
    *   Modify the `processDocument` method:
        *   Remove `datasetId` from the request body interface.
        *   After the AI extraction (`extractionResult`) is obtained, call the `DataverseService.uploadDocument` method, passing the original PDF base64 string and the `extractionResult`. The service will use the hardcoded dataset ID.
        *   Decide how to incorporate the result of the Dataverse upload into the final response of the `processDocument` endpoint.

## Flow Diagram

```mermaid
graph TD
    A[Client Request] --> B(ProcessingController);
    B --> C(StorageService: Upload PDF);
    C --> D{IPFS Upload Result};
    D --> E(ProcessingController: Update Metadata);
    E --> F(AiExtractorService: Extract Metadata);
    F --> G{AI Extraction Result};
    G --> H(DataverseService: Upload Document);
    H --> I{Dataverse Upload Result};
    I --> J(ProcessingController: Return Response);
    J --> K[Client Response];