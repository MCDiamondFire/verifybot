const { Router } = require("express");

const passport = require("passport");
const uuid = require("uuid/v4");

const checkAuth = require("../functions/checkAuth");
const fetchVariables = require("../functions/fetchVariables");

// Initialise router
const router = Router();

// GET /login
router.get("/login", passport.authenticate("discord"));

// GET /callback
router.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/error"
}), (req, res) => {
    res.redirect("/");
});

// GET /error
router.get("/error", (req, res) => {
    // Fetch variables
    const {
        client,
        templateDir
    } = fetchVariables(req);

    res.render(`${templateDir}/autherror.ejs`, {
        client,
        path: req.path,
        auth: req.isAuthenticated(),
        user: req.isAuthenticated() ? req.user : null
    });
});

// GET /logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// GET /
router.get("/", (req, res, next) => {
    if (!req.isAuthenticated() && req.query.key) res.cookie("secret_key", req.query.key);

    next();
    }, checkAuth, async (req, res) => {
    // Fetch variables
    const { client, templateDir } = fetchVariables(req);

    // If user is not on the guild, prompt them to join
    if (!client.guild.members.has(req.user.id)) {
        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "You aren't on the DiamondFire Discord server! <a href=\"https://discord.gg/pDHBbBD\" class=\"btn btn-blurple\">Join</a>"
            }
        });
    }

    // Fetch user permissions
    const perms = await client.permLevel(req.user.id);

    // If user is verified, tell them that they are already verified
    if (perms.level === 1) {
        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: `You are already verified!${perms.level >= 2 ? " <a href=\"/staff\" class=\"btn btn-blurple\">Go to staff panel</a>" : ""}`
            }
        });
    }

    // Fetch key
    const key = req.query.key || req.cookies.secret_key;

    // If key is invalid, give them instructions
    if (!key) {
        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: `
            <div class="container text-left">
                <h3>How do I verify myself?</h3>
                <ol>
                    <li>Join the Minecraft server
                        <b>mcdiamondfire.com</b>.</li>
                    <li>Type
                        <b>/verify</b> in the chat.</li>
                    <li>Click on the <b>link</b> sent to you.</li>
                    <li><b>Confirm</b> verification by clicking the text sent to you through Discord direct message.</li>
                </ol>
                <h3>What does verification do?</h3>
                <ul>
                    <li>You can
                        <b>chat</b> with other players.</li>
                    <li>You can
                        <b>react</b> to messages.</li>
                    <li>You can
                        <b>speak</b> with other players in voice channels.</li>
                </ul>
            </div>`
            }
        });
    }

    // Fetch data
    const data = await client.query(`SELECT * FROM linked_accounts WHERE secret_key = '${(key || "").replace(/[^a-z\d]/ig, "")}';`);
    // Fetch the first entry
    const profile = data[0];

    // Fetch the user
    const user = await client.guild.members.fetch(req.user.id);

    // If no profile was found for the specified key, send them to a link to get instruction
    if (!profile) {
        res.clearCookie("secret_key");
        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "Your key is invalid or expired."
            }
        });
    }

    // Remove the secret key from the user's profile
    await client.query("UPDATE linked_accounts SET secret_key = NULL WHERE secret_key = ?;", [profile.secret_key]);

    // Generate a token
    const token = uuid();

    // Send them a message
    user.send({
        embed: {
            description: `Click [here](${client.config.dashboard.domain}/confirm?token=${token}) to verify your account! This link will expire in 3 minutes.`,
            url: "http://verify.mcdiamondfire.com",
            color: 7506394,
            timestamp: new Date(),
            footer: {
                icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
                text: "VerifyBot"
            },
            author: {
                name: "Confirm Verification"
            }
        }
    }).then(() => {
        res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "Check your private messages on Discord!"
            }
        });

        // Add the generated token to the collection
        client.tokens.set(token, { ...profile,
            discord_id: req.user.id
        });

        // Delete it after 3 minutes
        setTimeout(() => client.tokens.delete(token), 180000);
    }).catch(() => {
        res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "Please enable direct messages."
            }
        });
    });
});

router.get("/confirm", checkAuth, async (req, res) => {
    // Fetch variables
    const { client, templateDir } = fetchVariables(req);
    // Fetch token data
    const data = client.tokens.get(req.query.token);
    // If no token found, tell the user their token has expired
    if (!data) {
        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "Your token has expired. Please go through the verification process again."
            }
        });
    }

    const user = client.guild.members.get(req.user.id);

    if (!user) {
        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "You appear to have left the server! I cannot verify you if you're not on it."
            }
        });
    }

    if (data.discord_id !== req.user.id) {
        client.guild.ban(data.discord_id, { reason: "Sharing a confirmation link with another user." });
        user.kick({ reason: "Using a confirmation link from another user." });

        return res.render(`${templateDir}/index.ejs`, {
            client,
            user: req.user,
            data: {
                message: "This verification link has not been created by you. You have been kicked from the server and the owner has been banned."
            }
        });
    }
    
    // Delete the user's token information
    client.tokens.delete(req.query.token);
    // Give the user the role
    user.roles.add(client.guild.roles.find("name", "Verified")).catch(() => null);
    // Set the user's nickname
    user.setNickname(data.player_name);

    // Update their discord id field
    client.query(`UPDATE linked_accounts SET discord_id = '${req.user.id}' WHERE player_name = '${data.player_name}';`);

    // Tell them that their account has been successfully verified
    res.render(`${templateDir}/index.ejs`, {
        client,
        user: req.user,
        data: {
            message: "Your account has been verified!"
        }
    });

    // Get the channel
    const channel = client.guild.channels.find("name", client.config.channels.verification);
    // If not channel, return
    if (!channel) return;

    // Create an embed
    const embed = channel.buildEmbed()
        .setColor(0x33FF64)
        .setAuthor(data.player_name, user.avatarURL({ size: 128, format: "png" }))
        .setDescription(`${req.user.username} has verified their account as ${data.player_name}.`);

    // Send the embed
    embed.send();

    console.log(`${req.user.username} has verified their Discord account as ${data.player_name}.`);
});

// Export the router
module.exports = router;
