package services

import (
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/rpc"
)

func FetchBalance(address string) (string, error) {
	client, err := rpc.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		return "", fmt.Errorf("failed to connect to Ethereum node: %v", err)
	}

	hexAddr := common.HexToAddress(address)
	var result string

	err = client.Call(&result, "eth_getBalance", hexAddr, "latest")
	if err != nil {
		return "", fmt.Errorf("failed to get balance: %v", err)
	}

	balance := new(big.Int)
	balance.SetString(result[2:], 16)

	ethBalance := new(big.Float).Quo(new(big.Float).SetInt(balance), big.NewFloat(1e18))
	return ethBalance.Text('f', 6), nil
}
