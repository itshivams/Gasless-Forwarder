package utils

import (
	"context"
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

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

	gasLimit := uint64(21000)
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
