import React, { Component } from "react";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

const data = {
  currentUser: { name: "Annoymous" },
  messages: []
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = data;
    this.webSocket = new WebSocket("ws://localhost:3001");
    this.sendMessageToServer = this.sendMessageToServer.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  sendMessageToServer = message => {
    this.webSocket.send(JSON.stringify(message));
    console.log("message sent to server");
  };

  handleNewMessage = message => {
    if (this.state.currentUser.name !== message.username) {
      const newNotification = {
        type: "postNotification",
        content: `${this.state.currentUser.name} changed their username to ${
          message.username
        }`
      };
      this.state.currentUser.name = message.username;
      this.sendMessageToServer({ message: newNotification });
    }
    const newMessage = {
      type: "postMessage",
      username: message.username,
      content: message.content
    };
    this.sendMessageToServer({ message: newMessage });
  };

  componentDidMount() {
    this.webSocket.onopen = () => {
      console.log("Connected to server");
    };
    this.webSocket.onmessage = event => {
      let serverMessage = JSON.parse(event.data);
      let serverMessages = [];
      if (Number.isInteger(serverMessage.clientCounter)) {
        this.state.clientsConnected = serverMessage.clientCounter;
      }
      switch (serverMessage.message.type) {
        case "incomingMessage":
          serverMessages.push(serverMessage.message);
          break;
        case "incomingNotification":
          serverMessages.push(serverMessage.message);
          break;
        default:
          throw new Error("Unknown event type " + serverMessage.message.type);
      }
      this.setState({ messages: this.state.messages.concat(serverMessages) });
    };
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            Chatty
          </a>
          {this.state.clientsConnected ? (
            <a className="navbar-brand clients">
              {" "}
              {this.state.clientsConnected} Clients Connected
            </a>
          ) : (
            <a className="navbar-brand clients"> 0 Clients Connected</a>
          )}
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar
          handleNewMessage={this.handleNewMessage}
          currentUser={this.state.currentUser}
        />
      </div>
    );
  }
}
export default App;
