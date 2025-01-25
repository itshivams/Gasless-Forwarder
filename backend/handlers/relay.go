package handlers

import (
	"fmt"
	"net/http"

	"gasless-forwarder-backend/utils"

	"github.com/gin-gonic/gin"
)

// incoming relay requests
type ForwardRequest struct {
	From      string `json:"from"`
	To        string `json:"to"`
	Value     string `json:"value"`
	Nonce     uint64 `json:"nonce"`
	Data      string `json:"data"`
	Signed    string `json:"signed"`
	TokenType string `json:"tokenType"`         // "erc20" or "erc721"
	TokenID   string `json:"tokenId,omitempty"` // Only for ERC-721
}

func RelayTransaction(c *gin.Context) {
	var req ForwardRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	fmt.Printf("Relaying %s transaction from %s to %s\n", req.TokenType, req.From, req.To)

	var txHash string
	var err error

	switch req.TokenType {
	case "erc20":
		txHash, err = utils.SendERC20Transaction(req.From, req.To, req.Value, req.Signed)
	case "erc721":
		txHash, err = utils.SendERC721Transaction(req.From, req.To, req.TokenID, req.Signed)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported token type"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("%s transaction relayed successfully!", req.TokenType), "txHash": txHash})
}
