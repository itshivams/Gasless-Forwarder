package handlers

import (
	"gasless-forwarder-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTransactionHistory(c *gin.Context) {
	address := c.Query("address")

	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Address is required"})
		return
	}

	transactions, err := utils.GetTransactionHistory(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transaction history", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"transactions": transactions})
}
