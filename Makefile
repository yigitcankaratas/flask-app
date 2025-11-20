# Production Makefile for Flask App

# Variables
APP_NAME = flask-app
DOCKER_IMAGE = yck4756/flask-app
VERSION = latest

# Development Commands
.PHONY: dev
dev:
	docker-compose --profile dev up flask-dev --build

.PHONY: dev-stop
dev-stop:
	docker-compose --profile dev down

# Production Commands
.PHONY: build
build:
	docker build -t $(DOCKER_IMAGE):$(VERSION) .

.PHONY: run
run:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: restart
restart: stop run

# Testing
.PHONY: test
test:
	docker run --rm $(DOCKER_IMAGE):$(VERSION) python -m pytest

.PHONY: test-local
test-local:
	python -m pytest tests/

# Deployment
.PHONY: push
push: build
	docker push $(DOCKER_IMAGE):$(VERSION)

.PHONY: deploy
deploy: push
	kubectl apply -f k8s-deployment.yaml

# Maintenance
.PHONY: clean
clean:
	docker system prune -f
	docker image prune -f

.PHONY: logs
logs:
	docker-compose logs -f

.PHONY: shell
shell:
	docker-compose exec flask-app /bin/bash

# Health Check
.PHONY: health
health:
	curl -f http://localhost:5000/health

# Help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  dev        - Start development server"
	@echo "  build      - Build production Docker image"
	@echo "  run        - Start production server"
	@echo "  stop       - Stop all containers"
	@echo "  test       - Run tests in container"
	@echo "  push       - Push image to Docker Hub"
	@echo "  deploy     - Deploy to Kubernetes"
	@echo "  health     - Check application health"
	@echo "  logs       - View application logs"
	@echo "  clean      - Clean up Docker resources"