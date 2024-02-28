const axios = require('axios');
const ms = require('parse-ms');

module.exports = {
    name: 'gpt',
    aliases: ['ai'],
    category: 'utils',
    exp: 5,
    react: "✅",
    description: 'Let you chat with GPT chat bot',
    cool: 4, // Add cooldown time in seconds
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        
        const cooldownMs = this.cool * 1000;
        const lastSlot = await client.DB.get(`${M.sender}.gpt`);

        if (lastSlot !== null && cooldownMs - (Date.now() - lastSlot) > 0) {
            const remainingCooldown = ms(cooldownMs - (Date.now() - lastSlot), { long: true });
            return M.reply(`*You have to wait ${remainingCooldown} for another slot*`);
        }

        try {
            // Check if OpenAI API key is provided
            if (!process.env.openAi) {
                return M.reply('You have not provided an OpenAI API key in the config file');
            }
            
            // Define user and context
            const user = "918961331275@s.whatsapp.net";
            const context = arg || '';
            
            // Handle specific questions about the bot's creator
            const creatorQuestions = [
                'who made you', 'who is your creator', 'who is your owner',
                'who wrote your code', 'who write your code', 'name of your create',
                'number of your creator', 'no. of your creator', 'no of your creator',
                'creator', 'owner', 'creator name', 'owner name'
            ];
            if (creatorQuestions.includes(arg.toLowerCase())) {
                return await client.sendMessage(
                    M.from,
                    { text: `@${user.split("@")[0]} is my owner`, mentions: [user] },
                    { quoted: M }
                );
            }

            // Define default response URL
            const defaultResponseUrl = "https://preview.redd.it/chatgpt-chan-anime-girl-v0-8v59tdhy7hfa1.png?auto=webp&s=bc4e156e0a89ccbfaaac239c78e99e5aef9c5767";

            // Handle specific greetings
            const greetings = ['hey', 'hey, how are you', 'hey how are you', 'hey how are you gpt', 'hey gpt', 'hey, how are you gpt'];
            if (greetings.includes(arg.toLowerCase())) {
                return await client.sendMessage(
                    M.from,
                    { image: { url: defaultResponseUrl }, caption: `Hey! ${(await client.contact.getContact(M.sender, client)).username} how can I help you today.` },
                    { quoted: M }
                );
            }

            // Send context to GPT for response
            const response = await client.gpt.chat(context);
            const text = `Q. ${context}\n\nA. ${response.response.trim().replace(/\n\n/, '\n')}`;
            await M.reply(text);

            await client.DB.set(`${M.sender}.gpt`, Date.now()); // Update last execution timestamp
        } catch (error) {
            console.error('Error in gpt command:', error);
            await client.sendMessage(
                M.from,
                { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.errText()} Error-Chan Dis\n\nError:\n${error}` }
            );
        }
    }
};