// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StandardForwarder {
    mapping(address => uint256) public nonces;

    event Forwarded(address indexed sender, address indexed recipient, uint256 value);

    function forwardBatch(
        address[] calldata tokens,
        address[] calldata recipients,
        uint256[] calldata values,
        uint256[] calldata noncesBatch
    ) external {
        uint256 len = tokens.length;
        require(
            recipients.length == len &&
            values.length == len &&
            noncesBatch.length == len,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < len; i++) {
            require(nonces[msg.sender] == noncesBatch[i], "Invalid nonce");
            nonces[msg.sender]++;
            IERC20(tokens[i]).transferFrom(msg.sender, recipients[i], values[i]);
            emit Forwarded(msg.sender, recipients[i], values[i]);
        }
    }

    function getNonce(address user) external view returns (uint256) {
        return nonces[user];
    }
}
