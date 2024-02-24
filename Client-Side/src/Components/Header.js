import React from "react";
import "./header.css";
export default function Header() {
  function getAbstract() {
    console.log("Get abstract has been clicked");
  }
  return (
    <div id="header" className="hiddenn">
      <div>
        <button id="getAbstract" className="btn hiddenn" onClick={getAbstract}>
          Get Abstract
        </button>
        <span id="remainingFeedbacks"></span>
      </div>

      <div className="flex-row">
        <span id="header-username" className="tooltipUsername">
          Prolific Username
          <span className="tooltipUsernameText">Prolific Username</span>
        </span>
        <span className="logoutIcon-container tooltip" id="logoutBtn">
          <i className="fas fa-sign-out-alt"></i>
          <span className="tooltipText">Logout</span>
        </span>
      </div>
    </div>
  );
}
