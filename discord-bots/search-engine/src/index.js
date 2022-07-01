require('dotenv').config()
const https = require('https')
const axios = require('axios')

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

  
const agent = new https.Agent({
    rejectUnauthorized: false
})

client.on('ready', () => {
    console.log('running')
})

client.on('messageCreate', async (message) => {


    if (!message.content.includes('?') && message.content.includes('How') && message.content.includes('how')) {
        console.log('not a question')
        return
    }

    if (message.channel.parent.id != '977480052381995038' || message.author.bot) {
        return
    }

    // console.log(message.channel)


    // let query = message.content.replace(' ', '%20')
    const query = encodeURIComponent(message.content)
    const queryWithLang = encodeURIComponent(message.content + message.channel.name)
    
    let data
    try {
        const response = await axios.get(`https://www.codegrepper.com/api/search.php?q=${queryWithLang}&search_options=search_titles`, { httpsAgent: agent })
        data = response.data.answers[0]
    } catch { return }
    if (!data) {
        try {
            const response = await axios.get(`https://www.codegrepper.com/api/search.php?q=${query}&search_options=search_titles`, { httpsAgent: agent })
            data = response.data.answers[0]
        } catch { return }
    }
    
    
    const language = data?.language || 'whatever'
    const responseMessage = data.answer
    const reply = `\`\`\`${language}\n${responseMessage}\`\`\``
    
    
    try {
        message.channel.send(reply)
    }
    catch { return }
    
    console.log('---------------')
    console.log(message.author.username + ': ' +  message.content + '\n')
    console.log(responseMessage)
    console.log('---------------')
    
})

client.login(process.env.DISCORDJS_BOT_TOKEN)