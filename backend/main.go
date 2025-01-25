package main

import (
	"fmt"
	"log"
	"os"

	"gasless-forwarder-backend/handlers"
	"gasless-forwarder-backend/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	utils.LoadEnv()

	router := gin.Default()

	router.POST("/relay", handlers.RelayTransaction)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server running on port %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
