import React from "react";
import { NavLink } from "react-router-dom";
import { JournalMedical, ChatDots, InfoCircle } from "react-bootstrap-icons";
export default function Navigation() {
  const navLinkStyle = {
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    fontFamily: "var(--primary-font)",
    color: "var(--primary-color)",
  };
  const activeStyle = {
    textDecoration: "underline",
    fontSize: "1rem",
    color: "var(--quaternary-color)",
    fontFamily: "var(--primary-font)",
    fontWeight: "bolder",
  };
  const navStyle = {
    padding: "0.5rem",
    // borderBottom: "3px solid #c9c9c9",
    height: "4rem",
    boxShadow: "rgb(168, 80, 119) 10px 1px 3px",
  };

  return (
    <>
      <nav
        style={navStyle}
        className="d-flex flex-row align-items-center justify-content-around"
        width="100%"
      >
        <NavLink
          to="/chat"
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          <ChatDots size="1.8rem" />
        </NavLink>
        <NavLink
          to="/abstracts"
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          <JournalMedical size="1.8rem" />
        </NavLink>
        <NavLink
          to="help"
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          <InfoCircle size="1.8rem" />
        </NavLink>
      </nav>
    </>
  );
}
