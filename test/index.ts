import { expect } from "chai";
import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Ballot } from "../typechain";

describe("Greeter", function () {
  let ballot: Ballot;

  this.beforeEach(async () => {
    const Ballot = await ethers.getContractFactory("Ballot");
    ballot = await Ballot.deploy([
      formatBytes32String("Proposal1"),
      formatBytes32String("Proposal2"),
    ]);

    await ballot.deployed();
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
    const blockNum = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNum);
    const timestamp = block.timestamp;
    const fiveMinutes = 5 * 60;

    // Act
    await ethers.provider.send("evm_mine", [timestamp + fiveMinutes + 100]);

    // Assert
    await expect(ballot.vote(1)).to.be.revertedWith("TooLate()");
  });
});
