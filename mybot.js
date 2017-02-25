var Discord = require("discord.js");
const config = require('./config.json');
const songList = require('./songs.json');
const fs = require("fs")
var bot = new Discord.Client();

bot.on('ready', () => {
	console.log('Ready to work!');
});

var songNumber = Math.floor((Math.random() * config.songAmmount) + 1);
var songArray = [];
var vcConnection;
var dispatcher;
var encorePoints = 0;
var response = {
	"ping" : "pong!",
	"help" : "```\n"+
	"The current commands are:"+
	"\n\n!help - This command!"+
	"\n\n!setavatar - Sets the bot's avatar."+
	"\n\n!setname - Changes the bot's username."+
	"\n\n!myavatar - Shows your avatar's URL"+
	"\n\n!id - Shows the ID of an user. (Yours if you don't specify an user)"+
	"\n\n!prune - Prunes chat messages."+
	"\n\n!prefix - Changes the bot's prefix"+
	"\n\n"+
	"VOICE COMMANDS:"+
	"\n\n!connect - Joins VC and starts playing something"+
	"\n\n!dc - Disconnects from Voice Channel"+
	"\n\n!pause - Pauses the current song"+
	"\n\n!resume - Resumes playing the current song"+
	"\n\n!volume - Changes the volume ( 0-100 )"+
	"\n\n!skip - Skips the current song"+
	"\n\n!encore - Repeats the current song a number of times (1 for once, 2 for twice,etc.)"+
	"\n\n!roleid - Gets a role's ID (Only on console)",

	"bestgirl" : "2B Best Girl!!!! https://i.redd.it/21fcnhub75dy.gif",
};

bot.on('message', (message) => {

	//Splits all parameters
	var content = message.content.substr(config.prefix.length);
	let args = message.content.split(" ");
	
	// Bot doesn't reply if messages don't start with prefix OR if user is not the bot's owner
	if (message.channel.type === "dm") return;
	
	if (!message.content.startsWith(config.prefix)) return;

	if (!message.member.roles.find("name", "City Hall")) return;
	
	// If content is inside response, sends out a message corresponding to command
	if (content in response) {
		message.channel.sendMessage(response[content]);
	}

	//Set Avatar
	if (message.content.startsWith(config.prefix + "setavatar")){
			bot.user.setAvatar(args[1]);
		// Sets avatars and shows confirmation message after 2 seconds
		setTimeout(function(){
			console.log("New avatar has been set!");
			message.channel.sendMessage(":white_check_mark: Operation successful!");
			}, 2000);
		}

	// User's Avatar Function
	// Shows user's avatar URL
	if (message.content === (config.prefix + "myavatar")) {
		message.channel.sendMessage(message.author.avatarURL);
	}

	// Username change Function
	// Changes the bot's username and confirmation message after 2 seconds
	if (message.content.startsWith (config.prefix + "setname")) {
		bot.user.setUsername(args[1]+" "+args[2]);
		setTimeout(function() {
			message.channel.sendMessage("Username set!");
		}, 2000);
	}

	// Mentions an user
	// Mentions an user by using their name
	if (message.content.startsWith (config.prefix + "id")) {
		try{
		if (args.length == 3){
			mentionedUser = bot.users.find('username', args[1]+" "+args[2]);
			message.channel.sendMessage("The ID is : " + mentionedUser.id);
		}
		if (args.length == 4){
			mentionedUser = bot.users.find('username', args[1]+" "+args[2]+" "+args[3]);
			message.channel.sendMessage("The ID is : " + mentionedUser.id);
		}
		if (args.length == 2) {
			mentionedUser = bot.users.find('username', args[1]);
			message.channel.sendMessage("The ID is : " + mentionedUser.id);
		}
		else {
			message.channel.sendMessage("The ID is : "+ message.author.id);
		}
	}catch(e){
			console.log(e);
			message.channel.sendMessage("```\nError!\nPlease try again.\n```");
		}
	}

	// Prunes messages
	// Deletes up to 100 messages at once
	if(message.content.startsWith(config.prefix + "prune")){
		try{
			var msgcount = parseInt(args[1]);
			message.channel.fetchMessages({limit: 100});
			message.channel.bulkDelete(msgcount + 1);
		} catch(err)
			{
			console.log(err);
	}
}

	if(message.content.startsWith(config.prefix + "prefix")){
		config.prefix = args[1];
		console.log(args[1]);
		fs.writeFile('./config.json', JSON.stringify(config), (err) => {if(err) console.error(err)});
	}

	// Joins Vc and plays .mp3

	if (message.content === (config.prefix + "connect")){
		var voiceChannel = message.member.voiceChannel;
		
		if (voiceChannel === undefined){
			console.log("The user "+ message.author.username+ " is not on a Voice Channel!");
			message.channel.sendMessage('```You are not in a Voice Channel!	\nPlease join a Voice Channel to use this command.```');
			
		} 
		else {
		voiceChannel.join()
		.then(connection =>{
			vcConnection = connection;
			console.log("Joining the channel: "+voiceChannel.name);
			
			shuffleSongNumber();
			dispatcher = vcConnection.playFile('C:/Dev/HoriBot/sound/' + getSong() +'.mp3');

			dispatcher.on('end', () => {
				startPlaying();
				});
			});
		}
	}

	

// Disconects from VC

	if (message.content === (config.prefix + "dc")){
		voiceChannel = message.member.voiceChannel;
		if (voiceChannel === undefined){
			console.log("No Voice Channel Detected");
			return;
		} else {
		voiceChannel.leave();
		dispatcher.end();
		console.log("Leaving Voice Channel!");
		}
	}

	if (message.content === (config.prefix + "pause")){
		pausePlaying();
	}

	if (message.content === (config.prefix + "resume")){
		resumePlaying();
	}
	
	if(message.content.startsWith(config.prefix + "volume")){
		volumeSet(args[1]);
	}

	if(message.content.startsWith(config.prefix + "skip")){
		skipSong();
	}

	if(message.content === (config.prefix + "np")){
		nowPlaying();
	}

	if(message.content.startsWith(config.prefix + "encore")){
		addEncorePoints(args[1]);
	}

	if (message.content === (config.prefix + "teste")){
		console.log(message.guild.roles.find("name", "City Hall"));
	}

	if (message.content.startsWith(config.prefix + "roleid")){
		console.log(message.guild.roles.find("name", args[1] ));
	}


// FUNCTIONS ----------------------------------------------------------------------------------------------------------------------------------------------------


	function whatsPlaying(){
		//bot.user.setGame("Teste");
		bot.user.setGame(songList[songNumber]);
	}

	function addEncorePoints(points){
		encorePoints = points;
		message.channel.sendMessage("```I'll repeat this song "+points+" times!```");
	}

	function volumeSet(volume){
		if(volume > 100){
			volume = 100;
			message.channel.sendMessage("```Maximum Volume value is 100\nSetting Volume to maximum ammount!```");
		}
		if (dispatcher === undefined){
			console.log("No Dispatcher!");
			message.channel.sendMessage('```\nERROR\n\nI am not connected to a Voice Channel!\n\nPlease use '+config.prefix+'connect to make me join your Voice Channel!```');		
			return;
		}
		dispatcher.setVolume(volume/50);
		message.channel.sendMessage("```Volume set to: " + volume + "```");
		console.log("Volume set to: " + volume );
	}
	
	function pausePlaying(){
		dispatcher.pause();
		return;
	}

	function resumePlaying(){
		dispatcher.resume();
		return;
	}

	function skipSong(){
		pausePlaying();
		if (encorePoints === 0){
			shuffleSongNumber();
		}
		if (encorePoints > 0){
			encorePoints--;
		}
		setTimeout(function() {
			dispatcher = vcConnection.playFile('C:/Dev/HoriBot/sound/' + getSong() +'.mp3');
		}, 2000);
	}

	function nowPlaying(){
		message.channel.sendMessage("Now Playing: " + "**" + songList[songNumber] + "**");
	}

	function startPlaying(){
		dispatcher = null;
		if (encorePoints === 0){
			shuffleSongNumber();
		}
		var dispatcher =vcConnection.playFile('C:/Dev/HoriBot/sound/' + getSong() +'.mp3');
		if (encorePoints > 0){
			encorePoints--;
		}
		console.log("Current song is: " + songList[songNumber]);
		console.log("Encore points are: "+encorePoints);
		
		dispatcher.on('end', () => {
			startPlaying();
		 });
	}

	function shuffleSongNumber(){
			console.log("----------Function shuffleSongNumber called!----------");
			do {
				songNumber = Math.floor((Math.random() * config.songAmmount) + 1);
			} while (songArray.includes(songNumber));
	}

	function getSong(){
			console.log("----------Function getSong called!----------");
			console.log('Song Number is: '+songNumber);
			console.log('Song Array is: '+songArray);
			console.log('Is it included in the Array? '+songArray.includes(songNumber));
			whatsPlaying();
			if (encorePoints === 0){
				songArray.push(songNumber);
			}
			if(songArray.length > config.arraySize){
				songArray = songArray.slice(1);
			}
			return songList[songNumber];
			
	}
})
// Token AA - Mjg0NDQ1MzA2NzIyOTc1NzQ1.C5Dt2Q.zqpyxY0THkqAC2Rh7Ezn-FSIdd4

// Token RA - Mjg0NzY4ODE4NzU1MjcyNzA0.C5IbJA.8MkBPUB-lt3ylNGGGdt15KgVGew

// Token Teste - MjUyOTUzMTYxMDI1NzE2MjI1.Cztkvw.z0ypnOJyzVlqMW_4eRRqk09fjpc

bot.login(config.token);