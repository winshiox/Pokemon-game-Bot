module.exports = {
    name: 'give',
    aliases: ['pay', 'transfer'],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    usage: 'Use :give <amount> @taguser',
    description: 'Transfer golds to your friend',
    async execute(client, arg, M) {
        if (M.mentions.length === 0) return M.reply('*You must mention someone to send the money*');
        const amount = parseInt(arg.split(' ')[0]);
        if (isNaN(amount)) return M.reply('Please provide a valid amount');
        if (amount <= 0) return M.reply('Please provide a positive amount');
        const credits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if (credits < amount) return M.reply('You don\'t have that much in your wallet');
        await client.credit.add(`${M.mentions[0]}.wallet`, amount);
        await client.credit.sub(`${M.sender}.wallet`, amount);
        client.sendMessage(
            M.from,
            { text: `You gave *${amount}* to *@${M.mentions[0].split('@')[0]}*`, mentions: [M.mentions[0]] },
            { quoted: M }
        );
        let tr = `@${M.sender.split('@')[0]} gave ${amount} to @${M.mentions[0].split('@')[0]}`;
        await client.sendMessage("120363236615391329@g.us", tr);
    }
};
