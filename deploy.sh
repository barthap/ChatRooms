#!/bin/bash

set -euo pipefail

# set up env
echo "Setting up environment..."

echo "VIRTUAL_HOST=$APP_DOMAIN" > client.env
echo "LETSENCRYPT_HOST=$APP_DOMAIN" >> client.env

echo "REGISTRY_NAME=$REGISTRY_NAME" >> .env

# pull latest from registry
echo "Pulling latest images..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml pull

# up -d
echo "Deploying containers..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml up -d

echo "Chat Rooms deployed successfully!"
