package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"gasless-forwarder-backend/handlers"
	"gasless-forwarder-backend/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getAmoyBalance(c *gin.Context) {
	address := c.Query("address")
	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "please provide address"})
		return
	}

	amoyAPIKey := "TU2JRJ2YI1H9YKI5UDDYM4S4SCN5RFW7K2"
	apiURL := fmt.Sprintf("https://api-amoy.polygonscan.com/api?module=account&action=balance&address=%s&apikey=%s", address, amoyAPIKey)

	resp, err := http.Get(apiURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch balance from Amoy Polygonscan API"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode response from Amoy Polygonscan API"})
		return
	}

	c.JSON(http.StatusOK, result)
}

func main() {
	utils.LoadEnv()

	router := gin.Default()

	router.Use(cors.Default())

	router.POST("/relay", handlers.RelayTransaction)
	router.GET("/history", handlers.GetTransactionHistory)
	router.GET("/balance", handlers.GetBalance)
	router.GET("/amoybalance", getAmoyBalance)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on port %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
