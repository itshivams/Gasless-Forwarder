package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/big"
	"net/http"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/rpc"
)

// To Get the current nonce for the given Ethereum address
func GetNonce(client *ethclient.Client, address common.Address) (uint64, error) {
	nonce, err := client.PendingNonceAt(context.Background(), address)
	if err != nil {
		return 0, fmt.Errorf("failed to get nonce: %v", err)
	}
	return nonce, nil
}

// To Get Chain ID from blockchain
func GetChainID(client *ethclient.Client) (*big.Int, error) {
	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to fetch chain ID: %v", err)
	}
	return chainID, nil
}

// Sending Transaction forwards the signed transaction to Ethereum
func SendTransaction(from, to, value string, nonce uint64, data, signed string) (string, error) {
	client, err := ethclient.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return "", fmt.Errorf("failed to connect to Ethereum: %v", err)
	}

	privateKey, err := crypto.HexToECDSA(os.Getenv("PRIVATE_KEY"))
	if err != nil {
		return "", fmt.Errorf("invalid private key")
	}

	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		return "", fmt.Errorf("failed to fetch network ID: %v", err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainID)
	if err != nil {
		return "", fmt.Errorf("failed to create transactor: %v", err)
	}

	toAddress := common.HexToAddress(to)
	amount := new(big.Int)
	amount.SetString(value, 10)

	gasLimit := uint64(21573)
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		return "", fmt.Errorf("failed to suggest gas price: %v", err)
	}
	tx := types.NewTransaction(nonce, toAddress, amount, gasLimit, gasPrice, common.Hex2Bytes(data))
	signedTx, err := auth.Signer(auth.From, tx)
	if err != nil {
		return "", fmt.Errorf("failed to sign transaction: %v", err)
	}

	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return "", fmt.Errorf("failed to send transaction: %v", err)
	}

	fmt.Printf("Transaction sent: %s\n", signedTx.Hash().Hex())
	return signedTx.Hash().Hex(), nil
}
func SendERC20Transaction(from, to, value string, signed string) (string, error) {
	client, err := ethclient.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return "", fmt.Errorf("failed to connect to Ethereum: %v", err)
	}

	privateKey, err := crypto.HexToECDSA(os.Getenv("PRIVATE_KEY"))
	if err != nil {
		return "", fmt.Errorf("invalid private key")
	}

	tokenAddress := common.HexToAddress(os.Getenv("ERC20_CONTRACT_ADDRESS"))
	toAddress := common.HexToAddress(to)

	erc20ABI, _ := abi.JSON(strings.NewReader(`[{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]`))

	amount, ok := big.NewInt(0).SetString(value, 10)
	if !ok {
		return "", fmt.Errorf("invalid value for amount")
	}
	data, err := erc20ABI.Pack("transfer", toAddress, amount)
	if err != nil {
		return "", fmt.Errorf("failed to pack data: %v", err)
	}

	// Get correct nonce
	fromAddress := common.HexToAddress(from)
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return "", fmt.Errorf("failed to get nonce: %v", err)
	}

	// Get correct chain ID
	chainID, err := GetChainID(client)
	if err != nil {
		return "", fmt.Errorf("failed to get chain ID: %v", err)
	}

	tx := types.NewTransaction(nonce, tokenAddress, big.NewInt(0), 21573, big.NewInt(20000000000), data)

	// Sign the transaction
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign transaction: %v", err)
	}

	// Send the transaction
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return "", fmt.Errorf("failed to send transaction: %v", err)
	}

	fmt.Println("Transaction sent successfully:", signedTx.Hash().Hex())
	return signedTx.Hash().Hex(), nil
}

func SendERC721Transaction(from, to, tokenID string, signed string) (string, error) {
	client, err := ethclient.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return "", fmt.Errorf("failed to connect to Ethereum: %v", err)
	}

	privateKey, err := crypto.HexToECDSA(os.Getenv("PRIVATE_KEY"))
	if err != nil {
		return "", fmt.Errorf("invalid private key")
	}

	tokenAddress := common.HexToAddress(os.Getenv("ERC721_CONTRACT_ADDRESS"))
	toAddress := common.HexToAddress(to)

	erc721ABI, _ := abi.JSON(strings.NewReader(`[{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]`))

	tokenIDBigInt := new(big.Int)
	tokenIDBigInt.SetString(tokenID, 10)

	data, err := erc721ABI.Pack("safeTransferFrom", common.HexToAddress(from), toAddress, tokenIDBigInt)
	if err != nil {
		return "", fmt.Errorf("failed to pack data: %v", err)
	}

	// Get the nonce
	fromAddress := common.HexToAddress(from)
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return "", fmt.Errorf("failed to get nonce: %v", err)
	}

	// Get correct chain ID
	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		return "", fmt.Errorf("failed to get chain ID: %v", err)
	}

	// Create and sign the transaction
	tx := types.NewTransaction(nonce, tokenAddress, big.NewInt(0), 200000, big.NewInt(20000000000), data)
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign transaction: %v", err)
	}

	// Send the transaction
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return "", fmt.Errorf("failed to send transaction: %v", err)
	}

	fmt.Println("Transaction sent successfully:", signedTx.Hash().Hex())
	return signedTx.Hash().Hex(), nil
}

// History of transactions

type Transaction struct {
	Hash      string `json:"hash"`
	From      string `json:"from"`
	To        string `json:"to"`
	Value     string `json:"value"`
	GasUsed   string `json:"gasUsed"`
	TimeStamp string `json:"timeStamp"`
}

type EtherscanResponse struct {
	Status  string        `json:"status"`
	Message string        `json:"message"`
	Result  []Transaction `json:"result"`
}

func GetTransactionHistory(address string) ([]Transaction, error) {
	apiKey := os.Getenv("ETHERSCAN_API_KEY")
	etherscanURL := fmt.Sprintf("https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=%s&startblock=0&endblock=99999999&sort=desc&apikey=%s", address, apiKey)

	response, err := http.Get(etherscanURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch transactions: %v", err)
	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var etherscanResponse EtherscanResponse
	err = json.Unmarshal(body, &etherscanResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to parse etherscan response: %v", err)
	}

	if etherscanResponse.Status != "1" {
		return nil, fmt.Errorf("error fetching transactions: %s", etherscanResponse.Message)
	}

	return etherscanResponse.Result, nil
}

// get balance

// Send a signed transaction
func SendSignedTransaction(signedTx string) (string, error) {
	client, err := rpc.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return "", err
	}

	var txHash common.Hash
	err = client.Call(&txHash, "eth_sendRawTransaction", signedTx)
	if err != nil {
		return "", err
	}

	return txHash.Hex(), nil
}

// Get ERC-20 token balance
func GetERC20Balance(address string) (*big.Int, error) {
	client, err := rpc.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return nil, err
	}

	// Replace with your ERC-20 token contract address and balanceOf function signature
	contractAddress := common.HexToAddress("0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC")
	data := append([]byte{0x70, 0xa0, 0x82, 0x31}, common.HexToAddress(address).Bytes()...)

	var result string
	err = client.Call(&result, "eth_call", map[string]interface{}{
		"to":   contractAddress.Hex(),
		"data": common.Bytes2Hex(data),
	}, "latest")

	if err != nil {
		return nil, err
	}

	balance := new(big.Int)
	balance.SetString(result[2:], 16)
	return balance, nil
}

// Get ETH balance
func GetETHBalance(address string) (*big.Int, error) {
	client, err := rpc.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return nil, err
	}

	var balance string
	err = client.Call(&balance, "eth_getBalance", address, "latest")
	if err != nil {
		return nil, err
	}

	balanceBigInt := new(big.Int)
	balanceBigInt.SetString(balance[2:], 16)
	return balanceBigInt, nil
}

// Get ERC-721 token balance
func GetERC721Balance(address string) (*big.Int, error) {
	client, err := rpc.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return nil, err
	}

	contractAddress := common.HexToAddress("0x8336Fe9c782C385D888DA4C3549Aa3AADb801FAC")
	data := append([]byte{0x70, 0xa0, 0x82, 0x31}, common.HexToAddress(address).Bytes()...)

	var result string
	err = client.Call(&result, "eth_call", map[string]interface{}{
		"to":   contractAddress.Hex(),
		"data": common.Bytes2Hex(data),
	}, "latest")

	if err != nil {
		return nil, err
	}

	balance := new(big.Int)
	balance.SetString(result[2:], 16)
	return balance, nil
}
