// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Attestation.sol";

contract DocumentAttestationTest is Test {
    event AttestationCreated(uint256 indexed id, string metadataCID);
    Attestation public attestationContract;
    
    function setUp() public {
        attestationContract = new Attestation();
    }
    
    function testCreateAttestation() public {
        string memory testCID = "QmTestCID123";
        
        uint256 id = attestationContract.createAttestation(testCID);
        
        require(id == 1, "Assertion failed: ID should be 1");
        
        string memory storedCID = attestationContract.getAttestation(id);
        require(keccak256(bytes(storedCID)) == keccak256(bytes(testCID)), "Assertion failed: Stored CID hash does not match expected CID hash");
    }
    
    function testMultipleAttestations() public {
        string memory cid1 = "QmCID1";
        string memory cid2 = "QmCID2";
        
        uint256 id1 = attestationContract.createAttestation(cid1);
        uint256 id2 = attestationContract.createAttestation(cid2);
        
        require(id1 == 1, "Assertion failed: id1 should be 1");
        require(id2 == 2, "Assertion failed: id2 should be 2");
        require(keccak256(bytes(attestationContract.getAttestation(id1))) == keccak256(bytes(cid1)), "Assertion failed: Stored CID hash for id1 does not match expected cid1 hash");
        require(keccak256(bytes(attestationContract.getAttestation(id2))) == keccak256(bytes(cid2)), "Assertion failed: Stored CID hash for id2 does not match expected cid2 hash");
    }
    
    function testNextIdIncrement() public {
        attestationContract.createAttestation("QmTest1");
        attestationContract.createAttestation("QmTest2");
        
        require(attestationContract.nextId() == 3, "Assertion failed: nextId should be 3");
    }
}