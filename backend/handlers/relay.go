package handlers

import (
	"fmt"
	"gasless-forwarder-backend/utils"
	"net/http"

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

func RelayTransaction(c *gin.Context) {
	var req ForwardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	fmt.Printf("Relaying transaction from %s to %s\n", req.From, req.To)

	// blockchain utility to forward the transaction
	txHash, err := utils.SendTransaction(req.From, req.To, req.Value, req.Nonce, req.Data, req.Signed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Transaction relayed successfully!", "txHash": txHash})
}
