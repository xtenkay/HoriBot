var Discord = require("discord.js");
var bot = new Discord.Client();

bot.on('ready', () => {
	console.log('I am ready!');
});

let prefix = "!";
var response = {
	"ping" : "pong!",
	"help" : "The current commands are:\n\n**!ping** - Pong!\n\n**!bestgirl** - You know who that is!\n\n**!setavatar** - Sets the bot's avatar.\n\n**!myavatar** - Shows your avatar's URL\n\n**!setname** - Changes the bot's username.\n\n**!mention** - Mentions an user\n\n**!vc** - Joins VC and plays something\n\n**!prune** - Prunes chat messages.",
	"bestgirl" : "Its me!",
	
};

bot.on('message', (message) => {

	var content = message.content.substr(1);
	let args = message.content.split(" ");
	
	if (!message.content.startsWith(prefix) || (message.author.id != 110836228391211008 )) return;
	if (content in response) {
		message.channel.sendMessage(response[content]);
}
	//Set Avatar
	if (message.content.startsWith(prefix + "setAvatar")){
		bot.user.setAvatar(args[1]);
		setTimeout(function(){
			console.log('New avatar set!');
			message.channel.sendMessage("Avatar set!");
		}, 2000);
	}

	// User's Avatar Function
	if (message.content === (prefix + "myavatar")) {
		message.channel.sendMessage(message.author.avatarURL);
	}

	// Username change Function
	if (message.content.startsWith (prefix + "setname")) {
		bot.user.setUsername(args[1]);
		setTimeout(function() {
			message.channel.sendMessage("Username set!");
		}, 2000);
	}

	// Mentions an user
	if (message.content.startsWith (prefix + "mention")) {
		if (args.length == 3){
			mentionedUser = bot.users.find('username', args[1]+" "+args[2]);
			message.channel.sendMessage(mentionedUser);
		}
		if (args.length == 4){
			mentionedUser = bot.users.find('username', args[1]+" "+args[2]+" "+args[3]);
			message.channel.sendMessage(mentionedUser);
		}
		else {
			mentionedUser = bot.users.find('username', args[1]);
			message.channel.sendMessage(mentionedUser);
		}
	}

	// Prunes messages
	if(message.content.startsWith(prefix+"prune")) {
		let messagecount = parseInt(args[1]);
		message.channel.fetchMessages({limit: 100})
		message.channel.bulkDelete(messagecount + 1);
	}

	// Joins Vc and plays .mp3
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