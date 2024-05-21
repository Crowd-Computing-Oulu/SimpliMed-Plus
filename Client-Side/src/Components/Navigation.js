import React from "react";
import { NavLink } from "react-router-dom";
import { JournalMedical, ChatDots, InfoCircle } from "react-bootstrap-icons";
export default function Navigation() {
  const styles = {
    nav: {
      padding: "0.5rem",

      // borderBottom: "3px solid #c9c9c9",
      // height: "4rem",
      boxShadow: "rgb(168, 80, 119) 1px 2px 1px",
    },
    navLink: {
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "bold",
      fontFamily: "var(--primary-font)",
      color: "var(--primary-color)",
    },
    active: {
      textDecoration: "none",
      fontSize: "1rem",
      color: "var(--quaternary-color)",
      fontFamily: "var(--primary-font)",
      fontWeight: "bolder",
    },
  };

  return (
    <>
      <nav
        style={styles.nav}
        className="d-flex flex-row align-items-center justify-content-around mt-2"
        width="100%"
      >
        <NavLink
          to="/chat"
          style={({ isActive }) => (isActive ? styles.active : styles.navLink)}
        >
          <div className="d-flex align-items-center flex-column">
            <ChatDots size="1.8rem" />
            <div className="">Chat</div>
          </div>
        </NavLink>
        <NavLink
          to="/abstracts"
          style={({ isActive }) => (isActive ? styles.active : styles.navLink)}
        >
          <div className="d-flex align-items-center flex-column">
            <JournalMedical size="1.8rem" />
            <div>Abstracts</div>
          </div>
        </NavLink>
        <NavLink
          to="help"
          style={({ isActive }) => (isActive ? styles.active : styles.navLink)}
        >
          <div className="d-flex align-items-center flex-column">
            <InfoCircle size="1.8rem" />
            <div className="">Help</div>
          </div>
        </NavLink>
      </nav>
    </>
  );
}
