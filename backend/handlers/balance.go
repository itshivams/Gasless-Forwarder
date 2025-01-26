package handlers

import (
	"net/http"

	"gasless-forwarder-backend/services"

	"github.com/gin-gonic/gin"
)

func GetBalance(c *gin.Context) {
	address := c.Query("address")
	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing address parameter"})
		return
	}

	balance, err := services.FetchBalance(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch balance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"address": address, "balance": balance})
}
