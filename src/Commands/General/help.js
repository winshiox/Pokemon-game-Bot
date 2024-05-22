const fs = require('fs'); 
const now = new Date();
const hour = now.getHours();
let greeting;
if (hour >= 06 && hour < 12) {
  greeting = "Good Morning 🌅";
} else if (hour >= 12 && hour < 14) {
  greeting = "Good Afternoon 🏜️";
} else if (hour >= 14 && hour < 15) {
  greeting = "Good Evening 🌌";
} else if (hour >= 15 && hour < 22) {
  greeting = "Good Night 🌃";
} else if (hour >= 22 && hour < 24) {
  greeting = "Sleeping Time 😴💤";
} else if (hour >= 24 && hour < 06) {
  greeting = "Go and Sleep dude";
}

module.exports = {
  name: 'help',
  aliases: ['h', 'menu', 'list'],
  category: 'general',
  exp: 10,
  cool: 5,
  react: "🌩️",
  usage: 'Use -help for helplist or -help <command_name> to get command info',
  description: 'Displays the command list or specific command info',
  async execute(client, arg, M) {
    try {
      const user = await client.DB.get(`data`);
        const m = M.sender;
        // If user is not in data, push the user
        if (!m.includes(user)) {
            await client.DB.push(`data`, m);
        }
      
      if (!arg) {
        let pushName = M.pushName.trim();
        if (pushName.split(' ').length === 1) {
          pushName = `${pushName} san`;
        }

        const categories = client.cmd.reduce((obj, cmd) => {
          const category = cmd.category || 'Uncategorized';
          obj[category] = obj[category] || [];
          obj[category].push(cmd.name);
          return obj;
        }, {});

        const commandList = Object.keys(categories);

        let commands = '';

        for (const category of commandList) {
          commands += `*𓊈𒆜 ${client.utils.capitalize(category, true)} 𒆜𓊉* \n\`\`\`${categories[category].join(', ')}\`\`\`\n\n`;
        }

        let message = `┌───────────┈ ⳹
│「 Hi 👋 」
└┬❖ 「 𝕭𝖚𝖓𝖓𝖞 𝕾𝖊𝖓𝖕𝖆𝖎 」
┌┤✑  Am I Forget Senpai!! 𖠌
││✑  𝕸𝖆𝖎 𝕾𝖆𝖐𝖚𝖗𝖆𝖏𝖎𝖒𝖆 !!
│└───────────────┈ ⳹
│ 「 *${greeting}* 」
│✙ 「 ${client.prefix}Help 」
└┬──────────────┈ ⳹
   │✑ ꜱᴀʏ.ꜱᴄᴏᴛᴄʜ 𑜱
   └──────────────────┈ ⳹\n${commands}`;
        message +=`✨🕯️· ┈──── ·॥ॐ॥· ────┈ ·🕯️✨`;
        
        await client.sendMessage(
          M.from,
          {
            video:fs.readFileSync('./assets/Mai_Sakutamaji.mp4'),gifPlayback:true,
            caption: message
          },
          {
            quoted: M
          }
        );
        return;
      }

      const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg));

      if (!command) return M.reply('Command not found');

      const message = `🔸 *Name:* ${command.name}\n♓ *Aliases:* ${command.aliases.join(', ')}\n🌐 *Category:* ${command.category}\n⚜️ *Exp:* ${command.exp}\n🌀 *Cool:* ${command.cool}\n☣️ *Usage:* ${command.usage}\n🔰 *Desc:* ${command.description}`;

      M.reply(message);
    } catch (err) {
      await client.sendMessage(M.from, { image: { url: `${client.utils.errorChan()}` }, caption: `${client.utils.greetings()} Mai Sakurajima Dis\n\nError:\n${err}` });
    }
  }
};
            
