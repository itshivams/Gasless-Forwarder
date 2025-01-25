// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract GaslessForwarder {
    using ECDSA for bytes32;

    address public owner;
    mapping(address => bool) public relayers;
    mapping(address => uint256) public nonces;

    event TransactionForwarded(address indexed from, address indexed to, uint256 value, bytes data);

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 nonce;
        bytes data;
    }

    modifier onlyRelayer() {
        require(relayers[msg.sender], "Not an authorized relayer");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addRelayer(address _relayer) external {
        require(msg.sender == owner, "Only owner can add relayers");
        relayers[_relayer] = true;
    }

    function removeRelayer(address _relayer) external {
        require(msg.sender == owner, "Only owner can remove relayers");
        relayers[_relayer] = false;
    }

    function executeTransaction(ForwardRequest calldata req, bytes calldata signature) external onlyRelayer {
        bytes32 messageHash = keccak256(abi.encode(req.from, req.to, req.value, req.nonce, req.data));

        // Manually encode the Ethereum signed message
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);

        require(recoveredSigner == req.from, "Invalid signature");
        require(nonces[req.from] == req.nonce, "Invalid nonce");

        nonces[req.from]++;
        (bool success,) = req.to.call{value: req.value}(req.data);
        require(success, "Transaction failed");

        emit TransactionForwarded(req.from, req.to, req.value, req.data);
    }
}
