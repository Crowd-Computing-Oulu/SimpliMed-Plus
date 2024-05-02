import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import Header from "./Header";
import Instructions from "./Instructions";
import { AppContext } from "../App";
import "./layout.css";
import homeBG from "../../public/images/Home-Background2.png";
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
          <div className="home-section p-3 ">
            <h1>Welcome to SimpliMed!</h1>
            <div className="home-description mt-3">
              <p className="">
                It seems like you are not logged in, Please provide your OpenAi
                Token!
                <span> The token will be saved on your own computer!</span>
              </p>
            </div>
            <img alt="heart and books" src={homeBG} />
            <NavLink to="/login">
              <button
                className="btn fw-bold mt-3 "
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--tertiary-color)",
                }}
              >
                Go To Login Page
              </button>
            </NavLink>
          </div>
        </>
      );
    }
  };
  return layoutElement();
}
