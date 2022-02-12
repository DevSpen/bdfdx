import express from "express";
const app = express();
import { Client, Intents } from "discord.js";
const Monitor = require("ping-monitor");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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

/**
 * Use this class to enable plugins.
 *
 * ```typescript
 * //Config code
 * import { Bot, Plugins } from "bdfdx";
 * const bot = new Bot("token");
 * bot.init();
 *
 * //Enabling plugins
 * const plugins = new Plugins();
 * plugins.enable("listBans"); //Now the listBans endpoint is enabled
 * ```
 * Now, once you run the project, in BDFD you can do:
 * ```php
 * $nomention
 * $httpGet[<INSERT LINK TO PROJECT/REPL>/listBans?guild=$guildID]
 * $httpResult[ids] $c[List of all banned user IDs]
 * $httpResult[usernames] $c[List of all banned usernames]
 * $httpResult[tags] $c[List of all banned user tags]
 */
export class Plugins {
  private listBans() {
    app.get("/listBans", async (req, res) => {
      try {
        const guildId = String(req.query.guild);
        const guild = await client.guilds.fetch({
          guild: client.guilds.resolveId(guildId),
        });
        guild.bans.fetch().then((bans) => {
          res.json({
            ids: bans.map((x) => x.user.id).join(", "),
            usernames: bans
              .map((x) => x.user.username.replace(/\, /g, ", "))
              .join(", "),
            tags: bans.map((x) => x.user.tag.replace(/\, /g, ", ")).join(", "),
          });
        });
      } catch (err) {
        res.json({ error: "Failed to make request." });
      }
    });
  }

  public enable(pluginName: "listBans") {
    switch (pluginName) {
      case "listBans":
        this.listBans();
        break;
    }
  }
}
