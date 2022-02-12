import express from "express";
import { client } from "./Bot";
const app = express();

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
