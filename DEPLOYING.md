# How to enable deployment with CI

Currently, the deployment workflow is down, because the app is unused and there is no need for it to be running on my personal VPS.

## 0. Prerequisities

Assuming no modifications in the repository code.

- A Linux/Debian VPS server with dockerized nginx-proxy and letsencrypt containers.
- A subdomain for the chat application.
- Custom Docker registry.
- A docker network named `nginx-proxy` connected to the proxy and LE containers.

## 1. Prepare the VPS

1. Make sure you have prerequisites above.
2. Generate SSH key.
3. `cd` into `/home/{your_username}` and `mkdir chatrooms`.

## 2. Set GitHub secrets

Open the [secrets page](https://github.com/barthap/ChatRooms/settings/secrets/actions).

### SSH configuration

GH Actions use SSH to upload files to VPS. Create SSH key on your server and provide following secrets.

- `HOST` - your SSH hostname
- `PORT` - SSH port
- `USERNAME` - user to login with SSH
- `SSHKEY` - your SSH private key contents

### Docker registry

Current configuration expects uploading built docker images to a custom Docker registry. It prepends `REGISTRY_NAME` to image name/tag, so it becomes `registry.example.com/chatrooms/server:latest`

- `REGISTRY_NAME` - your custom registry domain, e.g. `registry.example.com`
- `REGISTRY_USER` - registry username
- `REGISTRY_PASS`

### Others

- `APP_DOMAIN` - domain name on which the chat is deployed, e.g. `chat.example.com`. It is used for nginx-proxy and letsencrypt.
- `IMGBB_KEY` - API key for imgbb.com - a site used to host attachment images.

## 3. Enable Github Actions

Currently, the CI is disabled [here](https://github.com/barthap/ChatRooms/settings/actions). Select _Enable all actions_.

Now you can try running the CI actions: Client Build, Server Build and then Deploy (it requires the two previous to complete on the `main` branch).
