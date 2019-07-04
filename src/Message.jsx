import React, { Component } from "react";

class Message extends Component {
  render() {
    const userColor = { color: this.props.userColor };
    return (
      <div className="message list-group-item">
        <span className="message-username" style={userColor}>
          {this.props.username}
        </span>
        <span className="message-content">{this.props.message}</span>
      </div>
    );
  }
}

export default Message;
