// SPDX-License-Identifier: EUPL-1.2
pragma solidity ^0.8.0;

contract WideSignatureLogger {
    address public owner;
    struct PayloadInfo {
        bytes signature;
        uint256 timestamp;
    }

    // Mapping of hash to payload info
    mapping(bytes32 => PayloadInfo) public payloads;

    // Event for logging payload information
    event PayloadLogged(bytes32 indexed payloadHash, uint256 timestamp);

    // Modifier to restrict function access to only the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;  // Set the contract creator as the owner
    }

    function logPayload(bytes32 payloadHash, bytes memory signature) public onlyOwner {
        require(payloadHash != bytes32(0), "Invalid input"); // Check that payloadHash is not empty
        require(payloads[payloadHash].timestamp == 0, "Payload already logged");
        payloads[payloadHash] = PayloadInfo(signature, block.timestamp);
        emit PayloadLogged(payloadHash, block.timestamp);
    }

    function getPayloadInfo(bytes32 payloadHash) public view returns (PayloadInfo memory) {
        return payloads[payloadHash];
    }
}