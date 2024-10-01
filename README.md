
# Cobalt Revolt Bot

Cobalt is a media downloader for all sorts of social platforms.
This is a Revolt bot which automatically downloads media using Cobalt
and sends it as a file on Revolt.

This allows you to bypass opening links and instead watching videos/viewing photos
inside the comfort of Revolt.

## Running your own instance

### Using Docker

All you need to do is to clone the repository, create a configuration file as follows:

```json
{
    "token": "YOUR REVOLT BOT TOKEN HERE",
    "cobaltApiUrl": "COBALT API URL"
}
```

and after you create a file named `config.json` with this content and values filled out,
you can start the server using `docker compose up -d`.

### Using other means to run the app

All you need to do is to clone the repository, create a configuration file as follows:

```json
{
    "token": "YOUR REVOLT BOT TOKEN HERE",
    "cobaltApiUrl": "COBALT API URL"
}
```

and after you create a file named `config.json` with this content and values filled out,
make something, for example a systemd service, run `node dist/` from the project directory.

## Development

1. Fork the project
2. Clone your own fork
3. Make changes and verify they work
4. Open a pull request

There are mirrors available on [git.gay](https://git.gay/mld/CobaltRevoltBot), [github.com](https://github.com/mldchan/CobaltRevoltBot) and [codeberg.org](https://codeberg.org/mldchan/RevoltDiscordBot). You only have to open and send your pull request on one of these mirrors, I'll pull and push from home to sync
changes across all the mirrors.

## Support me

You can follow me on all social platforms listed in [estrogen.productions/mldchan](https://estrogen.productions/mldchan). There's
also a Ko-fi link which you can use to donate through. Your support is welcome! Thank you.
