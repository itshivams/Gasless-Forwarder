package main

import (
	"fmt"
	"gasless-forwarder-backend/handlers"
	"gasless-forwarder-backend/utils"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	utils.LoadEnv()
	router := gin.Default()

	router.POST("/relay", handlers.RelayTransaction)

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}
	fmt.Printf("Server running on port %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
