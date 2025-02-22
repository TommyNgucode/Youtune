const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

const OUTPUT_DIR = path.join(__dirname, "downloads");

// Ensure the downloads directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

app.post("/convert", async (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
        console.log("Starting conversion...");

        // Extract video ID or sanitize video title
        const urlObj = new URL(videoUrl);
        let videoId = "";
        
        if (urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.substring(1); // Extracts ID from "https://youtu.be/VIDEO_ID"
        } else {
            videoId = urlObj.searchParams.get("v"); // Extracts ID from "https://www.youtube.com/watch?v=VIDEO_ID"
        }
        
        if (!videoId) {
            return res.status(400).json({ error: "Invalid YouTube URL" });
        }
        
        const title = videoId.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize to ensure safe file names
                const outputFile = path.join(OUTPUT_DIR, `${title}.mp3`);

        // Make sure the path to ffmpeg is correct
        const ffmpegLocation = "C:\\Users\\matto\\OneDrive\\Desktop\\ffmpeg\\ffmpeg-2025-02-20-git-bc1a3bfd2c-full_build\\bin"; // Correct path

        // Construct yt-dlp command
        const command = `yt-dlp -x --audio-format mp3 --ffmpeg-location "${ffmpegLocation}" -o "${outputFile}" ${videoUrl}`;

        // Execute yt-dlp to start the conversion
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                console.error(`stderr: ${stderr}`); // Log stderr for additional info
                return res.status(500).json({ error: "Conversion failed" });
            }

            console.log(stdout);  // Log output for debugging

            res.json({
                success: true,
                downloadLink: `http://localhost:5000/download/${path.basename(outputFile)}`
            });
        });

    } catch (error) {
        console.error("Error during conversion:", error);
        res.status(500).json({ error: "Conversion failed" });
    }
});

// Serve the download link
app.use("/download", express.static(OUTPUT_DIR));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
