const { Sticker } = require('wa-sticker-formatter');

module.exports = {
    name: 'gamble',
    aliases: ['gb'],
    category: 'economy',
    exp: 5,
    cool: 8,
    react: "✅",
    usage: 'Use :gamble <amount> <direction>',
    description: 'Gambles your credits to decrease and increase',
    async execute(client, arg, M) {
        
        const directions = ['right', 'left'];
        const [amount, direction] = arg.split(' ');
        if (!amount || !directions.includes(direction)) return M.reply('Please provide a valid amount and direction.');
        if (!(/^\d+$/).test(amount)) return M.reply('Please provide a valid amount.');
        
        const credits = (await client.credit.get(`${M.sender}.wallet`)) || 0;
        if ((credits - amount) < 0) return M.reply('You don\'t have that much in your wallet.');
        if (amount > 20000) return M.reply('You cannot gamble more than 20000.');

        const result = Math.random() < 0.5 ? 'left' : 'right';
        await client.credit.add(`${M.sender}.wallet`, result === direction ? amount : -amount);
        M.reply(result === direction ? `🎉 You won ${amount} credits` : `🥀 You lost ${amount} credits`);

        const stickerUrl = result === 'right'
            ? 'https://i.ibb.co/SrtvnFH/ezgif-com-rotate.gif'
            : 'https://raw.githubusercontent.com/Dkhitman3/Hitman47/master/assets/gifs/left.gif';
        
        const sticker = new Sticker(stickerUrl, {
            pack: 'Aurora',
            author: 'By Aurora',
            quality: 90,
            type: 'full',
            background: '#0000ffff'
        });

        await client.sendMessage(M.from, { sticker: await sticker.build() }, { quoted: M });
    }
};
