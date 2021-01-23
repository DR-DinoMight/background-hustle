
const Discord = require('discord.js');
const Playlist = require('./music/playlist.json');
const {
	prefix,
	token,
} = require('./config.json');

const client = new Discord.Client();

var connection, controlChannel, currentQueue;

client.login(token);


client.once('ready', async () => {
console.log('Ready!');
    let channels = client.channels.cache.filter(o => o.name === 'Background Hustle' );
    let voiceChannel = await client.channels.fetch(channels.firstKey());
    currentQueue = [...Playlist];
    connection = await voiceChannel.join();

});
client.once('reconnecting', () => {
console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});


client.on('message', async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;
    if (message.channel.name !== 'background-hustle') return;

    if (message.content.startsWith(`${prefix}start`)) {
        console.log("starting sound!");
        play(message, Playlist);
    }

    if (message.content.startsWith(`${prefix}skip`)) {
        skip(message);
    }
})

function skip(message) {
    currentQueue.shift();
    play(message, currentQueue);
}

function play(message, queue) {
    console.log(currentQueue);
    if (currentQueue.length > 0){
        message.channel.send(`Now Play: ${currentQueue[0].name}`)
        connection.play(currentQueue[0].track).on("finish", () => {
            console.log("finished");
            currentQueue.shift();
            return play(message,currentQueue);
        });
    }
    else{
        currentQueue = [...Playlist];
        return play(message);
    }
}

