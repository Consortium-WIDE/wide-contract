// SPDX-License-Identifier: EUPL-1.2

// Contract built by wid3.xyz for the wid3 platform.
// Copyright (c) 2024

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

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

    struct PresentationInfo {
        string jsonString;
        uint256 timestamp;
    }

    mapping(bytes32 => PayloadInfo) public payloads;
    mapping(bytes32 => PresentationInfo[]) public presentations;

    event PayloadLogged(bytes32 indexed payloadKey, uint256 timestamp);
    event PresentationLogged(bytes32 indexed presentationKey, uint256 timestamp);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this");
        _;
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

    function logPresentation(bytes32 presentationKey, string memory jsonString) public onlyOwner {
        require(presentationKey != bytes32(0), "Invalid input");

        PresentationInfo memory newPresentation = PresentationInfo(jsonString, block.timestamp);
        presentations[presentationKey].push(newPresentation);

        emit PresentationLogged(presentationKey, block.timestamp);
    }

    function getPayloadInfo(bytes32 payloadKey) public view returns (PayloadInfo memory) {
        return payloads[payloadKey];
    }

    function getPresentationHistory(bytes32 presentationKey) public view returns (PresentationInfo[] memory) {
        return presentations[presentationKey];
    }
}
