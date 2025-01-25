package utils

import (
	"context"
	"crypto/ecdsa"
	"errors"
	"fmt"
	"math/big"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

// Load environment variables
var (
	infuraURL    = os.Getenv("INFURA_RPC_URL")
	privateKey   = os.Getenv("RELAYER_PRIVATE_KEY")
	contractABI  = `[ /* Contract ABI Here */ ]`
	contractAddr = os.Getenv("FORWARDER_CONTRACT_ADDRESS")
)

// SendTransaction relays a gasless transaction to the Ethereum blockchain
func SendTransaction(from string, to string, value string, nonce uint64, data string, signedMessage string) (string, error) {
	client, err := ethclient.Dial(infuraURL)
	if err != nil {
		return "", fmt.Errorf("failed to connect to Ethereum: %v", err)
	}

	defer client.Close()

	// Convert address and value
	fromAddress := common.HexToAddress(from)
	toAddress := common.HexToAddress(to)
	valueBigInt := new(big.Int)
	valueBigInt.SetString(value, 10)

	// Load relayer's private key
	privateKeyECDSA, err := crypto.HexToECDSA(privateKey)
	if err != nil {
		return "", errors.New("invalid relayer private key")
	}

	publicKey := privateKeyECDSA.Public().(*ecdsa.PublicKey)
	relayerAddress := crypto.PubkeyToAddress(*publicKey)

	// Parse contract ABI
	parsedABI, err := abi.JSON(strings.NewReader(contractABI))
	if err != nil {
		return "", errors.New("invalid contract ABI")
	}

	// Prepare function call for executeTransaction
	txData, err := parsedABI.Pack("executeTransaction", fromAddress, toAddress, valueBigInt, nonce, common.FromHex(data), common.FromHex(signedMessage))
	if err != nil {
		return "", fmt.Errorf("failed to pack transaction: %v", err)
	}

	// Get the nonce of the relayer account
	nonceUint, err := client.PendingNonceAt(context.Background(), relayerAddress)
	if err != nil {
		return "", fmt.Errorf("failed to fetch nonce: %v", err)
	}

	// Gas and network parameters
	gasLimit := uint64(300000)
	gasPrice, _ := client.SuggestGasPrice(context.Background())

	// Create the transaction
	tx := types.NewTransaction(nonceUint, common.HexToAddress(contractAddr), big.NewInt(0), gasLimit, gasPrice, txData)

	// Sign the transaction
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(big.NewInt(5)), privateKeyECDSA)
	if err != nil {
		return "", fmt.Errorf("failed to sign transaction: %v", err)
	}

	// Send the transaction
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return "", fmt.Errorf("failed to send transaction: %v", err)
	}

	return signedTx.Hash().Hex(), nil
}
