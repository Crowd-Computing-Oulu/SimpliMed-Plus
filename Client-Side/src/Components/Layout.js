import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";
import Instructions from "./Instructions";
import { AppContext } from "../App";
export default function Layout() {
  const { state } = React.useContext(AppContext);
  const location = useLocation();
  return (
    <>
      {state && <Header />}
      <Navigation />
      {location.pathname === "/" && <Instructions />}
      <Outlet />
    </>
  );
}
