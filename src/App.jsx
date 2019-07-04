import React, { Component } from "react";
import Navbar from "./Navbar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: "Anonymous" },
      messages: [],
      usersConnected: ""
    };
    this.webSocket = new WebSocket("ws://localhost:3001");
    this.sendMessageToServer = this.sendMessageToServer.bind(this);
    this.handleNewMessage = this.handleNewMessage.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  //Sends a new message to server when typed into chatbar
  sendMessageToServer = message => {
    this.webSocket.send(JSON.stringify(message));
    console.log("message sent to server");
  };

  notifyOfUsernameChange = message => {
    const newNotification = {
      type: "postNotification",
      previousUsername: this.state.currentUser.name,
      newUsername: message.username
    };

    this.state.currentUser.name = message.username;
    this.sendMessageToServer({ message: newNotification });
  };

  handleNewMessage = message => {
    if (this.state.currentUser.name !== message.username) {
      this.notifyOfUsernameChange(message);
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
      console.log(serverMessage);
      let serverMessages = this.state.messages;

      switch (serverMessage.type) {
        case "usersConnectedCount":
          serverMessages.push(serverMessage);
          this.setState({
            messages: serverMessages,
            usersConnected: serverMessage.usersConnected
          });
          break;
        case "incomingMessage":
          serverMessages.push(serverMessage);
          this.setState({
            messages: serverMessages
          });
          break;
        case "incomingNotification":
          serverMessages.push(serverMessage);
          this.setState({
            messages: serverMessages
          });
          break;
        default:
          throw new Error("Unknown event type " + serverMessage.type);
      }
    };
  }

  render() {
    return (
      <div>
        <Navbar clients={this.state.usersConnected} />
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
