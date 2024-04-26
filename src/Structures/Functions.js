const axios = require('axios').default
const { tmpdir } = require('os')
const { promisify } = require('util')
const moment = require('moment-timezone')
const FormData = require('form-data')
const { load } = require('cheerio')
const { exec } = require('child_process')
const { createCanvas ,loadImage } = require('canvas')
const { sizeFormatter } = require('human-readable')
const { readFile, unlink, writeFile } = require('fs-extra')
const { removeBackgroundFromImageBase64 } = require('remove.bg')
const cheerio = require("cheerio");
const baseUrl = 'https://www.myinstants.com';
const searchUrl = 'https://www.myinstants.com/search/?name=';

/**
 * Draws a Hangman image based on the number of mistakes.
 * @param {number} mistakes - The number of mistakes (from 1 to 6).
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the generated image.
 */
const drawHangMan = async (mistakes) => {
    // Define canvas size and context
    const canvasSize = 400;
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#ffffff'; // White background
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw Hangman pole and rope
    ctx.strokeStyle = '#000000'; // Black color for lines
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvasSize / 2, 0); // Top of the canvas
    ctx.lineTo(canvasSize / 2, canvasSize); // Bottom of the canvas
    ctx.stroke();
    ctx.moveTo(canvasSize / 2, 20); // Attach rope at top
    ctx.lineTo(canvasSize / 2, 80); // Rope length
    ctx.stroke();

    // Draw Hangman based on number of mistakes
    if (mistakes >= 1) {
        // Draw head
        ctx.beginPath();
        ctx.arc(canvasSize / 2, 120, 40, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (mistakes >= 2) {
        // Draw body
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, 160);
        ctx.lineTo(canvasSize / 2, 280);
        ctx.stroke();
    }
    if (mistakes >= 3) {
        // Draw left arm
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, 180);
        ctx.lineTo(canvasSize / 2 - 50, 240);
        ctx.stroke();
    }
    if (mistakes >= 4) {
        // Draw right arm
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, 180);
        ctx.lineTo(canvasSize / 2 + 50, 240);
        ctx.stroke();
    }
    if (mistakes >= 5) {
        // Draw left leg
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, 280);
        ctx.lineTo(canvasSize / 2 - 40, 360);
        ctx.stroke();
    }
    if (mistakes >= 6) {
        // Draw right leg
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, 280);
        ctx.lineTo(canvasSize / 2 + 40, 360);
        ctx.stroke();
    }

    // Return image as buffer
    return canvas.toBuffer();
};





/**
 * Draws a Tic Tac Toe (TTT) board with white background and colored grid lines.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the generated image.
 */
const drawTTTBoard = () => {
    const canvasSize = 300;
    const cellSize = canvasSize / 3;

    // Create canvas
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid lines
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;

    // Horizontal lines
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvasSize, i * cellSize);
        ctx.stroke();
    }

    // Vertical lines
    for (let j = 1; j < 3; j++) {
        ctx.beginPath();
        ctx.moveTo(j * cellSize, 0);
        ctx.lineTo(j * cellSize, canvasSize);
        ctx.stroke();
    }

    return canvas.toBuffer();
};


  /**
 * Formats the URL for an instant sound effect on Myinstants.com.
 * @param {string} url - The URL to format.
 * @returns {string} A formatted URL for the instant sound effect.
 */

  const getFormattedUrl = (url) => {
    return baseUrl.concat(url.split("'")[1]);
  };


/**
 * Searches for an instant sound effect on Myinstants.com.
 * @param {string} term - The search term to use for the query.
 * @returns {Promise<string|null>} A Promise that resolves to a formatted URL if the search is successful, or null if no results are found.
 */

const search = async (term) => {
    const html = await fetch(`${searchUrl}${encodeURI(term)}`);
    const $ = cheerio.load(html);
    const resultDiv = $('#instants_container');
    const attrs = resultDiv.find($('.instant')).first().find($('.small-button')).first().attr();
    if (!attrs) {
      return null;
    }
    return getFormattedUrl(attrs.onclick);
  };


/**
 * @param {string} url
 * @returns {Promise<Buffer>}
 */

const getBuffer = async (url) =>
    (
        await axios.get(url, {
            responseType: 'arraybuffer'
        })
    ).data

/**
 * @param {string} content
 * @param {boolean} all
 * @returns {string}
 */

const capitalize = (content, all = false) => {
    if (!all) return `${content.charAt(0).toUpperCase()}${content.slice(1)}`
    return `${content
        .split('')
        .map((text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`)
        .join('')}`
}

/**
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  

/**
 * @param {Buffer} input
 * @returns {Promise<Buffer>}
 */

/**
 * Generates an image of a credit card with the given card name and expiry date.
 * @param {string} cardName - The name on the credit card.
 * @param {string} expiryDate - The expiry date of the credit card.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the generated image.
 */
const generateCreditCardImage = async (cardName, expiryDate) => {
    const canvas = createCanvas(800, 500);
    const ctx = canvas.getContext('2d');
  
    // Draw card background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw card number box
    ctx.fillStyle = '#eee';
    ctx.fillRect(60, 190, 680, 110);
  
    // Draw card number text
    ctx.fillStyle = '#000';
    ctx.font = '42px Arial, sans-serif';
    const cardNumber = '1234 5678 9012 3456';
    const cardNumberWidth = ctx.measureText(cardNumber).width;
    ctx.fillText(cardNumber, (canvas.width - cardNumberWidth) / 2, 250);
  
    // Draw card name box
    ctx.fillStyle = '#eee';
    ctx.fillRect(60, 320, 340, 70);
  
    // Draw card name text
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial, sans-serif';
    const cardNameLabel = 'Card Holder';
    const cardNameLabelWidth = ctx.measureText(cardNameLabel).width;
    ctx.fillText(cardNameLabel, 80, 360);
    ctx.font = '24px Arial, sans-serif';
    const cardNameWidth = ctx.measureText(cardName.toUpperCase()).width;
    ctx.fillText(cardName.toUpperCase(), 80 + cardNameLabelWidth + 10, 360);
  
    // Draw card expiration date box
    ctx.fillStyle = '#eee';
    ctx.fillRect(430, 320, 200, 70);
  
    // Draw card expiration date text
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial, sans-serif';
    const expDateLabel = 'Expires';
    const expDateLabelWidth = ctx.measureText(expDateLabel).width;
    ctx.fillText(expDateLabel, 450, 360);
    ctx.font = '24px Arial, sans-serif';
    const expDateWidth = ctx.measureText(expiryDate).width;
    ctx.fillText(expiryDate, 450 + expDateLabelWidth + 10, 360);
  
    // Draw card logo
    const cardLogo = await loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png');
    ctx.drawImage(cardLogo, canvas.width - 120, canvas.height - 80, 80, 50);
  
    // Add noise to make it look more realistic
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
  
    return canvas.toBuffer();
  };
  

const greetings = () => {
    const now = new Date();
const hour = now.getHours();
let greetmsg = "";

if (hour >= 0 && hour < 12) {
    greetmsg = "🌅 Ohayou gozaimasu"; //good morning
} else if (hour >= 12 && hour < 18) {
    greetmsg = "🌞 Konnichiwa"; //good afternoon
} else {
    greetmsg = "🌇 Konbanwa"; //good evening
}
return greetmsg
}

const errorChan = () => {
    let chan = "https://telegra.ph/file/88c239a70a4b74b0e62f8.jpg"
    return chan
}

/**
 * @returns {string}
 */

const generateRandomHex = () => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

/**
 * @param {string} content
 * @returns {number[]}
 */

const extractNumbers = (content) => {
    const search = content.match(/(-\d+|\d+)/g)
    if (search !== null) return search.map((string) => parseInt(string)) || []
    return []
}

/**
 * @param {string} url
 */

const extractUrls = (content) => linkify.find(content).map((url) => url.value)

const fetch = async (url) => (await axios.get(url)).data

/**
 * @param {Buffer} webp
 * @returns {Promise<Buffer>}
 */

const webpToPng = async (webp) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.webp`, webp)
    await execute(`dwebp "${filename}.webp" -o "${filename}.png"`)
    const buffer = await readFile(`${filename}.png`)
    Promise.all([unlink(`${filename}.png`), unlink(`${filename}.webp`)])
    return buffer
}

/**
 * @param {Buffer} webp
 * @returns {Promise<Buffer>}
 */

const webpToMp4 = async (webp) => {
    const responseFile = async (form, buffer = '') => {
        return axios.post(buffer ? `https://ezgif.com/webp-to-mp4/${buffer}` : 'https://ezgif.com/webp-to-mp4', form, {
            headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }
        })
    }
    return new Promise(async (resolve, reject) => {
        const form = new FormData()
        form.append('new-image-url', '')
        form.append('new-image', webp, { filename: 'blob' })
        responseFile(form)
            .then(({ data }) => {
                const datafrom = new FormData()
                const $ = load(data)
                const file = $('input[name="file"]').attr('value')
                datafrom.append('file', file)
                datafrom.append('convert', 'Convert WebP to MP4!')
                responseFile(datafrom, file)
                    .then(async ({ data }) => {
                        const $ = load(data)
                        const result = await getBuffer(
                            `https:${$('div#output > p.outfile > video > source').attr('src')}`
                        )
                        resolve(result)
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}

/**
 * @param {Buffer} gif
 * @param {boolean} write
 * @returns {Promise<Buffer | string>}
 */

const gifToMp4 = async (gif, write = false) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.gif`, gif)
    await execute(
        `ffmpeg -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
    )
    if (write) return `${filename}.mp4`
    const buffer = await readFile(`${filename}.mp4`)
    Promise.all([unlink(`${filename}.gif`), unlink(`${filename}.mp4`)])
    return buffer
}

const execute = promisify(exec)

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)]

const calculatePing = (timestamp, now) => (now - timestamp) / 1000

const formatSize = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: '2',
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
})

const term = (param) =>
    new Promise((resolve, reject) => {
        console.log('Run terminal =>', param)
        exec(param, (error, stdout, stderr) => {
            if (error) {
                console.log(error.message)
                resolve(error.message)
            }
            if (stderr) {
                console.log(stderr)
                resolve(stderr)
            }
            console.log(stdout)
            resolve(stdout)
        })
    })

const restart = () => {
    exec('pm2 start src/aurora.js', (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    })
}
const convertMs = (ms, to = 'seconds') => {
    let seconds = parseInt(
        Math.floor(ms / 1000)
            .toString()
            .split('.')[0]
    )
    let minutes = parseInt(
        Math.floor(seconds / 60)
            .toString()
            .split('.')[0]
    )
    let hours = parseInt(
        Math.floor(minutes / 60)
            .toString()
            .split('.')[0]
    )
    let days = parseInt(
        Math.floor(hours / 24)
            .toString()
            .split('.')[0]
    )
    if (to === 'seconds') return seconds
    if (to === 'minutes') return minutes
    if (to === 'hours') return hours
    if (to === 'days') return days
    seconds = parseInt((seconds % 60).toString().split('.')[0])
    minutes = parseInt((minutes % 60).toString().split('.')[0])
    hours = parseInt((hours % 24).toString().split('.')[0])
    return {
        days,
        seconds,
        minutes,
        hours
    }
}

/**
 * Converts a GIF to PNG, with the first appearance of the GIF as an image.
 * @param {Buffer} gif - The GIF buffer to convert.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the generated PNG.
 */
const gifToPng = async (gif) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`;
    await writeFile(`${filename}.gif`, gif);
    await execute(`ffmpeg -i "${filename}.gif" -vframes 1 "${filename}.png"`);
    const buffer = await readFile(`${filename}.png`);
    await Promise.all([unlink(`${filename}.gif`), unlink(`${filename}.png`)]);
    return buffer;
};

 
module.exports = {
    drawHangMan,
    drawTTTBoard,
    calculatePing,
    capitalize,
    execute,
    extractNumbers,
    fetch,
    formatSize,
    generateCreditCardImage,
    generateRandomHex,
    getBuffer,
    errorChan,
    getRandomItem,
    gifToMp4,
    restart,
    term,
    webpToMp4,
    webpToPng,
    greetings,
    getRandomInt,
    getFormattedUrl,
    search,
    convertMs,
    extractUrls,
    gifToPng
}
