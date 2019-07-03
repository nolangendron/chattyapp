import React, { Component } from "react";
import Message from "./Message.jsx";

class MessageList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main className="messages list-group">
        {this.props.messages.map(message => {
          return (
            <Message
              key={message.id}
              username={message.username}
              message={message.content}
            />
          );
        })}
      </main>
    );
  }
}

export default MessageList;
