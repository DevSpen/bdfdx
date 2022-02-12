
import express from "express";
const app = express();
import { Client, Intents } from "discord.js";
const Monitor = require("ping-monitor");
export const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

/**
 * The main class.
 *
 * ```typescript
 * import { Bot } from "bdfdx";
 * const bot = new Bot("token");
 * bot.init();
 * ```
 *
 * Now that we've initialized everything, you can start adding plugins.
 */

export class Bot {
  token: string;
  port?: number;

  constructor(token: string, port = 4700) {
    this.token = token;
    this.port = port;
  }

  public init() {
    client.login(this.token);
    client.once("ready", () => {
      console.log("Initialized everything!");
      client.user.setStatus("invisible");
    });

    app.listen(this.port);
    app.get("/", (req, res) => {
      res.send("<strong>You're ready to rock and roll!</strong>");
    });
  }

  public host(url: string) {
    const monitor = new Monitor({
      website: url,
      title: "NAME",
      interval: 2,
    });
    monitor.on("up", () => console.info("Hosting enabled."));
    monitor.on("down", (res) =>
      console.warn(`${res.website} process has died: ${res.statusMessage}`)
    );
    monitor.on("stop", () => console.info("Monitor has stopped!"));
    monitor.on("error", (err: any) => console.error(`Monitor error:\n\t${err}`));
  }
}