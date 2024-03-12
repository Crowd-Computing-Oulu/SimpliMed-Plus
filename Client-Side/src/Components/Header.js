/*global chrome */
import React from "react";
import "./header.css";
import { DoorClosed } from "react-bootstrap-icons";
import { AppContext } from "../App";
export default function Header() {
  const { state, handleLogoutChange } = React.useContext(AppContext);
  console.log(state, "state in header is");
  return (
    <div id="header" className="hiddenn header">
      <div className="d-flex flex-row justify-content-between">
        <span id="header-username" className="tooltipUsername">
          {state.username}
          <span className="tooltipUsernameText">Prolific Username</span>
        </span>
        <span
          onClick={handleLogoutChange}
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
