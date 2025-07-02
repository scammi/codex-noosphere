// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Attestation {
    mapping(uint256 => string) public attestations;
    uint256 public nextId = 1;
    
    event AttestationCreated(uint256 indexed id, string metadataCID);
    
    function createAttestation(string memory metadataCID) external returns (uint256) {
        uint256 id = nextId++;
        attestations[id] = metadataCID;
        emit AttestationCreated(id, metadataCID);
        return id;
    }
    
    function getAttestation(uint256 id) external view returns (string memory) {
        return attestations[id];
    }
}