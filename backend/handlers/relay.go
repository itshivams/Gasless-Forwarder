package handlers

import (
	"fmt"
	"net/http"

	"gasless-forwarder-backend/utils"

	"github.com/gin-gonic/gin"
)

type ForwardRequest struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Value  string `json:"value"`
	Nonce  uint64 `json:"nonce"`
	Data   string `json:"data"`
	Signed string `json:"signed"`
}

// RelayTransaction handles the relaying of signed transactions
func RelayTransaction(c *gin.Context) {
	var req ForwardRequest

	// Parse incoming JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	fmt.Printf("Received transaction from %s to %s\n", req.From, req.To)

	// Send the transaction to the blockchain
	txHash, err := utils.SendTransaction(req.From, req.To, req.Value, req.Nonce, req.Data, req.Signed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction relayed successfully!", "txHash": txHash})
}
