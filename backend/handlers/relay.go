package handlers

import (
	"fmt"
	"gasless-forwarder-backend/utils"
	"math/big"
	"net/http"

	"github.com/gin-gonic/gin"
)

// TransactionRequest represents the incoming JSON payload
type TransactionRequest struct {
	From      string `json:"from"`
	To        string `json:"to"`
	Value     string `json:"value"`
	Nonce     uint64 `json:"nonce"`
	Data      string `json:"data"`
	Signed    string `json:"signed"`
	TokenType string `json:"tokenType"`
}

// TransactionResponse represents the response format
type TransactionResponse struct {
	Message string `json:"message"`
	TxHash  string `json:"txHash"`
	Balance string `json:"balance"`
}

// RelayTransaction processes and forwards the gasless transaction
func RelayTransaction(c *gin.Context) {
	var txReq TransactionRequest

	if err := c.ShouldBindJSON(&txReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Relay the signed transaction
	txHash, err := utils.SendSignedTransaction(txReq.Signed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Transaction failed: %v", err)})
		return
	}

	// Get updated balance based on token type
	var balance *big.Int
	if txReq.TokenType == "erc20" {
		balance, err = utils.GetERC20Balance(txReq.From)
	} else if txReq.TokenType == "erc721" {
		balance, err = utils.GetERC721Balance(txReq.From)
	} else {
		balance, err = utils.GetETHBalance(txReq.From)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to get balance: %v", err)})
		return
	}

	// Prepare the response
	response := TransactionResponse{
		Message: fmt.Sprintf("%s transaction relayed successfully!", txReq.TokenType),
		TxHash:  txHash,
		Balance: balance.String(),
	}

	c.JSON(http.StatusOK, response)
}
