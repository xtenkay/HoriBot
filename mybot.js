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

	//Help Function
	// This lists all commands available.
	if (msg.content === (prefix + "help")){
		msg.channel.sendMessage(
			"The current commands are:\n\n**!ping** - Pong!\n\n**!bestgirl** - You know who that is!\n\n**!setAvatar** - Sets the bot's avatar.\n\n**!myAvatar** - Shows your avatar's URL\n\n**!setName** - Changes the bot's username."
		);
	}

	//Ping Function
	if(msg.content === (prefix + "ping")){
		msg.channel.sendMessage("pong!");
	}
	
	//Best Girl Function
	if (msg.content === (prefix + "bestgirl")){
		msg.channel.sendMessage("Its me!");
	}

	// Set Avatar Function
	if (msg.content.startsWith(prefix + "setAvatar")){
		let args = msg.content.split(" ");
		bot.user.setAvatar(args[1]);
		console.log('New avatar set!');
		msg.channel.sendMessage("Avatar set!");
		
	}

	// User's Avatar Function
	if (msg.content === (prefix + "myAvatar")) {
		msg.channel.sendMessage(msg.author.avatarURL);
	}

	// Username change Function
	if (msg.content.startsWith (prefix + "setName")) {
		let args = msg.content.split(" ");
		bot.user.setUsername(args[1]);
		msg.channel.sendMessage("Username set!");

	}
});

// Catches errors
bot.on('error', e => { console.error(e); });
// Sets Token
bot.login("MjUyOTUzMTYxMDI1NzE2MjI1.Cztkvw.z0ypnOJyzVlqMW_4eRRqk09fjpc");