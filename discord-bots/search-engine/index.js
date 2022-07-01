require('dotenv').config()
const puppeteer = require('puppeteer')

const { Client, Intents } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


client.on('ready', () => {
    console.log('running')
})

client.on('messageCreate', async (message) => {


    if (!message.content.includes('?') && message.content.includes('How') && message.content.includes('how')) {
        console.log('not a question')
        return
    }

    let query = message.content.replace(' ', '%20')
    

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`https://www.codegrepper.com/search.php?q=${query}`)
    try {
        await page.waitForSelector('.commando_code_block', { timeout: 1000 })
    }
    catch {
        await browser.close()
        return
    }
    
    
    const html = await page.evaluate(() => {
        const parentCodeBlock = document.getElementsByClassName('commando_code_block')[0]
        const language = parentCodeBlock.classList['1'].substring(parentCodeBlock.classList['1'].indexOf('-') + 1)
        return [parentCodeBlock.textContent, language]
    })
    
    const language = html[1]
    const responseMessage = html[0]
    const reply = `\`\`\`${language}\n${responseMessage}\`\`\``
    
    await browser.close()
    
    try {
        message.channel.send(reply)
    }
    catch {
        return
    }
    
    console.log('---------------')
    console.log(message.author.username + ': ' +  message.content + '\n')
    console.log(responseMessage)
    console.log('---------------')
    
})

client.login(process.env.DISCORDJS_BOT_TOKEN)