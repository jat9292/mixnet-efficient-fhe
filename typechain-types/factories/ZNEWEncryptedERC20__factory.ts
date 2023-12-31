/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  ZNEWEncryptedERC20,
  ZNEWEncryptedERC20Interface,
} from "../ZNEWEncryptedERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "encryptedAmount",
        type: "uint32",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "add",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "balanceOfMeUnprotected",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "amount",
        type: "uint32",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "amount",
        type: "uint32",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "amount",
        type: "uint32",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200092d3803806200092d833981016040819052620000349162000131565b600680546001600160a01b0319163317905560016200005483826200022a565b5060026200006382826200022a565b505050620002f6565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200009457600080fd5b81516001600160401b0380821115620000b157620000b16200006c565b604051601f8301601f19908116603f01168101908282118183101715620000dc57620000dc6200006c565b81604052838152602092508683858801011115620000f957600080fd5b600091505b838210156200011d5785820183015181830184015290820190620000fe565b600093810190920192909252949350505050565b600080604083850312156200014557600080fd5b82516001600160401b03808211156200015d57600080fd5b6200016b8683870162000082565b935060208501519150808211156200018257600080fd5b50620001918582860162000082565b9150509250929050565b600181811c90821680620001b057607f821691505b602082108103620001d157634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200022557600081815260208120601f850160051c81016020861015620002005750805b601f850160051c820191505b8181101562000221578281556001016200020c565b5050505b505050565b81516001600160401b038111156200024657620002466200006c565b6200025e816200025784546200019b565b84620001d7565b602080601f8311600181146200029657600084156200027d5750858301515b600019600386901b1c1916600185901b17855562000221565b600085815260208120601f198616915b82811015620002c757888601518255948401946001909101908401620002a6565b5085821015620002e65787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61062780620003066000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c806384269ed911610076578063a71bbebe1161005b578063a71bbebe14610151578063a7e9454214610164578063ce606ee0146101ad57600080fd5b806384269ed91461013657806395d89b411461014957600080fd5b806306fdde03146100a85780632e110181146100c657806370a08231146100f25780638009748414610121575b600080fd5b6100b06101d8565b6040516100bd9190610458565b60405180910390f35b3360009081526004602052604090205463ffffffff165b60405163ffffffff90911681526020016100bd565b6100dd6101003660046104c2565b6001600160a01b031660009081526004602052604090205463ffffffff1690565b61013461012f3660046104f8565b610266565b005b61013461014436600461052b565b610275565b6100b0610292565b61013461015f36600461056e565b61029f565b6101346101723660046104f8565b3360008181526005602090815260408083206001600160a01b03871684529091529020805463ffffffff191663ffffffff8416179055505050565b6006546101c0906001600160a01b031681565b6040516001600160a01b0390911681526020016100bd565b600180546101e590610589565b80601f016020809104026020016040519081016040528092919081815260200182805461021190610589565b801561025e5780601f106102335761010080835404028352916020019161025e565b820191906000526020600020905b81548152906001019060200180831161024157829003601f168201915b505050505081565b61027133838361033a565b5050565b336102818482846103db565b61028c84848461033a565b50505050565b600280546101e590610589565b6006546001600160a01b031633146102b657600080fd5b6006546001600160a01b03166000908152600460205260409020546102e290829063ffffffff166105d9565b6006546001600160a01b03166000908152600460205260408120805463ffffffff191663ffffffff9384161790555461031d918391166105d9565b6000805463ffffffff191663ffffffff9290921691909117905550565b6001600160a01b03821660009081526004602052604090205461036490829063ffffffff166105d9565b6001600160a01b03838116600090815260046020526040808220805463ffffffff191663ffffffff958616179055918616815220546103a5918391166105fd565b6001600160a01b03939093166000908152600460205260409020805463ffffffff191663ffffffff909416939093179092555050565b6001600160a01b0383811660009081526005602090815260408083209386168352929052205463ffffffff1661028c848461041685856105fd565b6001600160a01b03928316600090815260056020908152604080832094909516825292909252919020805463ffffffff191663ffffffff909216919091179055565b600060208083528351808285015260005b8181101561048557858101830151858201604001528201610469565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146104bd57600080fd5b919050565b6000602082840312156104d457600080fd5b6104dd826104a6565b9392505050565b803563ffffffff811681146104bd57600080fd5b6000806040838503121561050b57600080fd5b610514836104a6565b9150610522602084016104e4565b90509250929050565b60008060006060848603121561054057600080fd5b610549846104a6565b9250610557602085016104a6565b9150610565604085016104e4565b90509250925092565b60006020828403121561058057600080fd5b6104dd826104e4565b600181811c9082168061059d57607f821691505b6020821081036105bd57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b63ffffffff8181168382160190808211156105f6576105f66105c3565b5092915050565b63ffffffff8281168282160390808211156105f6576105f66105c356fea164736f6c6343000813000a";

type ZNEWEncryptedERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ZNEWEncryptedERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ZNEWEncryptedERC20__factory extends ContractFactory {
  constructor(...args: ZNEWEncryptedERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _name: string,
    _symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_name, _symbol, overrides || {});
  }
  override deploy(
    _name: string,
    _symbol: string,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_name, _symbol, overrides || {}) as Promise<
      ZNEWEncryptedERC20 & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ZNEWEncryptedERC20__factory {
    return super.connect(runner) as ZNEWEncryptedERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ZNEWEncryptedERC20Interface {
    return new Interface(_abi) as ZNEWEncryptedERC20Interface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ZNEWEncryptedERC20 {
    return new Contract(address, _abi, runner) as unknown as ZNEWEncryptedERC20;
  }
}
