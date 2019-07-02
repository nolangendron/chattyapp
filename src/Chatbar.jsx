import React, { Component } from "react";

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = { username: props.currentUser.name };
  }

  render() {
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          type="text"
          value={this.state.username}
          placeholder="Your Name (Optional)"
        />
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
        />
      </footer>
    );
  }
}
export default ChatBar;
