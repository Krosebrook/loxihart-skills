#!/bin/bash
set -euo pipefail

# Eval 2: Healthy Go Service
# A well-structured Go service following standard layout

DIR="${1:-.}/healthy-go-service"
rm -rf "$DIR"
mkdir -p "$DIR"
cd "$DIR"

git init -q

cat > .gitignore << 'EOF'
bin/
*.exe
*.test
*.out
.env
vendor/
EOF

cat > go.mod << 'EOF'
module github.com/example/healthy-service

go 1.22
EOF

cat > go.sum << 'EOF'
EOF

cat > Makefile << 'EOF'
.PHONY: build test run lint
build:
	go build -o bin/server ./cmd/server
test:
	go test ./...
run:
	go run ./cmd/server
lint:
	golangci-lint run
EOF

cat > Dockerfile << 'EOF'
FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /server ./cmd/server

FROM alpine:3.19
COPY --from=build /server /server
EXPOSE 8080
CMD ["/server"]
EOF

cat > README.md << 'EOF'
# Healthy Service

A well-organized Go HTTP service.

## Structure

- `cmd/server/` — Application entry point
- `internal/api/` — HTTP handlers and routing
- `internal/domain/` — Business logic and models
- `internal/repository/` — Data access layer
- `internal/config/` — Configuration loading

## Running

```bash
make run
```

## Testing

```bash
make test
```
EOF

# cmd/ entry point
mkdir -p cmd/server
cat > cmd/server/main.go << 'EOF'
package main

import (
	"fmt"
	"net/http"
	"github.com/example/healthy-service/internal/api"
	"github.com/example/healthy-service/internal/config"
)

func main() {
	cfg := config.Load()
	router := api.NewRouter()
	fmt.Printf("Starting server on :%d\n", cfg.Port)
	http.ListenAndServe(fmt.Sprintf(":%d", cfg.Port), router)
}
EOF

# internal/ packages
mkdir -p internal/api
cat > internal/api/router.go << 'EOF'
package api

import "net/http"

func NewRouter() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", HealthHandler)
	mux.HandleFunc("/users", UsersHandler)
	return mux
}
EOF

cat > internal/api/handler.go << 'EOF'
package api

import "net/http"

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}

func UsersHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`[]`))
}
EOF

cat > internal/api/handler_test.go << 'EOF'
package api

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealthHandler(t *testing.T) {
	req := httptest.NewRequest("GET", "/health", nil)
	w := httptest.NewRecorder()
	HealthHandler(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}
EOF

mkdir -p internal/domain
cat > internal/domain/user.go << 'EOF'
package domain

type User struct {
	ID    string
	Name  string
	Email string
}

type UserService struct{}

func (s *UserService) GetAll() ([]User, error) {
	return []User{}, nil
}
EOF

cat > internal/domain/user_test.go << 'EOF'
package domain

import "testing"

func TestGetAll(t *testing.T) {
	svc := &UserService{}
	users, err := svc.GetAll()
	if err != nil {
		t.Fatal(err)
	}
	if len(users) != 0 {
		t.Errorf("expected 0 users, got %d", len(users))
	}
}
EOF

mkdir -p internal/repository
cat > internal/repository/postgres.go << 'EOF'
package repository

type PostgresRepo struct {
	connStr string
}

func NewPostgresRepo(connStr string) *PostgresRepo {
	return &PostgresRepo{connStr: connStr}
}
EOF

mkdir -p internal/config
cat > internal/config/config.go << 'EOF'
package config

import "os"

type Config struct {
	Port        int
	DatabaseURL string
}

func Load() *Config {
	return &Config{
		Port:        8080,
		DatabaseURL: os.Getenv("DATABASE_URL"),
	}
}
EOF

cat > .env.example << 'EOF'
DATABASE_URL=postgresql://localhost:5432/mydb
EOF

git add -A
git commit -q -m "initial commit"

echo "✅ Eval 2 repo created at $DIR"
