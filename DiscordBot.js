"use strict";
let Discord = require('discord.js');
var moment = require('moment');
class DiscordBot {
    constructor (token) {
        this.connect(token);
        console.log('Booting up bot...');
        this.commands = require('./scripts')(this).commands;
    }
    connect(token) {
        this.client = new Discord.Client({autoReconnect: true});
        this.client.login(token);
        this.addListeners();
    }
    addListeners() {
        this.client.on('error', message => console.log(message));
        this.client.on('ready',()  => {
            console.log('Bot connected');
        });
        this.client.on('message', message => this.checkMessage(message));
    }
    checkMessage(message) {
        if(message.author.username === "pmll-bot") return;
        this.checkCommands(message);
        this.checkNonCommands(message);
    }
    checkCommands(msg) {
        var from = msg.author.username;
        var message = msg.content;
        if (msg.mentions.users.exists('username', 'pmll-bot') || contains('!', message)) {
            var found = false;
            for(var i in this.commands) {
                if(contains(this.commands[i].commands, message) && this.commands[i].isCommand) {
                    found = true;
                    if(this.commands[i].private) {
                        msg.author.dmChannel.sendMessage(this.commands[i].rtn(from,message));
                    } else {
                        msg.reply(this.commands[i].rtn(from,message));
                    }
                    break;
                }
            }
            if(!found && contains(['pmllbot'], message)) msg.reply('Yo, ' + from + ', what\'s up?');
        }
    }
    checkNonCommands(msg) {
        var from = msg.author.username;
        var message = msg.content;
        for (var i in this.commands) {
            if(!this.commands[i].isCommand) {
                if(contains(this.commands[i].commands, message)) {
                    if(this.commands[i].private) {
                        msg.author.dmChannel.sendMessage(this.commands[i].rtn(from,message));
                    } else {
                        msg.channel.sendMessage(this.commands[i].rtn(from,message));
                    }
                    break;
                }
            }
        }
    }




}

function contains(cont, stri) {
        stri = stri.toLowerCase();
        if(typeof cont == "string") {
            return stri.indexOf(cont.toLowerCase()) !== -1;
        }
        if(cont[0] == "regex") {
            return stri.search(cont[1]) !== -1;
        }
        for(var i = 0; i < cont.length; i++) {
            if (stri.indexOf(cont[i].toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    }

module.exports = DiscordBot;