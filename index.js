const express = require("express");
const app = express();
const fs = require("fs");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
  const range = req.headers.range

  if(!range){
      res.status(400).send("range is not founded!")
  }
  
  const videoPath = "./movies/Eternals.2021 @english_movies_with_subtitle.mkv"
  const videoSize = fs.statSync(
    videoPath
  ).size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);

});

const port = 8000;
app.listen(port, () => {
  console.log("Server working on port", port);
});
