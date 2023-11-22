import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";

export interface Signers {
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  carol: SignerWithAddress;
  dave: SignerWithAddress;
  eva: SignerWithAddress;
  felix: SignerWithAddress;
  gary: SignerWithAddress;
  harry: SignerWithAddress;
  iris: SignerWithAddress;
}

export const getSigners = async (ethers: any): Promise<Signers> => {
  const signers = await ethers.getSigners();
  return {
    alice: signers[0],
    bob: signers[1],
    carol: signers[2],
    dave: signers[3],
    eva: signers[4],
    felix: signers[5],
    gary: signers[6],
    harry: signers[7],
    iris: signers[8],
  };
};