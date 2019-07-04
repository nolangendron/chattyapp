const express = require("express");
const SocketServer = require("ws").Server;
const WebSocket = require("ws");
const uuidV4 = require("uuid/v4");

const PORT = 3001;
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server });

function randomColorToUser() {
  const hexadecinalDigits = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexadecinalDigits[Math.floor(Math.random() * 16)];
  }
  return color;
}

function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function notifyChatOfUserStatus(num, clientStatus) {
  const clientsConnected = {
    id: uuidV4(),
    type: "usersConnectedCount",
    usersConnected: num,
    content: `A user ${clientStatus} this Chat.`
  };
  broadcast(clientsConnected);
}

wss.on("connection", ws => {
  console.log("Client connected");

  ws.userColor = randomColorToUser();

  notifyChatOfUserStatus(wss.clients.size, "joined");

  ws.on("message", message => {
    const incomingMessage = JSON.parse(message).message;
    let returnMessage = "";
    switch (incomingMessage.type) {
      case "postNotification":
        returnMessage = {
          id: uuidV4(),
          type: "incomingNotification",
          content: `${
            incomingMessage.previousUsername
          } changed their username to ${incomingMessage.newUsername}`
        };
        broadcast(returnMessage);
        break;
      case "postMessage":
        returnMessage = {
          id: uuidV4(),
          type: "incomingMessage",
          username: incomingMessage.username,
          userColor: ws.userColor,
          content: incomingMessage.content
        };
        broadcast(returnMessage);
        break;
      // default:
      //   throw new Error(`Unknown event type: ${incomingMessage.type}`);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
    console.log("Client disconnected");
    notifyChatOfUserStatus(wss.clients.size, "left");
  });
});
