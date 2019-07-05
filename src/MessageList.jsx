import React, { Component } from "react";
import Notification from "./Notifications.jsx";
import Message from "./Message.jsx";

class MessageList extends Component {
  render() {
    return (
      <main className="messages list-group">
        {this.props.messages.map(message => {
          if (
            message.type === "incomingNotification" ||
            message.type === "usersConnectedCount"
          ) {
            return <Notification key={message.id} content={message.content} />;
          } else {
            return (
              <Message
                key={message.id}
                username={message.username}
                userColor={message.userColor}
                message={message.content}
              />
            );
          }
        })}
      </main>
    );
  }
}

export default MessageList;
