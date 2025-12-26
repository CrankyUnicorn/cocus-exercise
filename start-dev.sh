#!/bin/bash

echo "Stopping and removing old containers/networks..."
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

echo "Starting development containers..."
docker-compose -f docker-compose.dev.yml --env-file .env up --build
