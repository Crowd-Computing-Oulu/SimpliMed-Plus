/*global chrome */
import React from "react";
import "./header.css";
import { DoorClosed } from "react-bootstrap-icons";
export default function Header({ state, handleLogout }) {
  console.log(state, "state in header is");
  function getAbstract() {
    console.log("Get abstract has been clicked");
  }
  function logout() {
    // onStateChange();
    console.log("will send this message for logout");
    chrome.runtime.sendMessage({ action: "logoutRequest" }, (response) => {
      console.log(response);
    });
  }

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
          {/* <i className="fas fa-sign-out-alt"></i> */}
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
