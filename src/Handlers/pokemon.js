const cron = require("node-cron")
const axios = require('axios')
const path = require('path')
const { calculatePokeExp } = require('../Helpers/pokeStats')
const { shizobtn1, shizobtn1img, shizobtn1gif } = require('./shizofunc.js')
require("./Message");
module.exports = PokeHandler = async (client, m) => {
  try {
      let wilds = await client.DB.get('wild');
    const wild = wilds || [];

    if (wild.length > 0) {
      const randomIndex = Math.floor(Math.random() * wild.length);
      const randomJid = wild[randomIndex];
      let jid = randomJid;

      if (wild.includes(jid)) {
        cron.schedule('*/20 * * * *', async () => {
          try {
            const id = Math.floor(Math.random() * 1025);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = response.data;

            const name = pokemon.name;
            const types = pokemon.types.map(type => type.type.name);
            const image = pokemon.sprites.other['official-artwork'].front_default;
            const level = Math.floor(Math.random() * (30 - 15) + 15);
            const requiredExp = calculatePokeExp(level);

            const pokemonData = { name: name, level: level, exp: requiredExp }; // Create an object with name, level, and exp
           console.log(`Spawned: ${pokemonData.name} in ${jid}`);
           await client.DB.set(`${jid}.pokemon`, pokemonData);

            const message = `*🧧 ᴀ ɴᴇᴡ ᴘᴏᴋᴇᴍᴏɴ ᴀᴘᴘᴇᴀʀᴇᴅ 🧧*\n\n *💥 Type:* ${types.join(', ')} \n\n *🀄ʟevel:* 「 ${level} 」 \n\n *ᴛʏᴘᴇ ${client.prefix}ᴄᴀᴛᴄʜ < ᴘᴏᴋᴇᴍᴏɴ_ɴᴀᴍᴇ >, to get it in your dex*`;

              return shizobtn1img(client, jid, message, image, ' Catch 🔖', `-catch`, '𒉢 ꜱᴀʏ.ꜱᴄ֟፝ᴏᴛᴄʜ ⚡𐇻')
          } catch (err) {
            console.log(err);
            await client.sendMessage(jid, {
              text: `Error occurred while spawning Pokémon.`
            });
          }      
  
    cron.schedule('*/10 * * * *', async () => {
     await client.DB.delete(`${jid}.pokemon`);
      console.log(`Pokemon deleted after 5minutes`)
  
    })
  
  });
  
  }
    }
    
    } catch(error){
        console.log(error)
    }

              }

      
