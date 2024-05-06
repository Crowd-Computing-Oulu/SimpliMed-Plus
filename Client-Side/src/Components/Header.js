import React from "react";
import "./header.css";
import { BoxArrowRight } from "react-bootstrap-icons";
import { AppContext } from "../App";
import { NavLink } from "react-router-dom";
export default function Header() {
  const { handleLogoutChange } = React.useContext(AppContext);
  return (
    <div id="header" className="header-container">
      <div className="d-flex flex-row justify-content-between">
        <span className="header-logo">SimpliMed</span>
        {/* FOR THE USER STUDY - TO SHOW THE USER NAME  */}
        {/* <span className="tooltip_1 header-username">
          {state.username}
          <span className="usernameTooltipText">Prolific Username</span>
        </span> */}
        <NavLink to="/Login" onClick={handleLogoutChange}>
          <span className="logoutIcon-container tooltip_1" id="logoutBtn">
            <BoxArrowRight size="1.8rem" color="rgb(255, 69, 69)" />
            <span className="logoutTooltipText">Logout</span>
          </span>
        </NavLink>
      </div>

      {/* BELOW IS FOR THE USER STUDY - TO SHOW THE REMAINING DAILY TASKS FOR FEEDBACKS  */}
      {/* {state.remainingFeedbacks === 0 && (
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
      )} */}
    </div>
  );
}
