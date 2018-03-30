const { Collection, Client } = require("discord.js");
const { readdir } = require("fs");
const mysql = require("mysql");
const levels = require("../levels.json");
const getYouTubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const dispatcher = require('streamdispatch');
const ytdl = require('ytdl-core');

/**
 * Represents a Discord client
 * @extends {Discord.Client}
 */
class CustomClient extends Client {
    /**
     * @param {ClientOptions} clientOptions The options passed through the client.
     */
    constructor(clientOptions) {
        // Initialise client
        super(clientOptions);

        /**
         * A collection of all of the bot's commands
         * @type {Discord.Collection}
         */
        Object.defineProperty(this, "commands", { value: new Collection() });
        /**
         * A collection of all of the bot's command aliases
         * @type {Discord.Collection}
         */
        Object.defineProperty(this, "aliases", { value: new Collection() });

        /**
         * A collection of all of every user's verification attempts
         * @type {Discord.Collection}
         */
        Object.defineProperty(this, "attempts", { value: new Collection() });
        /**
         * A collection of all of every user's verification cooldown times
         * @type {Discord.Collection}
         */
        Object.defineProperty(this, "cooldowns", { value: new Collection() });
        /**
         * A collection of every user's verification tokens
         * @type {Discord.Collection}
         */
        Object.defineProperty(this, "tokens", { value: new Collection() });

        /**
         * The bot's config data
         * @type {Object}
         */
        Object.defineProperty(this, "config", { value: clientOptions.config || {} });

        /**
         * The ID of the Discord server
         * @type {String}
         */
        Object.defineProperty(this, "guildID", { value: clientOptions.guild });

        /**
         * SQL data
         * @type {Object}
         */
        Object.defineProperty(this, "sql", { value: clientOptions.sql });

        setInterval(async () => {
            // Fetch all verified users
            const verified = this.guild.members.filter(member => member.roles.exists("name", "Verified"));
            // Fetch account data
            const data = await this.query("SELECT player_name, discord_id FROM linked_accounts;");
            
            // Run through all verified users
            verified.forEach(user => {
                // Fetch their profile data
                const profile = data.find(entry => entry.discord_id === user.id);
                // If no profile exists, unverify them
                if (!profile) return user.roles.remove(user.roles.find("name", "Verified")).catch(() => null).then(() => user.setNickname("").then(() => user.send("You have been unverified - this is most likely because you weren't verified by the bot, meaning you aren't registered in the database.")));

                // If nickname is out of sync, set it to their player name
                if (profile.player_name !== user.displayName) return user.setNickname(profile.player_name);
            });
        }, 900000);
    }

    /**
     * The Discord server
     * @type {Discord.Guild}
     */
    get guild() {
        return this.guilds.get(this.guildID) || {};
    }

    /**
     * Loads all commands in the specified directory
     * @param {String} path The filepath in which the commands are located
     * @returns {CustomClient} The current client
     */
    loadCommands(path) {
        // Read from the commands directory
        readdir(`${path}/`, (error, categories) => {
            // Run through every command category
            categories.forEach(category => {
                // Fetch commands from the current category
                readdir(`${path}/${category}/`, (err, commands) => {
                    console.log(`Loading ${commands.length} commands from category ${category}...`);

                    // Run through every command in the current category
                    commands.forEach(async command => {
                        // Get start time
                        const start = Date.now();
                        // Initialise the command
                        const props = new (require(`../${path}/${category}/${command}`))(this);
                        // Define the command's filepath
                        Object.defineProperty(props.conf, "filepath", { value: `${path}/${category}/${command}` });
                        
                        // If the command has an init function, run it
                        if (props.init) await props.init(this);

                        // Run through every alias and add it to the collection
                        props.conf.aliases.forEach(alias => this.aliases.set(alias, props.help.name));

                        // Register the command
                        this.commands.set(props.help.name, props);

                        console.log(`Loaded command ${props.help.name} in ${Date.now() - start}ms.`);
                    });
                });
            });
        });

        return this;
    }

    /**
     * Loads all events in the specified directory
     * @param {String} path The filepath in which the events are located
     * @returns {CustomClient} The current client
     */
    loadEvents(path) {
        // Read from the events directory
        readdir(path, (error, events) => {
            // Run through every event
            events.forEach(event => {
                try {
                    // Initialise the event
                    const props = new (require(`../${path}/${event}`))(this);
                    // Add an event emitter
                    super.on(event.split(".")[0], (...args) => props.run(...args));

                    // If the event has an init function, run it
                    if (props.init) props.init(this);
                } catch (e) {
                    return;
                }
            });
        });

        return this;
    }

    /**
     * Logs the client into Discord.
     * @param {String} token The bot's token. 
     * @returns {CustomClient} The current client
     */
    start(token) {
        // Login with the specified token
        super.login(token);

        return this;
    }

    /**
     * Creates a mysql query
     * @param {String} sql The sql code to execute
     * @returns {Promise<Array>} An array of results
     */
    query(...params) {
        // Create a connection
        const connection = mysql.createConnection(this.sql);
        connection.connect();

        return new Promise((resolve, reject) => {
            // Create a MySQL query from the connection
            connection.query(...params, (err, result) => {
                if (err) return reject(err);
                resolve(result);
                connection.end();
            });
        });
    }

    /**
     * Fetches a user's permission level
     * @param {String} user The ID of the target user
     * @returns {Promise<Object>} A promise containing the user's permissions
     */
    permLevel(user) {
        // Fetch the permissions list and sort it by level
        const perms = levels.perms.sort((a, b) => b.level < a.level ? 1 : -1);
        // Define the user's perms as level 0
        let userPerms = perms[0];

        return new Promise(r => {
            // Fetch the guild member
            this.guild.members.fetch(user).then(member => {
                // Filter through all permissions applicable to the user and return the highest level fount
                userPerms = perms.filter(p => (p.role && member.roles.exists("name", p.role)) || (p.ids && p.ids.includes(user))).pop();
                r(userPerms);
            }).catch(() => {
                r(userPerms);
            });
        });
    }
}

// Export the custom client
module.exports = CustomClient;
