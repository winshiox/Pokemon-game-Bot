const YT = require('../../lib/YT');
const yts = require('yt-search');

module.exports = {
    name: 'play',
    aliases: ['ply','Play'],
    category: 'media',
    exp: 5,
    cool: 4,
    react: "🎧",
    usage: 'Use :ytaudio <song_link>',
    description: 'Downloads given YouTube Video and sends it as Audio',
    async execute(client, arg, M) {
        try {
            const link = async (term) => {
                const { videos } = await yts(term.trim());
                if (!videos || !videos.length) return null;
                return videos[0].url;
            };

            if (!arg) return M.reply('Please use this command with a valid YouTube link');

            const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
            const term = validPathDomains.test(arg) ? arg.trim() : await link(arg);
            if (!term) return M.reply('Please use this command with a valid YouTube content link');

            if (!YT.validateURL(term.trim())) return M.reply('Please use this command with a valid YouTube link');

            const { videoDetails } = await YT.getInfo(term);

            M.reply('Downloading has started, please wait...');

            let text = `*Title:* ${videoDetails.title} | *Type:* Audio | *From:* ${videoDetails.ownerChannelName}`;

            // Sending thumbnail and video details
            client.sendMessage(
                M.from,
                {
                    image: {
                        url: `https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`
                    },
                    caption: text
                },
                {
                    quoted: M
                }
            );

            // Checking if the video is longer than 30 minutes
            if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download audio longer than 30 minutes');

            // Downloading and sending the audio
            const audioBuffer = await YT.getBuffer(term, 'audio');
            await client.sendMessage(
                M.from,
                {
                    audio: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${videoDetails.title}.mp3`
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while downloading the YouTube video audio.');
        }
    }
};
