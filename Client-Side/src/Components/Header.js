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
        <NavLink to="/Login" onClick={handleLogoutChange}>
          <span className="logoutIcon-container tooltip_1" id="logoutBtn">
            <BoxArrowRight size="1.8rem" color="rgb(255, 69, 69)" />
            <span className="logoutTooltipText">Logout</span>
          </span>
        </NavLink>
      </div>
    </div>
  );
}
