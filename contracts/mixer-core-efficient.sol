    // SPDX-License-Identifier: BSD-3-Clause-Clear

    pragma solidity 0.8.19;

    import "fhevm/abstracts/EIP712WithModifier.sol";
    import "fhevm/lib/TFHE.sol";

    interface IEncryptedERC20 {
        function transferFrom(address from, address to, bytes calldata encryptedAmount) external;
        function transfer(address to, euint32 encryptedAmount) external;
    }

    contract MixerCoreEfficient is EIP712WithModifier {

        struct Recipient {
            euint32 encryptedRecipient;
            euint32 encryptedAmount;
        }
        Recipient[] private pool;
        address public erc20TokenAddress;
        IEncryptedERC20 public ERC20token;

        constructor(address _erc20TokenAddress) EIP712WithModifier("Authorization token", "1")  {
            erc20TokenAddress = _erc20TokenAddress;
            ERC20token = IEncryptedERC20(erc20TokenAddress);
        }

        /// @notice Deposits an encrypted amount of ERC-20 with an encrypted recipient.
        function deposit(bytes calldata encryptedRecipient, bytes calldata encryptedAmount) public {
            // Transfer ERC-20 to mixer
            ERC20token.transferFrom(msg.sender, address(this), encryptedAmount);
            Recipient memory addedRecipient = Recipient(TFHE.asEuint32(encryptedRecipient), TFHE.asEuint32(encryptedAmount));
            pool.push(addedRecipient);
        }

        /// @notice Withdraws an encrypted amount of ERC-20.
        /// @param indexes : Ideally should be an array of distinct indexes between 0 and pool.length-1, at least one of the indexes correspond to the msg.sender as the Recipient.
        /// @notice length of indexes is highly advised to be at least 2, or else no anonymity is gained. The greater the number of indexes, the greater the anonymity, but the more gas is needed for the transaction.
        function withdraw(uint256[] memory indexes) public {
            uint256 poolLen = pool.length;
            uint256 idxLen = indexes.length;
            euint32 encryptedAddress = TFHE.asEuint32(addressTo32Bits(msg.sender));
            for(uint256 index; index<idxLen; index++) {
                uint256 idx = indexes[index];
                require(index<poolLen, "Index greater than pool size");
                ebool b = TFHE.eq(encryptedAddress, pool[idx].encryptedRecipient);
                euint32 amountToTransfer = TFHE.cmux(b, pool[idx].encryptedAmount, TFHE.asEuint32(0));
                pool[idx].encryptedAmount = TFHE.sub(pool[idx].encryptedAmount, amountToTransfer);
                ERC20token.transfer(msg.sender, amountToTransfer);
            }
        }

        // Function to convert an Ethereum address to a 32-bit representation
        function addressTo32Bits(address addr) public pure returns (uint32) {
            return uint32(uint160(addr));
        }

        function getPoolLength() public view returns(uint256){
            return pool.length;
        }
    }