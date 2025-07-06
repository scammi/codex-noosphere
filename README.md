# Codex Noosphere
*Building the planetary cultural memory layer*

## Overview

Codex Noosphere extends the QuarkID self-sovereign identity platform, a W3C Verifiable Credentials system, to create an automated cultural heritage preservation system. Inspired by Teilhard de Chardin's vision of the noosphere as humanity's thinking layer, we're building the technical infrastructure where all cultural knowledge can be preserved, verified, and discovered collectively.

Our system gives a researcher a wallet and a credential that marks them as an authorized publisher. The credential is presented and verified in an instance of submitting a cultural artifact for documentation. Once the presentation is verified, the document is uploaded to IPFS and an on-chain attestation created. Our Dataverse agent picks up the event, downloads the document, creates structured metadata and uploads it onto a Dataverse Collection. The result is a process that requires the researcher to only upload once, the cultural heritage is preserved in perpetual storage, and automatically the data becomes findable through Dataverse, no need for the researcher to manually create the dataset and upload.

This repository is a NestJS application that works as a module we can consume in our existing W3C Credential signer. It is a microservice that exposes logic for the attestation, metadata extraction and publishing onto Dataverse. The main entry point can be found within the [process controller](https://github.com/scammi/codex-noosphere/blob/main/src/processing/processing.controller.ts#L54).


- [Video Demo](https://studio.youtube.com/video/yUt-sprnonA/edit)

- [Slides](https://docs.fileverse.io/document/6ULsWdjWg4LsFLx4u791qA)

- [Try it!](autopen.lucerolabs.xyz) > email for admin access (hello@lucerolabs.xyz)

## Repositories
- [W3C Wallet](https://github.com/orgs/sinodos-id/repositories)

- [Issuer Verifier Agent](https://github.com/sinodos-id/quark-issuer-verifier)

- [Quarkid signer](https://github.com/scammi/quark-signer)


## The Problem

- Cultural heritage institutions pay $2+ per DOI for research identifiers
- Ukraine war nearly destroyed 50TB of irreplaceable cultural data
- Publishing to Dataverse is cumbersome manual process that require data to be structure
- Cultural documentation sits in isolated silos, undiscoverable

## Our Solution

**Existing QuarkID Foundation (Production-Ready):**
1. Researchers receive institutional credentials via self-sovereign identity
2. Documents are cryptographically signed with verifiable credentials
3. Complete audit trail of authorship


**New Codex Noosphere Extension:**
1. Signed PDFs automatically upload to IPFS for distributed preservation
2. Blockchain attestations create immutable provenance records
3. AI agents monitor attestations and process new cultural documents
4. Auto-generated metadata creates rich Dataverse datasets and uploads them
5. Global discovery layer connects cultural heritage across institutions

## Key Features

- **🆔 DID-based Identifiers**:  Each researcher gets their wallet, their private key is used to issue document attestations. 
- **✅ User Data Sovereignty**: Researchers control their DID keys
- **📜 Immutable Preservation**: IPFS + blockchain ensures cultural memory survives institutional collapse
- **🤖 AI Metadata Generation**: Automatically extracts structured metadata from the document.
- **🌐 Dataverse Integration**: Extracted metadata isu used to publishing to the world's largest research data repository
- **⚡ User Empowerment**: Researchers control their credentials and metadata sovereignty

## Workflow

![Codex Noosphere Flow](https://i.imgur.com/UWPVijx.png)

## Dataverse Integration

The Agent module receives the researcher credential along with the pdf as a buffer, the agent builds up the metadata and the body for the Dataverse publication. The Dataverse module, creates a dataset within a collection and appends the file.


## Technology Stack

- **Identity Layer**: QuarkID SSI platform (W3C Verifiable Credentials)
- **Storage**: IPFS for distributed file preservation
- **Verification**: Blockchain attestations for provenance
- **AI**: LLM-based metadata extraction and structuring
- **Integration**: Dataverse API for research data publishing

## Impact

- **Cost**: Cheap DOIs
- **Resilience**: Distributed storage survives institutional destruction
- **Discovery**: AI-enhanced global cultural heritage search
- **Sovereignty**: Researchers and institutions control their data

---

*"Just as Teilhard envisioned the noosphere as Earth's thinking layer, Codex Noosphere creates the technical infrastructure where all human cultural knowledge can be preserved, shared, and evolved collectively."*
