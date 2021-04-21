#!/bin/bash

set -euo pipefail

export VIRTUAL_HOST=$APP_DOMAIN
export LETSENCRYPT_HOST=$APP_DOMAIN
export REGISTRY_NAME=$REGISTRY_NAME

SERVER_URL=https://$APP_DOMAIN

# set host url from env
# it is used just to avoid storing all information
# outside this GH repo (it could be stored on deployment host directly)
echo "REACT_APP_SERVER_URL=$SERVER_URL" > client.env

echo "Pulling latest images..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml pull

echo "Deploying containers..."
docker-compose -f docker-compose.yml -f docker-compose.deployment.yml up -d

echo "Chat Rooms deployed successfully!"
