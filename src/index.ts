import { Client } from "revolt.js";
import * as fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import Uploader from "revolt-uploader";

const config = JSON.parse(fs.readFileSync("config.json").toString());

let client = new Client();
let uploader = new Uploader(client);

console.log("Revolt bot is starting up...");

client.on("message", async (message) => {
    if (message.author?.bot) return;

    const regex = /(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gm;

    const matches = regex.exec(message.content ?? "");
    if (!matches) return;

    if (matches?.length > 0) {
        for (const match of matches) {
            try {
                const response = await fetch(config.cobaltApiUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: match,
                        filenameStyle: "pretty",
                        alwaysProxy: true,
                        videoQuality: config.videoQuality ?? "360",
                        audioBitrate: config.audioQuality ?? "128"
                    })
                });

                if (response.status !== 200) {
                    message.channel?.sendMessage("Non-200 response");
                    return;
                }

                const details = await response.json();

                if (details.status === "error") return;

                if (details.status === "tunnel" || details.status === "redirect") {
                    console.log(`fetching ${details.url}`);
                    const fileResponse = await fetch(details.url);
                    const writer = fs.createWriteStream(details.filename);
                    if (fileResponse.body) {
                        const pipelineAsync = promisify(pipeline);
                        await pipelineAsync(fileResponse.body, writer);
                        console.log("Downloaded file");
                        writer.close();

                        if (fs.statSync(details.filename).size === 0) {
                            fs.unlinkSync(details.filename);
                            return;
                        }

                        const uploaded = await uploader.uploadFile(details.filename, details.filename);

                        await message.reply({ attachments: [uploaded] });
                        fs.unlinkSync(details.filename);
                    }
                }

                if (details.status === "picker") {
                    let filesDownloaded: string[] = [];

                    for (let i of details.picker) {
                        console.log(`fetching ${i.filename}`);
                        const fileResponse = await fetch(i.url);
                        const writer = fs.createWriteStream(i.filename);
                        if (fileResponse.body) {
                            const pipelineAsync = promisify(pipeline);
                            await pipelineAsync(fileResponse.body, writer);
                            console.log("Downloaded file");
                            writer.close();
                            if (fs.statSync(i.filename).size === 0) {
                                fs.unlinkSync(i.filename);
                                return;
                            }

                            const uploaded = await uploader.uploadFile(i.filename, i.filename);

                            await message.reply({ attachments: [uploaded] });
                            fs.unlinkSync(i.filename);
                        }
                    }

                    for (let i of filesDownloaded) {
                        fs.unlinkSync(i);
                    }
                }
            } catch (error) {
                // ignore
            }
        }
    }
});

client.loginBot(config.token);
