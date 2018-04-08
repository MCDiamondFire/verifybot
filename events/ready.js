const { readFileSync } = require("fs");
const ms = require("pretty-ms");

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        // Check node version
        if (parseInt(process.version.split(".")[0]) < 8) throw new Error("Your node version is too low, meaning VerifyBot will not function. Please update node if possible.");
        // Inform user that connection to websocket has been made
        console.log(`Connected to Discord as ${this.client.user.tag}.`);

        // Activate dashboard
        require("../dashboard/dashboard")(this.client);

        try {
            // Fetch reboot info
            const reboot = JSON.parse(readFileSync("restart.json"));
            // Fetch reboot message
            const message = await this.client.channels.get(reboot.channel).messages.fetch(reboot.id);
            // Update reboot timestamp
            message.edit(`✅ | Successfully rebooted in ${Date.now() - reboot.time}ms.`);
        } catch (e) {
            return null;
        }

        const fetchData = require("../methods/restricted/fetchNodeData");

        let nodesOnline = [];

        // Start node data loop
        setInterval(async () => {
            // Fetch node data
            const { online, offline, list } = await fetchData(this.client);
            
            // Fetch the updates channel
            const channel = this.client.guild.channels.find("name", this.client.config.channels.nodes);
            // If no channel found, return
            if (!channel) return;
            if (nodesOnline.length > online.length) {
                const crashed = nodesOnline.filter(n => !online.map(({ node }) => node).includes(n));
                const message = `${crashed.length > 1 ? `Nodes ${crashed.slice(0, crashed.length - 1).join(", ")} and ${crashed.pop()}` : `Node ${crashed[0]}`} crashed! Check ${channel.toString()} for further information.`;

                this.client.guild.members.filter(member => member.roles.exists("name", "Developer")).forEach(member => {
                    member.send(message).catch(() => null);
                });
            }

            if (offline.length >= 1) {
                this.client.user.setPresence({
                    activity: {
                        name: offline.length > 1 ? `Nodes ${offline.map(({ node }) => node).offline.slice(0, offline.length - 1).join(", ")} and ${offline[offline.length - 1].node} offline` : `Node ${offline[0].node} offline`,
                        type: 0
                    },
                    status: "dnd"
                });
            } else {
                this.client.user.setPresence({
                    activity: {
                        name: `with ${list.reduce((out, data) => data.players + out, 0)} players`,
                        type: 0
                    },
                    status: "online"
                });
            }

            nodesOnline = online.map(({ node }) => node);

            const embed = channel.buildEmbed()
                .setColor(online.length < 3 ? "RED" : "GREEN")
                .setAuthor("Node Report")
                .setDescription(`${offline.length === 0 ? `All nodes online!` : `${offline.length} node${offline.length === 1 ? "" : "s"} offline`}`);

            list.map(data => embed.addField(`Node ${data.node}`, `${data.online ? `Online with ${data.players === 0 ? "no" : data.players} player${data.players === 1 ? "" : "s"}` : `Offline for ${ms(Date.now() - data.updated, { verbose: true, secDecimalDigits: 0 })}`}`));

            const collection = await channel.messages.fetch({ limit: 1 });
            
            if (collection.size === 0) return embed.send();
            
            const message = collection.first();

            message.edit({ embed });
        }, 30000);

        // Fetch 12:00 PM
        // const dt = new Date();
        // const tomorrowNoon = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1, 12, 0, 0);

        // Fetch notify function
        // const notify = require("../methods/restricted/plotNotify");

        // setTimeout(() => {
        //    notify(this.client);
        //    setInterval(() => notify(this.client), 8.64e+7);
        // }, new Date() - tomorrowNoon);
    }
};
