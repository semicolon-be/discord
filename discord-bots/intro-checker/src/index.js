require('dotenv').config()

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.login(process.env.DISCORDJS_BOT_TOKEN)

client.on('ready', () => {
    console.log('running')
})

client.on('messageCreate', async (message) => {
    handleIntroMessage(message)
})


async function handleIntroMessage(message) {
    if (message.channel.id != '977092731178455040') {
        return
    }

    const validate = /name:\s[\w\s]+(\r\n|\r|\n)year:\s\d{4}/gm

    if (message.content.match(validate)) {
        console.log('correct format')
        console.log(message.channel)
        client.channels.get('977092731178455040').overwritePermissions(message.author, { SEND_MESSAGES: false })
        return
    }
    message.delete()
    
    // console.log(message.content)
}