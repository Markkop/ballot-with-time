import { formatBytes32String } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const Ballot = await ethers.getContractFactory("Ballot");
  const ballot = await Ballot.deploy([
    formatBytes32String("Proposal1"),
    formatBytes32String("Proposal2"),
  ]);

  await ballot.deployed();
  console.log("Ballot deployed to:", ballot.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
