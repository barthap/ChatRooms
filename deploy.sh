#!/bin/bash

set -euo pipefail

echo "Setting up environment..."

export VIRTUAL_HOST=$APP_DOMAIN
export LETSENCRYPT_HOST=$APP_DOMAIN
export REGISTRY_NAME=$REGISTRY_NAME

SERVER_URL=https://$APP_DOMAIN

echo "REACT_APP_SERVER_URL=$SERVER_URL" > client.env

echo "Pulling latest images..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml pull

echo "Deploying containers..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml up -d

echo "Chat Rooms deployed successfully!"
