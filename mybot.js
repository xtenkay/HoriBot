var Discord = require("discord.js");
var bot = new Discord.Client();

bot.on('ready', () => {
	console.log('I am ready!');
});

let prefix = "!";
var response = {
	"ping" : "pong!",
	"help" : "The current commands are:\n\n**!ping** - Pong!\n\n**!bestgirl** - You know who that is!\n\n**!setAvatar** - Sets the bot's avatar.\n\n**!myAvatar** - Shows your avatar's URL\n\n**!setName** - Changes the bot's username.",
	"bestgirl" : "Its me!",
	
};

bot.on('message', (message) => {
	if (!message.content.startsWith(prefix)) return;
	var content = message.content.substr(1);
	if (content in response) {
		message.channel.sendMessage(response[content]);
}
	//Set Avatar
	if (message.content.startsWith(prefix + "setAvatar")){
		let args = message.content.split(" ");
		bot.user.setAvatar(args[1]);
		setTimeout(function(){
			console.log('New avatar set!');
			message.channel.sendMessage("Avatar set!");
		}, 2000);
	}

	// User's Avatar Function
	if (message.content === (prefix + "myAvatar")) {
		message.channel.sendMessage(message.author.avatarURL);
	}

	// Username change Function
	if (message.content.startsWith (prefix + "setName")) {
		let args = message.content.split(" ");
		bot.user.setUsername(args[1]);
		setTimeout(function() {
			message.channel.sendMessage("Username set!");
		}, 2000);
	}

	// Join Vc and play .mp3
	if (message.content ===(prefix + "vc")){
		channel = message.member.voiceChannel;
		channel.join()
		.then(connection => {
		console.log('Connected!');
		return connection.playFile('song.mp3');
	})
		.catch(console.error);
	}
})

// Catches errors
bot.on('error', e => { console.error(e); });
// Sets Token
bot.login("MjUyOTUzMTYxMDI1NzE2MjI1.Cztkvw.z0ypnOJyzVlqMW_4eRRqk09fjpc");