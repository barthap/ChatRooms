
set -euo pipefail

# set host url from env
# it is used just to avoid storing all information
# outside this GH repo (it could be stored on deployment host directly)
echo "REACT_APP_API_URL=$PROXY_URL" > proxy_host.env

docker-compose -f docker-compose.yml -f docker-compose.deployment.yml up -d

echo "Chat Rooms deployed successfully!"
