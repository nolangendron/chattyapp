import React, { Component } from "react";

class Navbar extends Component {
  render() {
    let users;
    if (this.props.clients > 1) {
      users = `${this.props.clients} Users Connected`;
    } else {
      users = `${this.props.clients} User Connected`;
    }
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          Chatty
        </a>
        <a className="navbar-brand clients">{users}</a>
      </nav>
    );
  }
}

export default Navbar;
