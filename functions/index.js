const functions = require('firebase-functions');
const Telegraf = require('telegraf');
const axios = require('axios');

let config = require('./env.json');

if (Object.keys(functions.config()).length) {
    config = functions.config();
}

const access_key = config.service.weather_access_key;

const bot = new Telegraf(config.service.telegram_access_key);
bot.start((ctx) => ctx.reply('Welcome!! 😊'));
bot.help((ctx) => ctx.reply('Type and send a city for know the current temperature'));
bot.on('text', (ctx) => {
    let query = ctx.update.message.text;
    const params = { access_key, query };
    
    axios.get('http://api.weatherstack.com/current',  { params })
        .then((current) => {
            return ctx.reply(`The current weather in ${query} is ${current.data.current.temperature} ºC`)
        }).catch((err) => {
            console.log(err);
            return ctx.reply('This city is not exists', err);
        });
});
bot.launch();


