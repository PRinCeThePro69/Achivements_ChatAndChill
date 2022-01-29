require("dotenv").config()
const {MessageEmbed} = require("discord.js")
const discord = require("discord.js")

const client = new discord.Client({
    intents: 32767
})

const redis = require('quickredis-db')
const db = redis.createClient(process.env.redis)
db.once("ready", () => {
    console.log("Connected to Redis!")
})
client.on("ready", () => {
    console.log("Connected to Discord!")
})

let servid = client.guilds.cache.get('930503731974385694');
client.on("guildMemberAdd", m => {
    db.set(`${m.id}_joined`, 'true')
    const user = new MessageEmbed()
    .setTitle("Welcome to Chat And Chill")
    .setDescription("Welcome to Chat And Chill!\nI am the friendly achievement bot that manages achievements for Chat And Chill!\nWow, looks like you already got your first one, impressive!\n**Achievement obtained: Welcome!**\nJoin the server, rarity: common")
    .setColor("PURPLE")

    try {
        m.user.send({
            embeds: [user]
        })
    } catch {
        console.log("Failed to DM" + m.tag)
    }

    const server = new MessageEmbed()
    .setTitle("Achievement obtained!")
    .setDescription(m.user.tag + "Just obtained the achivement: **Welcome**!\nObtained for joining the server, rarity: common")
    .setColor("DARK_PURPLE")
    
    client.channels.cache.get('936678943845654638')
    .send({
        embeds: [server]
    })

    db.add(`${m.id}_achivements`, 1)
})
client.on("guildMemberRemove", async m => {
    db.delete(`${m.id}_joined`)
    db.set(`${m.id}_achivements`, 0)
    const omo = await db.get(`${m.id}_omoSent`)
    if(omo === "true") {
        db.delete(`${m.id}_omoSent`)
    }

    const msgc = await db.get(`${m.id}_messages`)

    if(msgc > 25) {
        db.delete(`${m.id}_25msgs`)
    }
})

//text based achivements and cmd

client.on("messageCreate", async msg => {
    if(msg.channel.id === "930503731974385697") {
        db.add(`${msg.author.id}_messages`, 1)
        const numMsgs = await db.get(`${msg.author.id}_messages`)

        if (numMsgs > 25) {
            const twentyfivemsgsalr = await db.get(`${msg.author.id}_25msgs`)
            if(twentyfivemsgsalr === "true") {
                return;
            } else {
            db.add(`${msg.author.id}_achivements`, 1)
            db.set(`${msg.author.id}_25msgs`, 'true')
            msg.member.roles.add("936929715422371921")
            const servMsg = new MessageEmbed()
            .setTitle("Achievement obtained!")
            .setDescription(msg.author.tag + "Just obtained the achivement: **Kinda active**!\nObtained for sending 25 messages in <#930503731974385697>, rarity: uncommon")
            .setColor("DARK_PURPLE") 
            
            client.channels.cache.get('936678943845654638')
            .send({
                embeds: [servMsg]
            })

            const userMsg = new MessageEmbed()
            .setTitle("Well done!")
            .setDescription("Congratulations, you got another achivement: **Kinda active**!\nObtained for sending 25 messages in <#930503731974385697>, rarity: uncommon")
            .setFooter("GG")
            .setColor("PURPLE")

            try {
                msg.author.send({
                    embeds: [userMsg]
                })
            } catch {
                console.log("Failed to DM" + msg.author.tag)
            }
           }
        }
    }
    if(msg.content === "_count") {
        var u = msg.mentions.users.first()
        if (!u) u = msg.author
        const c = await db.get(`${u.id}_achivements`)
            const e = new MessageEmbed()
            .setTitle("Achivement count")
            .setDescription(u.tag + ` has ${c} achivements!`)
            .setColor("DARK_BLUE")
    
            msg.reply({
                embeds: [e]
            })

    } else {
        if (msg.content.startsWith("_eval")) {
            const args = msg.content.split(" ").slice(1);
            const evalers = ["689173890450194434"]
            if(!evalers.includes(msg.author.id)) return msg.reply("Permission denied!")
            try {
                const evaled = eval(args.join(" "));
                msg.channel.send("Done")
              } catch (err) {
                msg.channel.send("An error occoured" + "\`\`\`\n"+err+"\n\`\`\`" );
              }
        }
    }
})

client.on("messageCreate", msg => {
    if(msg.channel.id === "934082965774925824") {
            db.add(`${msg.author.id}_achivements`, 1)
            db.set(`${msg.author.id}_omoSent`, 'true')

            const servMsg2 = new MessageEmbed()
            .setTitle("Achivement obtained!")
            .setDescription(msg.author.tag + "Just obtained the achivement: **One message**!\nObtained for sending a message in <#934082965774925824>, rarity: common")
            .setColor("DARK_PURPLE")

            client.channels.cache.get('936678943845654638')
            .send({
                embeds: [servMsg2]
            })

            const userMsg2 = new MessageEmbed()
            .setTitle("Well done!")
            .setDescription("Congratulations, you got another achivement: **One message**!\nObtained for sending a message in <#934082965774925824>, rarity: common")
            .setColor("PURPLE")

            try {
                msg.author.send({
                embeds: [userMsg2]
                })
            } catch {
                console.log("Failed to DM " + msg.author.tag)
            }
    }
})
client.login(process.env.token)
