    // SPDX-License-Identifier: BSD-3-Clause-Clear

    pragma solidity 0.8.19;

    import "fhevm/abstracts/EIP712WithModifier.sol";
    import "fhevm/lib/TFHE.sol";

    interface IEncryptedERC20 {
        function transferFrom(address from, address to, bytes calldata encryptedAmount) external;
        function transfer(address to, euint32 encryptedAmount) external;
    }

    contract MixerCoreEfficient is EIP712WithModifier {
        event Log(uint256);
        struct Recipient {
            euint32 encryptedRecipient;
            euint32 encryptedAmount;
        }
        Recipient[] private pool; // (public only FOR DEBUGGING : TODO : change to private! DONE)
        Recipient[] private poolOriginal;
        address public erc20TokenAddress;
        IEncryptedERC20 public ERC20token;
        uint256 public immutable maxSwaps;
        euint32 private MAX_EUINT32 = TFHE.asEuint32(type(uint32).max);
        uint256 public constant MAX_SWAPS = 16;
        mapping(uint256 clearOrigIndex => euint32 encryptedCurrentIndex) indexMapping;

        constructor(address _erc20TokenAddress, uint256 _numSwaps) EIP712WithModifier("Authorization token", "1")  {
            require(_numSwaps<MAX_SWAPS, "Max number of swaps is unreasonably high");
            require(_numSwaps>0, "Number of swaps cannot be null : if permutation of the recipients is disabled, confidentiality during withdrawals is impossible");
            erc20TokenAddress = _erc20TokenAddress;
            ERC20token = IEncryptedERC20(erc20TokenAddress);
            maxSwaps = _numSwaps;
        }

        // Deposits an encrypted amount of ERC-20 with an encrypted recipient.
        function deposit(bytes calldata encryptedRecipient, bytes calldata encryptedAmount) public {
            // Transfer ERC-20 to mixer
            ERC20token.transferFrom(msg.sender, address(this), encryptedAmount);
            Recipient memory addedRecipient = Recipient(TFHE.asEuint32(encryptedRecipient), TFHE.asEuint32(encryptedAmount));
            pool.push(addedRecipient);
            poolOriginal.push(addedRecipient);
            uint256 poolLength = pool.length;
            uint256 numSwaps = (maxSwaps<poolLength) ? maxSwaps : poolLength-1;
            uint256 random;
            uint256 remainder;

            if (numSwaps>0) {
                random = uint256(TFHE.decrypt(TFHE.randEuint32())); // if we want to avoid any use of decrypt, we could replace this by any other mean of getting a cleartext random integer, for eg block.prevrandao (but this can be manipulated by validators, also prevrandao always returns 0 in the local fhevm)
                //random = uint256(blockhash(block.number-1));
                remainder = poolLength-1; 
            }

            for(uint i=0;i<numSwaps;i++){
                uint256 remainderOrig = remainder;
                Recipient memory newRecipient = pool[remainderOrig]; // initially the last element that we just added (remainder = poolLength-1, when i=0)
                uint256 randomI = uint256(keccak256(abi.encode(random+i)));
                remainder = randomI % (poolLength-1); // TODO (improvement) : instead of a uniform distribution on previous added Recipients, put more weight on more recent ones : eg Soliton Distribution? or keep track of already swapped indexes to do only circular permutations?
                Recipient memory tempPoolElement = pool[remainder];
                euint32 encRandom = TFHE.randEuint32();
                ebool eboolNoSwap = TFHE.lt(encRandom,uint32(type(uint32).max/(numSwaps-i+1)));//to get a uniform distribution on the swapped locations for the newly added Recipient
                pool[remainderOrig].encryptedRecipient = TFHE.cmux(eboolNoSwap, newRecipient.encryptedRecipient, tempPoolElement.encryptedRecipient);
                pool[remainderOrig].encryptedAmount = TFHE.cmux(eboolNoSwap, newRecipient.encryptedAmount, tempPoolElement.encryptedAmount);
                pool[remainder].encryptedRecipient = TFHE.cmux(eboolNoSwap, tempPoolElement.encryptedRecipient, newRecipient.encryptedRecipient);
                pool[remainder].encryptedAmount = TFHE.cmux(eboolNoSwap, tempPoolElement.encryptedAmount, newRecipient.encryptedAmount);
                indexMapping[remainderOrig] = TFHE.cmux(eboolNoSwap, TFHE.asEuint32(uint32(remainderOrig)), TFHE.asEuint32(uint32(remainder)));
                indexMapping[remainder] = TFHE.cmux(eboolNoSwap, TFHE.asEuint32(uint32(remainder)), TFHE.asEuint32(uint32(remainderOrig)));
            }
        }

        /// @notice gets the current index of the Recipient associated with the orginal "index"
        /// @notice to avoid cheating, the caller must provide the correct encrypted recepient address "secretRecepientAddress" corresponding to the original "index"
        /// TODO (improvement) : to avoid a possible race condition between the moment when "getLatestIndex" is called and when "withdraw" is called, we could add a "encyptedNumSwapped" variable in the values of the
        /// indexMapping mapping (its values would become structs {encryptedCurrentIndex, encyptedNumSwapped} ), and increment it at each swap until some max limit is reached, after which the Recipient could not get its index swapped anymore
        function getLatestIndex(bytes32 publicKey,
                                bytes calldata signature,
                                bytes calldata secretRecepientAddress,
                                uint256 index) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory){
            ebool isSecretCorrect = TFHE.eq(TFHE.asEuint32(secretRecepientAddress),poolOriginal[index].encryptedRecipient);
            //euint32 encryptedIndex = TFHE.cmux(isSecretCorrect,indexMapping[index],MAX_EUINT32);
            return TFHE.reencrypt(indexMapping[index], publicKey, 0);
        }

        // Withdraws an encrypted amount of ERC-20.
        function withdraw(uint256 index) public {
            euint32 encryptedAddress = TFHE.asEuint32(addressTo32Bits(msg.sender));
            ebool b = TFHE.eq(encryptedAddress, pool[index].encryptedRecipient);
            euint32 amountToTransfer = TFHE.cmux(b, pool[index].encryptedAmount, TFHE.asEuint32(0));
            pool[index].encryptedAmount = TFHE.sub(pool[index].encryptedAmount, amountToTransfer);
            ERC20token.transfer(msg.sender, amountToTransfer);
        }

        // Function to convert an Ethereum address to a 32-bit representation
        function addressTo32Bits(address addr) public pure returns (uint32) {
            return uint32(uint160(addr));
        }
    }