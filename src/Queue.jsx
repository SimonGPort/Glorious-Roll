import React, { Component } from "react";
import { connect } from "react-redux";
import ConventionQueue from "./ConventionQueue.jsx";
import { withRouter } from "react-router-dom";

class Queue extends Component {
  constructor() {
    super();
  }

  // BanPlayer = require("./BanPlayer.js");

  requestToJoin = async (evt) => {
    if (this.props.login === false) {
      return alert("you need to login");
    }
    let data = new FormData();
    data.append("id", this.props.id);
    data.append("user", this.props.user);
    let response = await fetch("/requestToJoin", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "joinEvent",
        user: this.props.user,
        id: this.props.id,
      });
    } else {
      alert("you can't join this event");
    }
  };

  leaveTheQueue = async (evt) => {
    let data = new FormData();
    data.append("id", this.props.id);
    data.append("user", this.props.user);
    let response = await fetch("/leaveTheQueue", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "leaveEvent",
        user: this.props.user,
        id: this.props.id,
      });
    } else {
      alert("error, you can't leave this event");
    }
  };

  handleBanPlayer = async (eventId, user) => {
    if (window.confirm("Do you want to ban this player?")) {
      let data = new FormData();
      data.append("eventId", eventId);
      data.append("user", user);
      let response = await fetch("/BanPlayerNormalQueue", {
        method: "POST",
        body: data,
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        console.log("ban success");
        this.props.dispatch({
          type: "BanPlayerNormalQueue",
          eventId: eventId,
          user: user,
        });
      } else {
        console.log("ban fail");
      }
    }
  };

  deleteEvent = async (evt) => {
    if (window.confirm("Do you really want to delete the event?")) {
      this.props.deletingEventMethod(true);
      let data = new FormData();
      data.append("id", this.props.id);
      let response = await fetch("/deleteTheEvent", {
        method: "POST",
        body: data,
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        debugger;
        this.props.history.push("/");
        this.props.dispatch({
          type: "DeleteEvent",
          id: this.props.id,
        });
        this.props.dispatch({
          type: "removeSelectionEvent",
        });
      } else {
        alert("error, you can't delete this event");
      }
      this.props.deletingEventMethod(false);
    }
  };

  render = () => {
    if (this.props.type === "Convention") {
      return (
        <div>
          <ConventionQueue
            eventId={this.props.id}
            host={this.props.host}
            user={this.props.user}
            conventionsGame={this.props.conventionsGame}
          />
        </div>
      );
    }
    return (
      <div>
        <div>
          {this.props.user === this.props.host ? (
            <div className="event-attend-section">
              <button onClick={this.deleteEvent} className="card-enter-event ">
                Delete Event
              </button>
              <div>
                Spots available {parseInt(this.props.players.length) + 1}/
                {parseInt(this.props.numPlayers) + 1}
              </div>
            </div>
          ) : this.props.players.includes(this.props.user) ? (
            <div className="event-attend-section">
              <button
                onClick={this.leaveTheQueue}
                className="card-enter-event "
              >
                Leave
              </button>
              <div>
                Spots available {parseInt(this.props.players.length) + 1}/
                {parseInt(this.props.numPlayers) + 1}
              </div>
            </div>
          ) : (
            <div className="event-attend-section">
              <button
                onClick={this.requestToJoin}
                className="card-enter-event "
              >
                Attend
              </button>
              <div>
                Spots available {parseInt(this.props.players.length) + 1}/
                {parseInt(this.props.numPlayers) + 1}
              </div>
            </div>
          )}
        </div>
        <div>
          <div>Game Master: {this.props.host} </div>
          <div>
            {this.props.players.map((player, idx) => {
              if (idx <= this.props.players.length) {
                return (
                  <div className="Attendees" key={idx}>
                    Attendees: {player}
                    {this.props.user === this.props.host ? (
                      <span className="ban-player-container">
                        <img
                          src="/Images/Ban_Hammer.svg"
                          className="ban-player-button"
                          onClick={() => {
                            this.handleBanPlayer(this.props.id, player);
                          }}
                        />
                        <p class="Ban-message-hovering">Ban this player</p>
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                );
              }
              return (
                <div className="Attendees">
                  On the waiting list: {player}
                  {this.props.user === this.props.host ? (
                    <span className="ban-player-container">
                      <img
                        src="/Images/Ban_Hammer.svg"
                        className="ban-player-button"
                        onClick={() => {
                          this.handleBanPlayer(this.props.id, player);
                        }}
                      />
                      <p class="Ban-message-hovering">Ban this player</p>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}

export default withRouter(connect()(Queue));
