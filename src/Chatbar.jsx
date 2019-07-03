import React, { Component } from "react";

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = { username: props.currentUser.name, content: "" };
    this.handleNewContent = this.handleNewContent.bind(this);
    this.handleSubmitContent = this.handleSubmitContent.bind(this);
    this.handleNewUsername = this.handleNewUsername.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
  }

  handleNewUsername = event => {
    this.setState({ username: event.target.value });
  };

  handleSubmitUsername = event => {
    if (event.key === "Enter") {
      this.props.currentUser(this.state);
      this.setState({ username: event.target.value });
    }
  };

  handleNewContent = event => {
    this.setState({ content: event.target.value });
  };

  handleSubmitContent = event => {
    if (event.key === "Enter") {
      this.props.handleNewMessage(this.state);
      this.setState({ content: "" });
    }
  };

  render() {
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          type="text"
          value={this.state.username}
          onChange={this.handleNewUsername}
          onKeyUp={this.handleSubmitUsername}
          placeholder="Your Name (Optional)"
        />
        <input
          className="chatbar-message"
          type="text"
          value={this.state.content}
          onChange={this.handleNewContent}
          onKeyUp={this.handleSubmitContent}
          placeholder="Type a message and hit ENTER"
        />
      </footer>
    );
  }
}
export default ChatBar;
