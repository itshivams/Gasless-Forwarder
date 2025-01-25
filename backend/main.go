package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type ForwardRequest struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Value  string `json:"value"`
	Nonce  uint64 `json:"nonce"`
	Data   string `json:"data"`
	Signed string `json:"signed"`
}

func relayTransaction(c *gin.Context) {
	var req ForwardRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	client, err := ethclient.Dial(os.Getenv("INFURA_RPC_URL"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to blockchain"})
		return
	}
	defer client.Close()

	contractAddress := common.HexToAddress(os.Getenv("FORWARDER_CONTRACT_ADDRESS"))
	fmt.Printf("Using contract address: %s\n", contractAddress.Hex())

	// Here you should create a transaction and sign it using your relayer's private key
	fmt.Printf("Relaying transaction from %s to %s with value %s\n", req.From, req.To, req.Value)

	c.JSON(http.StatusOK, gin.H{"message": "Transaction relayed successfully!"})
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := gin.Default()
	r.POST("/relay", relayTransaction)

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}
	r.Run(":" + port)
}
