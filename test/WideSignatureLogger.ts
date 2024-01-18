import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, EventLog, Signer } from "ethers";
import { WideSignatureLogger } from "../typechain-types";

describe("WideSignatureLogger", function () {
  let WideSignatureLogger: Contract;
  let contract: WideSignatureLogger;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addrs: Signer[];

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const wideSignatureLoggerFactory = await ethers.getContractFactory("WideSignatureLogger");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new WideSignatureLogger contract before each test.
    contract = await wideSignatureLoggerFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(await owner.getAddress());
    });
  });

  describe("Functionality Tests", function () {

    it("Should log a new payload", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";

      await contract.connect(owner).logPayload(testHash, testSignature);

      const loggedPayload = await contract.getPayloadInfo(testHash);
      expect(loggedPayload.signature).to.equal(testSignature);
      expect(loggedPayload.timestamp).to.be.at.least(1); // Assuming the timestamp is non-zero
    });

    it("Should revert if a non-owner tries to log a payload", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";

      await expect(contract.connect(addr1).logPayload(testHash, testSignature))
        .to.be.revertedWith("Only the contract owner can call this");
    });

    it("Should prevent logging the same payload twice", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";

      await contract.connect(owner).logPayload(testHash, testSignature);
      await expect(contract.connect(owner).logPayload(testHash, testSignature))
        .to.be.revertedWith("Payload already logged");
    });

    it("Should store the correct payload information", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";
      const beforeTimestamp = (await ethers.provider.getBlock('latest'))?.timestamp;

      await contract.connect(owner).logPayload(testHash, testSignature);

      const payloadInfo = await contract.getPayloadInfo(testHash);
      expect(payloadInfo.signature).to.equal(testSignature);
      expect(payloadInfo.timestamp).to.be.at.least(beforeTimestamp);
      expect(payloadInfo.timestamp).to.be.at.most((await ethers.provider.getBlock('latest'))?.timestamp);
    });

    it("Should emit a PayloadLogged event when a payload is logged", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";

      const tx = await contract.connect(owner).logPayload(testHash, testSignature);
      const receipt = await tx.wait();
      const eventLog = receipt?.logs[0] as EventLog;
      
      expect(eventLog.args[0]).to.equal(testHash);
      expect(eventLog.args[1]).to.equal((await receipt?.getBlock())?.timestamp);
    });

    it("Should revert with empty hash input", async function () {
      const emptyHash = "0x" + "0".repeat(64); // Simulating an empty hash as a valid bytes32
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";

      await expect(contract.connect(owner).logPayload(emptyHash, testSignature))
        .to.be.revertedWith("Invalid input"); // Replace with your contract's revert message
    });
    
    it("Should consume reasonable gas for logging payload", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";
    
      const tx = await contract.connect(owner).logPayload(testHash, testSignature);
      const receipt = await tx.wait();
      
      expect(receipt?.gasUsed).to.be.below(150000); // Example gas limit, adjust as needed
    });

    it("Should revert if logPayload is called with already logged hash", async function () {
      const testHash = ethers.keccak256("0x1234");
      const testSignature = "0x" + "abcdef1234567890".repeat(8) + "ab";
    
      await contract.connect(owner).logPayload(testHash, testSignature);
    
      // Attempt to log the same payload again
      await expect(contract.connect(owner).logPayload(testHash, testSignature))
        .to.be.revertedWith("Payload already logged"); // Your contract's revert message for this scenario
    });
    
  });

});