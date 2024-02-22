import React from "react";
import "./header.css";
export default function Header() {
  return (
    <div id="header" className="hiddenn">
      <div>
        <button id="getAbstract" classNameName="btn hidden">
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
