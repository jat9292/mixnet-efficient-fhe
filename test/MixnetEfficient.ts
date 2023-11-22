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
    const bobAddress = await signers.bob.getAddress();
    const carolAddress = await signers.carol.getAddress(); // alice's alter ego
    const daveAddress = await signers.dave.getAddress(); // bob's alter ego

    const evaAddress = await signers.eva.getAddress();
    const felixAddress = await signers.felix.getAddress();
    const garyAddress = await signers.gary.getAddress(); // eva's alter ego
    const harryAddress = await signers.harry.getAddress(); // felix's alter ego

    const irisAddress = await signers.iris.getAddress(); // any other account (this would be the caller of getLatestIndex)


    const tokenFactory = await ethers.getContractFactory("EncryptedERC20");

    let token = await tokenFactory.deploy("EncToken", "ET");
    await token.waitForDeployment();
    let tokenAddress = await token.getAddress();

    console.log("EncryptedERC20 TOKEN ADDRESS  :  ", tokenAddress);

    const instancesToken = await createInstances(tokenAddress, ethers, signers);

    // ALICE mints 100_000 token
    let encryptedAmount = instancesToken.alice.encrypt32(200_000);
    const tx1 = await token.mint(encryptedAmount);
    const tx1receipt = await tx1.wait();
    console.log("Gas consumed by 1st mint tx : ", tx1receipt?.gasUsed);
    console.log("Alice successfully minted 200_000 Encryptedtoken");

    encryptedAmount = instancesToken.alice.encrypt32(50_000);
    const tx2 = await token["transfer(address,bytes)"](bobAddress, encryptedAmount);
    await tx2.wait();
    console.log("Alice successfully sent 50_000 Encryptedtoken to Bob");

    encryptedAmount = instancesToken.alice.encrypt32(50_000);
    const tx2bis = await token["transfer(address,bytes)"](evaAddress, encryptedAmount);
    await tx2bis.wait();
    console.log("Alice successfully sent 50_000 Encryptedtoken to Eva");

    encryptedAmount = instancesToken.alice.encrypt32(50_000);
    const tx2tris = await token["transfer(address,bytes)"](felixAddress, encryptedAmount);
    await tx2tris.wait();
    console.log("Alice successfully sent 50_000 Encryptedtoken to Felix");

    const tokenAlice= instancesToken.alice.getTokenSignature(tokenAddress)!;
    let encryptedBalAlice = await token.connect(signers.alice)["balanceOf(bytes32,bytes)"](tokenAlice.publicKey, tokenAlice.signature);
    console.log("encryptedBalAlice  : ", encryptedBalAlice);
    let balanceAlice = instancesToken.alice.decrypt(tokenAddress, encryptedBalAlice);
    console.log("balanceAlice : ", balanceAlice);

    // ALICE deploys the Mixnet
    const mixnetFactory = await ethers.getContractFactory("MixerCoreEfficient");
    const mixnet = await mixnetFactory.connect(signers.alice).deploy(tokenAddress,2); // simple example with 2 swaps per recipient insertion
    await mixnet.waitForDeployment();
    const mixnetAddress = await mixnet.getAddress();
    console.log("MIXNET ADDRESS  :  ", mixnetAddress);

    encryptedAmount = instancesToken.alice.encrypt32(10_000);
    const tx3 = await token.approve(mixnetAddress, encryptedAmount);
    await tx3.wait();

    encryptedAmount = instancesToken.bob.encrypt32(10_000);
    const tx3bis = await token.connect(signers.bob).approve(mixnetAddress, encryptedAmount);
    await tx3bis.wait();

    encryptedAmount = instancesToken.eva.encrypt32(10_000);
    const tx3bis2 = await token.connect(signers.eva).approve(mixnetAddress, encryptedAmount);
    await tx3bis2.wait();

    encryptedAmount = instancesToken.felix.encrypt32(10_000);
    const tx3bis3 = await token.connect(signers.felix).approve(mixnetAddress, encryptedAmount);
    await tx3bis3.wait();

    let addTo32bits = await mixnet.addressTo32Bits(carolAddress);  // in real world the encryptedRecipient should be computed off-chain instead
    const instancesMixnet = await createInstances(mixnetAddress, ethers, signers);
    let encryptedRecipient = instancesMixnet.alice.encrypt32(Number(addTo32bits));
    encryptedAmount = instancesMixnet.alice.encrypt32(10_000);
    const tx4 = await mixnet.deposit(encryptedRecipient, encryptedAmount);
    await tx4.wait();
    console.log("Alice deposited 10_000 Encryptedtoken in the mixnet for Carol");
    
    /*let pool0 = await mixnet.pool(0);
    console.log("Pool0 : " , pool0 );*/


    const mixnetIris = instancesMixnet.iris.getTokenSignature(mixnetAddress)!;
    console.log("mixnetIris : ", mixnetIris)
    addTo32bits = await mixnet.addressTo32Bits(carolAddress);
    let encAddTo32bits = instancesMixnet.iris.encrypt32(Number(addTo32bits));
    let encLatestIndex = await mixnet.connect(signers.iris).getLatestIndex(mixnetIris.publicKey,mixnetIris.signature,encAddTo32bits,0); // <--- fhevm BUG  ??
    let latestIndex = instancesMixnet.iris.decrypt(mixnetAddress, encLatestIndex);
    console.log("latestIndex : ", latestIndex);



    addTo32bits = await mixnet.addressTo32Bits(daveAddress);  // in real world the encryptedRecipient should be computed off-chain instead
    encryptedRecipient = instancesMixnet.bob.encrypt32(Number(addTo32bits));
    encryptedAmount = instancesMixnet.bob.encrypt32(10_000);
    const tx5 = await mixnet.connect(signers.bob).deposit(encryptedRecipient, encryptedAmount, {gasLimit: 10_000_000});
    
    const tx5receipt = await tx5.wait();
    console.log("Gas consumed by 2nd deposit tx : ", tx5receipt?.gasUsed);

    console.log("Bob deposited 10_000 Encryptedtoken in the mixnet for Dave");

     /*pool0 = await mixnet.pool(0);
    console.log("Pool0 : " , pool0 );
    let pool1 = await mixnet.pool(1);
    console.log("Pool1 : " , pool1 );*/
 

    addTo32bits = await mixnet.addressTo32Bits(garyAddress);  // in real world the encryptedRecipient should be computed off-chain instead
    encryptedRecipient = instancesMixnet.eva.encrypt32(Number(addTo32bits));
    encryptedAmount = instancesMixnet.eva.encrypt32(10_000);
    const tx5bis = await mixnet.connect(signers.eva).deposit(encryptedRecipient, encryptedAmount, {gasLimit: 10_000_000});
    await tx5bis.wait();

    const tx5bisreceipt = await tx5bis.wait();
    console.log("Gas consumed by 3rd deposit tx : ", tx5bisreceipt?.gasUsed);

    console.log("Eva deposited 10_000 Encryptedtoken in the mixnet for Gary");

     /*pool0 = await mixnet.pool(0);
    console.log("Pool0 : " , pool0 );
     pool1 = await mixnet.pool(1);
    console.log("Pool1 : " , pool1 );
    let pool2 = await mixnet.pool(2);
    console.log("Pool2 : " , pool2 );*/


    addTo32bits = await mixnet.addressTo32Bits(harryAddress);  // in real world the encryptedRecipient should be computed off-chain instead
    encryptedRecipient = instancesMixnet.felix.encrypt32(Number(addTo32bits));
    encryptedAmount = instancesMixnet.felix.encrypt32(10_000);
    const tx5tris = await mixnet.connect(signers.felix).deposit(encryptedRecipient, encryptedAmount, {gasLimit: 10_000_000});
    await tx5tris.wait();
    
    const tx5trisreceipt = await tx5bis.wait();
    console.log("Gas consumed by 4th deposit tx : ", tx5trisreceipt?.gasUsed);

    console.log("Felix deposited 10_000 Encryptedtoken in the mixnet for Harry");

     /*pool0 = await mixnet.pool(0);
    console.log("Pool0 : " , pool0 );
     pool1 = await mixnet.pool(1);
    console.log("Pool1 : " , pool1 );
     pool2 = await mixnet.pool(2);
    console.log("Pool2 : " , pool2 );
    let pool3 = await mixnet.pool(3);
    console.log("Pool3 : " , pool3 );*/

    encryptedBalAlice = await token.connect(signers.alice)["balanceOf(bytes32,bytes)"](tokenAlice.publicKey, tokenAlice.signature);
    balanceAlice = instancesToken.alice.decrypt(tokenAddress, encryptedBalAlice);
    console.log("balanceAlice : ", balanceAlice);

    const tokenBob= instancesToken.bob.getTokenSignature(tokenAddress)!;
    const encryptedBalBob = await token.connect(signers.bob)["balanceOf(bytes32,bytes)"](tokenBob.publicKey, tokenBob.signature);
    const balanceBob = instancesToken.bob.decrypt(tokenAddress, encryptedBalBob);
    console.log("balanceBob : ", balanceBob);

    const tokenEva= instancesToken.eva.getTokenSignature(tokenAddress)!;
    const encryptedBalEva = await token.connect(signers.eva)["balanceOf(bytes32,bytes)"](tokenEva.publicKey, tokenEva.signature);
    const balanceEva = instancesToken.eva.decrypt(tokenAddress, encryptedBalEva);
    console.log("balanceEva : ", balanceEva);

    const tokenFelix= instancesToken.felix.getTokenSignature(tokenAddress)!;
    const encryptedBalFelix = await token.connect(signers.felix)["balanceOf(bytes32,bytes)"](tokenFelix.publicKey, tokenFelix.signature);
    const balanceFelix = instancesToken.felix.decrypt(tokenAddress, encryptedBalFelix);
    console.log("balanceFelix : ", balanceFelix);

/*
    addTo32bits = await mixnet.addressTo32Bits(carolAddress);
    encAddTo32bits = instancesMixnet.iris.encrypt32(Number(addTo32bits));
    encLatestIndex = await mixnet.connect(signers.iris).getLatestIndex(mixnetIris.publicKey,mixnetIris.signature,encAddTo32bits,0); // <--- fhevm BUG  ??
    latestIndex = instancesMixnet.iris.decrypt(mixnetAddress, encLatestIndex);
    console.log("latestIndex : ", latestIndex); 






    const tx6 = await mixnet.connect(signers.carol).withdraw(latestIndex);
    const tx6receipt = await tx6.wait();
    console.log("Carole withdrew 10_000 Encryptedtoken from the mixnet");
    console.log("Gas consumed by withdraw tx : ", tx6receipt?.gasUsed);

    //const tx6bis = await mixnet.connect(signers.carol).withdraw(latestIndex); // Carol tries to cheat by withdrawing twice (impossible, as expected)
    //const tx6bisreceipt = await tx6bis.wait();
    //console.log("Carole withdraw 10_000 Encryptedtoken from the mixnet");
    //console.log("Gas consumed by withdraw tx : ", tx6bisreceipt?.gasUsed);
 */

  });
});
