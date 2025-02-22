const convertBtn = document.getElementById("convert-btn");

convertBtn.addEventListener("click", async function() {
    const youtubeUrl = document.getElementById("youtube-url").value;

    if (!youtubeUrl) {
        alert("Please enter a valid YouTube URL");
        return;
    }

    console.log("YouTube URL entered:", youtubeUrl); // Debugging

    try {
        convertBtn.disabled = true;
        convertBtn.textContent = "Converting...";

        // Make the request to the server
        const response = await fetch("http://localhost:5000/convert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: youtubeUrl })
        });

        console.log("Response status:", response.status); // Debugging

        // Check for unsuccessful response
        if (!response.ok) {
            console.error("Failed to convert, status:", response.status);
            throw new Error("Conversion failed with status: " + response.status);
        }

        const data = await response.json();
        console.log("Response Data:", data); // Debugging

        // Check if the server returned a download link
        if (data.downloadLink) {
            const downloadLink = document.createElement("a");
            downloadLink.href = data.downloadLink;
            downloadLink.download = "converted-audio.mp3";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            console.error("Invalid response format, missing download link.");
            throw new Error("Invalid response format, missing download link.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error converting video: " + error.message);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = "Convert";
    }
});
