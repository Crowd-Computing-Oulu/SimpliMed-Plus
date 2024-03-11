import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";
import Instructions from "./Instructions";
import { AppContext } from "../App";

export default function Layout() {
  const context = React.useContext(AppContext);
  const state = context.state;

  const location = useLocation();
  return (
    <>
      <p>test is {state.username}</p>
      <Header />
      <Navigation />
      {location.pathname === "/" && <Instructions />}
      <Outlet />
    </>
  );
}
