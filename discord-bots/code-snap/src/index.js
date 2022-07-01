require('dotenv').config()
const puppeteer = require('puppeteer')

const { Client, Intents, MessageAttachment } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


client.on('ready', () => {
    console.log('running')
})

client.on('messageCreate', async (message) => {
    
    const command = message.content.substring(0, 5)
    if (command != ';snap') { return }
    
    message.channel.sendTyping()
    const channelId = message.channel.id
    const channel = client.channels.cache.get(channelId)

    const messages = await channel.messages.fetch({ limit: 10 })
    let codeMsg = ''
    let endLoop = false
    messages.every((msg) => {
        if (endLoop) {
            codeMsg = msg
            return false
        }
        if (msg.content == message.content) {
            endLoop = true
        }
        return true
    })
    
    message.delete()
    const codeExpression = /\`{3}\w+(\r\n|\r|\n)((.+|(\r\n|\r|\n)+)+)\`{3}/gm
    let codeBlock = codeMsg.content.match(codeExpression)?.[0]
    if (!codeBlock) { 
        console.log('no valid argument')
        message.channel.send("Previous message isn't a valid code block")
        return 
    }
    codeBlock = codeBlock
    .replace(/^(\`{3})/, '')
    .replace(/((\r\n|\r|\n)?\`{3}(\r\n|\r|\n)?)$/, '')
    .replace(/^(.+(\r\n|\r|\n))/, '')
    
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`https://carbon.now.sh/?code=%2520`)
    try {
        await page.waitForSelector('[aria-label="Code editor"]', { timeout: 5000 })
    }
    catch {
        return
    }
    
    try {
        await page.focus('[aria-label="Code editor"]')
        await page.keyboard.type(codeBlock)
        const container = await page.$('.export-container')
        await container.screenshot({ path: 'src/code.png' })
    } 
    catch (e){
        console.log(e)
        return
    }

    
    await browser.close()
    
    try {
        const image = new MessageAttachment('src/code.png')
        message.channel.send({ files: [image] })
    }
    catch {
        return
    }
    
    return
    
})

client.login(process.env.DISCORDJS_BOT_TOKEN)