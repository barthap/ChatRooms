#!/bin/bash

set -euo pipefail

echo "Setting up environment..."

export REGISTRY_NAME=$REGISTRY_NAME

echo "VIRTUAL_HOST=$APP_DOMAIN" >> client.env
echo "LETSENCRYPT_HOST=$APP_DOMAIN" >> client.env

echo "Pulling latest images..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml pull

echo "Deploying containers..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml up -d

echo "Chat Rooms deployed successfully!"
