// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Attestation.sol";

contract DocumentAttestationTest is Test {
    DocumentAttestation public attestationContract;
    
    function setUp() public {
        attestationContract = new Attestation();
    }
    
    function testCreateAttestation() public {
        string memory testCID = "QmTestCID123";
        
        // Create attestation
        uint256 id = attestationContract.createAttestation(testCID);
        
        // Verify ID is 1 (first attestation)
        assertEq(id, 1);
        
        // Verify stored CID
        string memory storedCID = attestationContract.getAttestation(id);
        assertEq(storedCID, testCID);
    }
    
    function testMultipleAttestations() public {
        string memory cid1 = "QmCID1";
        string memory cid2 = "QmCID2";
        
        uint256 id1 = attestationContract.createAttestation(cid1);
        uint256 id2 = attestationContract.createAttestation(cid2);
        
        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(attestationContract.getAttestation(id1), cid1);
        assertEq(attestationContract.getAttestation(id2), cid2);
    }
    
    function testAttestationCreatedEvent() public {
        string memory testCID = "QmEventTest";
        
        // Expect event to be emitted
        vm.expectEmit(true, false, false, true);
        emit DocumentAttestation.AttestationCreated(1, testCID);
        
        attestationContract.createAttestation(testCID);
    }
    
    function testNextIdIncrement() public {
        attestationContract.createAttestation("QmTest1");
        attestationContract.createAttestation("QmTest2");
        
        assertEq(attestationContract.nextId(), 3);
    }
}