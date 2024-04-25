import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";
import Instructions from "./Instructions";
import { AppContext } from "../App";
export default function Layout() {
  const { state } = React.useContext(AppContext);
  const location = useLocation();
  const layoutElement = () => {
    if (state) {
      return (
        <>
          <Header />
          <Navigation />
          {location.pathname === "/" && <Instructions />}
          <Outlet />
        </>
      );
    } else {
      return (
        <>
          <h1> Welcome to SimpliMed, you need to login, click here</h1>
          <NavLink to="/login">Login</NavLink>
        </>
      );
    }
  };
  return layoutElement();
}
