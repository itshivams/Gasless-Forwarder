// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockRecipient {
    event Received(address sender, uint256 amount, bytes data);

    receive() external payable {
        emit Received(msg.sender, msg.value, "");
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value, msg.data);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
