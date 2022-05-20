require('dotenv').config()

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })

client.login(process.env.DISCORDJS_BOT_TOKEN)

client.on('ready', () => {
    console.log('running')
})

client.on('messageCreate', (message) => {
    handleIntroMessage(message)
})

client.on('messageUpdate', (oldMessage, newMessage) => {
    console.log("message updated")
    return
    handleIntroMessage(newMessage)
})


async function handleIntroMessage(message) {
    if (message.channel.id != '977092731178455040') {
        return
    }

    const validate = /name:\s[\w\s]+(\r\n|\r|\n)(year:\s\d{4})?(\r\n|\r|\n)about:\s.{1,50}(\r\n|\r|\n)languages:\s(.{1,10}[,(\r\n|\r|\n)]\s?)+^(portfolio|website):\shttps?:\/\/\w{1,20}\.\w{1,20}\.?(\w{1,20})?\/?.{0,30}/gm

    if (message.content.match(validate)) {
        console.log('correct format')
        console.log(message.channel)
        // client.channels.get('977092731178455040').overwritePermissions(message.author, { SEND_MESSAGES: false })
        return
    }
    message.delete()
    
    // console.log(message.content)
}