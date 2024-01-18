// SPDX-License-Identifier: EUPL-1.2
pragma solidity ^0.8.0;

contract WideSignatureLogger {
    address public owner;

    struct PayloadInfo {
        bytes signature;
        uint256 timestamp;
    }

    struct PayloadSignaturePair {
        bytes32 payloadKey;
        bytes signature;
    }

    // Mapping of key to payload info
    mapping(bytes32 => PayloadInfo) public payloads;

    // Event for logging payload information
    event PayloadLogged(bytes32 indexed payloadKey, uint256 timestamp);

    // Modifier to restrict function access to only the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;  // Set the contract creator as the owner
    }

    function logPayload(PayloadSignaturePair memory payloadPair) public onlyOwner {
        bytes32 payloadKey = payloadPair.payloadKey;
        bytes memory signature = payloadPair.signature;

        require(payloadKey != bytes32(0), "Invalid input");
        require(payloads[payloadKey].timestamp == 0, "Payload already logged");

        payloads[payloadKey] = PayloadInfo(signature, block.timestamp);
        emit PayloadLogged(payloadKey, block.timestamp);
    }
    
    function logPayloadBatch(PayloadSignaturePair[] memory payloadPairs) public onlyOwner {
        for (uint i = 0; i < payloadPairs.length; i++) {
            logPayload(payloadPairs[i]);
        }
    }
    
    function getPayloadInfo(bytes32 payloadKey) public view returns (PayloadInfo memory) {
        return payloads[payloadKey];
    }
}