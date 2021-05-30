#!/bin/bash

set -euo pipefail

# set up env
echo "Setting up environment..."

echo "VIRTUAL_HOST=$APP_DOMAIN" > gateway.env
echo "LETSENCRYPT_HOST=$APP_DOMAIN" >> gateway.env

echo "REGISTRY_NAME=$REGISTRY_NAME" >> .env

# pull latest from registry
echo "Pulling latest images..."
./compose pull

# up -d
echo "Deploying containers..."
./compose up -d

echo "Chat Rooms deployed successfully!"
