// chatServer.js
const http = require("http");
const url = require("url");

const PORT = 8080;

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // true => parse query string
  const message = parsedUrl.query.message;

  if (message) {
    console.log(`
        Received message: ${message}`);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Message received!\n");
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Send a message using ?message=your_text\n");
  }
}).listen(PORT, () => {
  console.log(` Chat server running at http://0.0.0.0:${PORT}/`);
});
