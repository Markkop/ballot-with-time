import { expect } from "chai";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Ballot } from "../typechain";

async function getBlockTimestamp() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  return block.timestamp;
}

describe("Ballot", function () {
  let ballot: Ballot;

  this.beforeEach(async () => {
    const Ballot = await ethers.getContractFactory("Ballot");
    ballot = await Ballot.deploy([
      formatBytes32String("Proposal1"),
      formatBytes32String("Proposal2"),
    ]);

    await ballot.deployed();

    const timestamp = await getBlockTimestamp();
    console.log(`Deploy timestamp: ${new Date(timestamp * 1000)}`);
  });

  it("Should vote correctly", async function () {
    // Arrange
    const voteTxn = await ballot.vote(1);
    await voteTxn.wait();

    // Act
    const winningProposal = await ballot.winningProposal();

    // Assert
    expect(winningProposal).to.equal(1);
  });

  it("Should not be able to vote after 5 minutes", async function () {
    // Arrange
    let timestamp = await getBlockTimestamp();
    const fiveMinutes = 5 * 60;

    // Act
    await ethers.provider.send("evm_mine", [timestamp + fiveMinutes + 100]);

    // Assert
    await expect(ballot.vote(1)).to.be.revertedWith("TooLate()");
    timestamp = await getBlockTimestamp();
    console.log(`Reverted timestamp: ${new Date(timestamp * 1000)}`);
  });
});
