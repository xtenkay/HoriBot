var Discord = require("discord.js");
var bot = new Discord.Client();

bot.on('ready', () => {
	console.log('I am ready!');
});

bot.on("message", msg => {
	// Sets prefix
	let prefix = "!";

	// Stop if message doesn't have the prefix
	if(!msg.content.startsWith(prefix)) return;

	// Stop if the message's author is a bot
	if(msg.author.bot) return;

	// Commands
	if (msg.content.startsWith(prefix + "ping")) {
		msg.channel.sendMessage("pong!");
	}
	else if (msg.content.startsWith(prefix + "bestgirl")){
		msg.channel.sendMessage("Its me!");
	}
});
// Catches errors
bot.on('error', e => { console.error(e); });
// Sets Token
bot.login("TokenHere");