/*global chrome */
import React from "react";
import "./header.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
import { DoorClosed } from "react-bootstrap-icons";
export default function Header({ state }) {
  console.log(state, "state in header is");
  function getAbstract() {
    console.log("Get abstract has been clicked");
  }
  function logout() {
    // onStateChange();
    console.log("will send this message for logout");
    chrome.runtime.sendMessage(
      { action: "logoutRequest" }
      // function (response) {
      //   console.log("this is the response in Header", response);
      // }
    );
  }

  return (
    <div id="header" className="hiddenn header">
      <div>
        <button
          id="getAbstract "
          className=" hiddenn button "
          onClick={getAbstract}
        >
          Get Abstract
        </button>
        <span id="remainingFeedbacks"></span>
      </div>

      <div className="flex-row">
        <span id="header-username" className="tooltipUsername">
          {state.username}
          <span className="tooltipUsernameText">Prolific Username</span>
        </span>
        <span
          onClick={logout}
          className="logoutIcon-container tooltip"
          id="logoutBtn"
        >
          <i className="bi bi-box-arrow-right"></i>
          <DoorClosed size="1.4rem" color="white" />
          {/* <i className="fas fa-sign-out-alt"></i> */}
          <span className="tooltipText">Logout</span>
        </span>
      </div>
    </div>
  );
}
