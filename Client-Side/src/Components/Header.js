import React from "react";
import "./header.css";
import {
  BoxArrowRight,
  DoorClosed,
  DoorClosedFill,
} from "react-bootstrap-icons";
import { AppContext } from "../App";
import { NavLink } from "react-router-dom";
export default function Header() {
  const { state, handleLogoutChange } = React.useContext(AppContext);
  console.log(state, "state in header is");
  return (
    <div id="header" className="hiddenn header">
      <div className="d-flex flex-row justify-content-between">
        <span id="header-username" className="tooltip_1">
          {state.username}
          <span className="usernameTooltipText">Prolific Username</span>
        </span>
        <NavLink to="/Login" onClick={handleLogoutChange}>
          <span className="logoutIcon-container tooltip_1" id="logoutBtn">
            {/* <DoorClosedFill size="2rem" color="white" /> */}
            <BoxArrowRight size="1.8rem" color="rgb(255, 69, 69)" />
            <span className=" logoutTooltipText ">Logout</span>
          </span>
        </NavLink>
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
