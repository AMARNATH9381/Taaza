package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		
		// For demo purposes, accept any token starting with "admin"
		if strings.HasPrefix(tokenString, "admin") {
			// Check session timeout (30 minutes)
			sessionStart := c.GetHeader("X-Session-Start")
			if sessionStart != "" {
				if startTime, err := time.Parse(time.RFC3339, sessionStart); err == nil {
					if time.Since(startTime) > 30*time.Minute {
						c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired"})
						c.Abort()
						return
					}
				}
			}
			c.Set("admin_id", 1)
			c.Next()
			return
		}

		// JWT validation (simplified for demo)
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte("your-secret-key-here"), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("admin_id", claims["admin_id"])
		}

		c.Next()
	}
}