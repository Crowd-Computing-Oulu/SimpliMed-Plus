import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";
import Instructions from "./Instructions";

export default function Layout({ state, handleLogout }) {
  const location = useLocation();
  return (
    <>
      <Header state={state} handleLogout={handleLogout} />
      <Navigation />
      {location.pathname === "/" && <Instructions />}
      <Outlet />
    </>
  );
}
