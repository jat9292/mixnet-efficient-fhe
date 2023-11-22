import { expect } from "chai";
import { ethers } from "hardhat";

import { createInstances } from "./instance";
import { getSigners } from "./signers";
import { createTransaction, waitForBlock } from "./utils";

describe("Mixnet Efficient", function () {
  before(async function () {
    this.signers = await getSigners(ethers);
  });

  it("Mixnet Efficient", async function () {
    const signers = await getSigners(ethers);
    const aliceAddress = await signers.alice.getAddress();

    const tokenFactory = await ethers.getContractFactory("EncryptedERC20");

    let token = await tokenFactory.deploy("EncToken", "ET");
    await token.waitForDeployment();
    let tokenAddress = await token.getAddress();

    console.log("EncryptedERC20 TOKEN1 ADDRESS  :  ", tokenAddress);

    let token2 = await tokenFactory.deploy("EncToken2", "ET2");
    await token2.waitForDeployment();
    let tokenAddress2 = await token2.getAddress();

    console.log("EncryptedERC20 TOKEN2 ADDRESS  :  ", tokenAddress2);

    const instancesToken = await createInstances(tokenAddress, ethers, signers);

    // ALICE mints 100_000 token2 but while encrypting for token1 <-- BUG???
    let encryptedAmount = instancesToken.alice.encrypt32(200_000);
    const tx1 = await token2.mint(encryptedAmount);
    const tx1receipt = await tx1.wait();
    console.log("Gas consumed by 1st mint tx : ", tx1receipt?.gasUsed);
    console.log("Alice successfully minted 200_000 Encryptedtoken");

    const instancesToken2 = await createInstances(tokenAddress2, ethers, signers);
    const tokenAlice= instancesToken2.alice.getTokenSignature(tokenAddress2)!;
    let encryptedBalAlice = await token2.connect(signers.alice)["balanceOf(bytes32,bytes)"](tokenAlice.publicKey, tokenAlice.signature);
    let balanceAlice = instancesToken2.alice.decrypt(tokenAddress2, encryptedBalAlice);
    console.log("balanceAlice Token2 : ", balanceAlice);

  });
});
