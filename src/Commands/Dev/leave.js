module.exports = {
    name: 'leave',
    aliases: ['l'],
    category: 'dev',
    exp: 0,
    cool: 4,
    react: "✅",
    description: 'Leave the current group',
    async execute(client, arg, M) {
        const commandName = this.name || this.aliases[0];
        const disabledCommands = await client.DB.get(`disabledCommands`);
        const isDisabled = disabledCommands && disabledCommands.some(disabledCmd => disabledCmd.name === commandName);
        
        if (isDisabled) {
            const disabledCommand = disabledCommands.find(cmd => cmd.name === commandName);
            return M.reply(`This command is disabled for the reason: *${disabledCommand.reason}*`);
        } 
        try {
            client.groupLeave(M.from)
                .then(() => M.reply('✅ Successfully left the group!'))
                .catch(() => M.reply('🚫 Something went wrong while leaving the group.'));
        } catch (err) {
            console.error(err);
            await client.sendMessage(M.from, {
                image: { url: `${client.utils.errorChan()}` },
                caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`
            });
        }
    }
};
