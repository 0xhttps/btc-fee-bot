import DiscordJS, { Intents } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const guildId = process.env.GUILD_ID;
const botId = process.env.BTC_FEE_BOT_ID;

client.on('ready', () => {
  console.log('The bot is ready');

  // Set interval to update nickname every 20 seconds
  setInterval(async () => {
    const guild = client.guilds.cache.get(`${guildId}`);
    const fee = await getFee()
    if (guild) {
      const bot = guild.members.cache.get(`${botId}`);

      if (bot) {
        bot.setNickname(`${fee[0]} sat/vB`);
        client.user?.setActivity(`1h✅: ${fee[1]} sat/vB`)
        console.log(`Updated nickname to [${fee[0]} sat/vB]`);
        console.log(`Updated activity to [1h✅: ${fee[1]} sat/vB]`);
      } else {
        console.error('Bot not found in guild');
      }
    } else {
      console.error('Guild not found');
    }
  }, 20000); // 20 seconds in milliseconds
});

const getFee = async () => {
  let block_1: any, block_6: any, block_144: any
  function convertNumber(input: number): number {
      const divisor = Math.pow(10, 3); // 3 numbers after the decimal point
      return input / divisor;
  }
  let response = await fetch('https://bitcoinfees.net/api.json')
  let data:any = await response.json()
  block_1 = convertNumber(data.fee_by_block_target[1])
  block_6 = convertNumber(data.fee_by_block_target[6])
  block_144 = convertNumber(data.fee_by_block_target[144])
  return [block_1, block_6, block_144]
  
}

client.login(process.env.BTC_FEE_BOT_TOKEN);