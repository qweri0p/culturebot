# CultureBot

This bot is NSFW. You've been warned.

Invite it using [this link](https://discord.com/api/oauth2/authorize?client_id=1177354553956511764&permissions=0&scope=bot) or self host it.

## Self hosting
I reccommend running the bot's official docker image.

`docker run -e TOKEN=<INSERT BOT TOKEN> -e CLIENT_ID=<INSERT CLIENT_ID> ghcr.io/qweri0p/culturebot`

If you want to use docker compose:

```yaml
services:
  culturebot:
    container_name: culturebot
    image: ghcr.io/qweri0p/culturebot
    environment:
      - TOKEN=<INSERT BOT TOKEN>
      - CLIENT_ID=<INSERT CLIENT_ID>
    restart: unless-stopped
```