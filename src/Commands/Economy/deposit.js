const ms = require('parse-ms');

module.exports = {
    name: 'deposit',
    aliases: ["dt", "depo"],
    category: 'economy',
    exp: 5,
    cool: 4,
    react: "✅",
    description: 'Deposits golds in your bank',
    async execute(client, arg, M) {
        const commandName = this.name.toLowerCase();
        const now = Date.now(); // Get current timestamp
        const cooldownSeconds = this.cool;
        const lastSlot = await client.DB.get(`${M.sender}.${commandName}`);
      
        if (lastSlot !== null && now - lastSlot < cooldownSeconds * 1000) {
            const remainingCooldown = Math.ceil((cooldownSeconds * 1000 - (now - lastSlot)) / 1000);
            return M.reply(`*You have to wait ${remainingCooldown} seconds for another slot*`);
        }
        if (!arg || isNaN(arg)) return M.reply('Please provide a valid amount');
        const amount = parseInt(arg);
        if (amount <= 0) return M.reply('Please provide a positive amount');
        const wallet = (await client.cradit.get(`${M.sender}.wallet`)) || 0;
        if (wallet < amount) return M.reply('You don\'t have enough in your wallet');
        await client.cradit.add(`${M.sender}.bank`, amount);
        await client.cradit.sub(`${M.sender}.wallet`, amount);
        await client.DB.set(`${M.sender}.deposit`, Date.now());
        M.reply(`You have successfully deposited ${amount} in your bank`);
    }
};