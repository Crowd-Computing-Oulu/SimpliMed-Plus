import React from "react";
import { NavLink } from "react-router-dom";
export default function Navigation() {
  const navLinkStyle = {
    textDecoration: "none",
    color: "black",
    fontSize: "1rem",
    fontWeight: "bold",
    fontFamily: "var(--primary-font)",
  };
  const activeStyle = {
    textDecoration: "underline",
    fontSize: "1rem",
    color: "blue",
    fontFamily: "var(--primary-font)",
    fontWeight: "bolder",
  };
  const navStyle = {
    padding: "0.5rem",
    borderBottom: "3px solid #c9c9c9",
  };
  return (
    <>
      <nav
        className="d-flex flex-row align-items-center justify-content-around"
        style={{ ...navStyle, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
        width="100%"
      >
        {/* <NavLink
          to="."
          end
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          tests
        </NavLink> */}
        <NavLink
          to="/chat"
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          Chat
        </NavLink>
        <span
          style={{ borderRight: "3px solid #c9c9c9", height: "3rem" }}
        ></span>
        <NavLink
          to="/abstracts"
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          Abstracts
        </NavLink>
        <NavLink
          to="chat2"
          style={({ isActive }) => (isActive ? activeStyle : navLinkStyle)}
        >
          chat2
        </NavLink>
      </nav>
    </>
  );
}
