/*global chrome */
import React, { useContext } from "react";
import "./header.css";
import { DoorClosed } from "react-bootstrap-icons";
import { AppContext } from "../App";
export default function Header() {
  // const state = useContext(AppContext);
  // console.log(state, "state in header is");
  const context = React.useContext(AppContext);
  const state = context.state;
  const handleLogout = context.handleLogoutChange;

  return (
    <div id="header" className="hiddenn header">
      <div className="d-flex flex-row justify-content-between">
        <span id="header-username" className="tooltipUsername">
          {state.username}
          <span className="tooltipUsernameText">Prolific Username</span>
        </span>
        <span
          onClick={handleLogout}
          className="logoutIcon-container tooltip"
          id="logoutBtn"
        >
          <i className="bi bi-box-arrow-right"></i>
          <DoorClosed size="1.4rem" color="white" />
          <span className="tooltipText">Logout</span>
        </span>
      </div>

      {state.remainingFeedbacks === 0 && (
        <span className="d-block" id="remainingFeedbacks">
          No Remaining Feedbacks
        </span>
      )}
      {state.remainingFeedbacks === 1 && (
        <span className="d-block" id="remainingFeedbacks">
          {state.remainingFeedbacks} Remaining Feedback{" "}
        </span>
      )}
      {state.remainingFeedbacks > 1 && (
        <span className="d-block" id="remainingFeedbacks">
          {state.remainingFeedbacks} Remaining Feedbacks{" "}
        </span>
      )}
    </div>
  );
}
