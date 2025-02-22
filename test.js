const ytdl = require("ytdl-core");

async function fetchVideoInfo(url) {
    try {
        console.log('Fetching video info for:', url);
        const info = await ytdl.getInfo(url);
        console.log('Video Info:', info);
    } catch (error) {
        console.error('Error fetching video info:', error);
    }
}

fetchVideoInfo("https://www.youtube.com/watch?v=8flWVqbUBJA");