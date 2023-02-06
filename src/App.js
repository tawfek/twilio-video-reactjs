import "./App.scss";
import React, { Component } from "react";
import Room from "./Room";
const { connect } = require("twilio-video");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identity: "",
      room: null,
      room_name:""
    };
    this.inputRef = React.createRef();
    this.roomNameInputRef = React.createRef();
    this.joinRoom = this.joinRoom.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
    this.updateRoomName = this.updateRoomName.bind(this);
    this.updateIdentity = this.updateIdentity.bind(this);
    this.removePlaceholderText = this.removePlaceholderText.bind(this);
    this.removeRoomNamePlaceholderText = this.removeRoomNamePlaceholderText.bind(this);
  }

  async joinRoom() {
    try {
      const response = await fetch(
        `https://0c12-2a09-bac1-37a0-48-00-4a-2c.eu.ngrok.io/teleconsultation/conference/patient/join?identity=${this.state.identity}&room_name=${this.state.room_name}`,
        {  method: 'POST' }
      );
      const data = await response.json();
      console.log(data);
      const room = await connect(data.access_token, {
        name: data.data.uniqueName,
        audio: true,
        video: true,
      });
      console.log(room)
      this.setState({ room: room });
    } catch (err) {
      console.log(err);
    }
  }
  
  returnToLobby() {
    this.setState({ room: null });
  }

  removePlaceholderText() {
    this.inputRef.current.placeholder = "";
  }

  removeRoomNamePlaceholderText() {
    this.roomNameInputRef.current.placeholder = "";
  }
  updateIdentity(event) {
    this.setState({
      identity: event.target.value,
    });
  }

  updateRoomName(event) {
    this.setState({
      room_name: event.target.value,
    });
  }
  render() {
    const disabled = this.state.identity === "" ? true : false;

    return (
      <div className="app">
        {this.state.room === null ? (
          <div className="lobby">
            <input
              value={this.state.room_name}
              onChange={this.updateRoomName}
              ref={this.roomNameInputRef}
              onClick={this.removeRoomNamePlaceholderText}
              placeholder="Room name?"
            /> 
            <br/>
            <input
              value={this.state.identity}
              onChange={this.updateIdentity}
              ref={this.inputRef}
              onClick={this.removePlaceholderText}
              placeholder="What's your name?"
            />
            <button disabled={disabled} onClick={this.joinRoom}>
              Join Room
            </button>
          </div>
        ) : (
          <Room returnToLobby={this.returnToLobby} room={this.state.room} />
        )}
      </div>
    );
  }
}

export default App;
