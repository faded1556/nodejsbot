const {
    Client,
    Intents,
    MessageEmbed
} = require("discord.js");
const fs = require('fs');
const axios =
    require("axios");
const talkedRecently = new Set();
const talkedRecent = new Set();
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const config = require("./config.json");
const lcembed = new MessageEmbed()
    .setColor('#30106b')
    .setDescription('Grabbing reuslts from [Leakcheck](https://leakcheck.net)')
client.on("ready", () => {
    client.user.setActivity(config.prefix + 'help', {
        type: 'LISTENING'
    });
});

client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command =
        args.shift().toLowerCase();
    if (message.author.id === '741003391617990756') {
        if (command === 'wl') {
            if (!args[0]) return message.channel.send("Please enter a query");
            const user = args[0]
            fs.appendFile('wl.txt', user + '\n', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            message.channel.send("<@" + user + "> has been whitelisted")
        }
    }
    if (command === 'buy') {
        const buyembed = new MessageEmbed()
            .setColor('30106b')
            .setDescription('Join the [server](https://discord.gg/THz5MEtkAB) to get whitelisted')
        message.channel.send({
            embeds: [buyembed]
        });
    } else {
        if (command === 'support') {
            const server = new MessageEmbed()
                .setColor('30106b')
                .setDescription('Join the server [here](https://discord.gg/THz5MEtkAB)')
            message.channel.send({
                embeds: [server]
            });
        } else {
            if (command === 'invite') {
                const invembed = new MessageEmbed()
                    .setColor('30106b')
                    .setDescription('Invite the bot [here](https://discord.com/api/oauth2/authorize?client_id=805904049047863337&permissions=3072&scope=bot)')
                message.channel.send({
                    embeds: [invembed]
                });
            } else {
                if (command === 'help') {
                    const helpembed = new MessageEmbed()
                        .setColor('#30106b')
                        .setTitle('Vanilla Commands')
                        .setDescription('**,buy**\nPurchase access to the bot.\n\n**,help**\nShows this help message.\n\n**,invite**\nShows bot invite link.\n\n**,support**\nShows support server.\n\n**,lookup [username/email]**\nSearch breaches for your email/username through Leakcheck.\n\n**,rlookup [username/email]**\nSearch passwords for your email/username through Leakcheck with user:pass format.')
                    message.channel.send({
                        embeds: [helpembed]
                    });
                } else {
                    fs.readFile('wl.txt', function(err, data) {
                        if (err) throw err;
                        if (data.indexOf(message.author.id) >= 0) {
                            if (command === 'rlookup') {
                                if (talkedRecent.has(message.author.id)) {
                                    message.channel.send("This command is rate limited");
                                } else {
                                    talkedRecent.add(message.author.id);
                                    setTimeout(() => {
                                        talkedRecent.delete(message.author.id);
                                    }, 3000);

                                    if (!args[0]) return message.channel.send("Please enter a query");
                                    message.channel.send({
                                        embeds: [lcembed]
                                    });
                                    const email2 = args[0];
                                    const options2 = {
                                        method: 'GET',
                                        url: 'https://leakcheck.net/api?key=9b49e01d17d6bc609bacba97e63ffd577996fd18&check=' + email2 + '&type=auto',
                                    };
                                    axios.request(options2).then(function(response2) {
                                        const suc2 = JSON.stringify(response2.data.success);
                                        if (suc2 === "false") {
                                            const notfound = new MessageEmbed()
                                                .setColor('#30106b')
                                                .setTitle('Results')
                                                .setDescription('No results found')
                                            message.channel.send({
                                                embeds: [notfound]
                                            });
                                        } else {
                                            var resp2 = response2.data;
                                            console.log(resp2);
                                            resp3 = resp2
                                                .result
                                                .map(function(result) {
                                                    return result.line;
                                                })
                                                .join("\n");
                                            JSON.stringify(resp3);
                                            console.log(resp3);


                                            let n2 = resp3.length;
                                            if (n2 >= 2000) {
                                                fs.writeFile("results.txt", resp3, function(err2) {
                                                    if (err2) {
                                                        return console.log(err2);
                                                    }
                                                    console.log("The file was saved!");
                                                    message.channel.send({
                                                        files: ['./index.js']
                                                    });
                                                });
                                            } else {
                                                const found = new MessageEmbed()
                                                    .setColor('#30106b')
                                                    .setTitle('Results')
                                                    .setDescription(resp3)
                                                message.channel.send({
                                                    embeds: [found]
                                                }).catch(function(error2) {
                                                    var prob2 =
                                                        JSON.stringify(error2);
                                                    message.message.send("A system error has occurred.");
                                                });
                                            }
                                        };
                                    });
                                }
                            } else {

                                if (command === "lookup") {
                                    if (talkedRecently.has(message.author.id)) {
                                        message.channel.send("This command is rate limited");
                                    } else {
                                        talkedRecently.add(message.author.id);
                                        setTimeout(() => {
                                            talkedRecently.delete(message.author.id);
                                        }, 3000);

                                        if (!args[0]) return message.channel.send("Please enter a query");
                                        message.channel.send({
                                            embeds: [lcembed]
                                        });
                                        const email = args[0];
                                        const options = {
                                            method: 'GET',
                                            url: 'https://leakcheck.net/api?key=9b49e01d17d6bc609bacba97e63ffd577996fd18&check=' + email + '&type=auto',
                                        };
                                        axios.request(options).then(function(response) {
                                            const suc = JSON.stringify(response.data.success);
                                            if (suc === "false") {
                                                message.channel.send("```JSON\n[]```");
                                            } else {
                                                var resp = JSON.stringify(response.data.result, ["email_only", "line", "last_breach", "sources"],
                                                    4);
                                                let n = resp.length;
                                                if (n >= 2000) {
                                                    fs.writeFile("results.txt", resp, function(err) {
                                                        if (err) {
                                                            return console.log(err);
                                                        }
                                                        console.log("The file was saved!");
                                                        message.channel.send({
                                                            files: ['./results.txt']
                                                        });
                                                    });
                                                } else {
                                                    message.channel.send("```json\n" + resp + "```").catch(function(error) {
                                                        var prob =
                                                            JSON.stringify(error);
                                                        message.reply("```JSON\nA system error has occurred.```");

                                                    });

                                                }
                                            };
                                        });
                                    };
                                }
                            }
                        } else {
                            message.channel.send("You are not whitelisted yet, please do -buy to get whitelisted")
                        }
                    });
                }
            }
        }
    }
});
client.login(config.token);
