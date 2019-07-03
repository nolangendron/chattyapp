// server.js

const express = require("express");
const SocketServer = require("ws").Server;
const WebSocket = require("ws");
const uuidV4 = require("uuid/v4");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
const clientsConnected = { clientCounter: 0 };

wss.on("connection", ws => {
  console.log("Client connected");

  if (ws) {
    clientsConnected.clientCounter++;
  }

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
  wss.broadcast(clientsConnected);

  ws.on("message", message => {
    let incomingMessage = JSON.parse(message);
    switch (incomingMessage.message.type) {
      case "postNotification":
        incomingMessage.message.type = "incomingNotification";
        incomingMessage.message["id"] = uuidV4();
        wss.broadcast(incomingMessage);
        break;
      case "postMessage":
        incomingMessage.message.type = "incomingMessage";
        incomingMessage.message["id"] = uuidV4();
        wss.broadcast(incomingMessage);
        break;
      default:
        throw new Error(`Unknown event type: ${incomingMessage.message.type}`);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
    console.log("Client disconnected");
    clientsConnected.clientCounter--;
    wss.broadcast(clientsConnected);
  });
});
