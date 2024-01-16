// SPDX-License-Identifier: EUPL-1.2
pragma solidity ^0.8.0;

contract WideSignatureLogger {
    address public owner;
    struct PayloadInfo {
        bytes signature;
        uint256 timestamp;
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

    function logPayload(bytes32 payloadKey, bytes memory signature) public onlyOwner {
        require(payloadKey != bytes32(0), "Invalid input"); // Check that payloadKey is not empty
        require(payloads[payloadKey].timestamp == 0, "Payload already logged");
        payloads[payloadKey] = PayloadInfo(signature, block.timestamp);
        emit PayloadLogged(payloadKey, block.timestamp);
    }

    //TODO: logPayloadBatch
    
    function getPayloadInfo(bytes32 payloadKey) public view returns (PayloadInfo memory) {
        return payloads[payloadKey];
    }
}