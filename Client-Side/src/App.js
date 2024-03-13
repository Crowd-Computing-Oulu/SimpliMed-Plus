/*global chrome*/

import React from "react";
import {
  createMemoryRouter,
  BrowserRouter,
  RouterProvider,
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Loading from "./Components/Loading";
import Login from "./Components/Login";
import Instructions from "./Components/Instructions";
import Abstracts from "./Components/Abstracts";
import AiAgent from "./Components/AiAgent";
import GetSummary from "./Components/GetSummary";
import "bootstrap/dist/css/bootstrap-grid.min.css"; // Only import the grid system to avoid losing icons
import { getTabInformation, updateState } from "./utils";
import Navigation from "./Components/Navigation";
import Error from "./Components/Error";
import Test1 from "./Components/Test1";
import Test2 from "./Components/Test2";
import Layout from "./Components/Layout";
import Main from "./Components/Main";

import { Memory } from "react-bootstrap-icons";
// var port = chrome.runtime.connect({ name: "popupConnection" });
export const AppContext = React.createContext();
function App() {
  const [username, setUsername] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);

  // Send a message each time the sidepanel opens
  React.useEffect(() => {
    chrome.runtime.sendMessage({ action: "firstOpen" }, (response) => {
      console.log("state upon open is", response.state);
      if (response.response === "TokenExist") {
        updateState(setState, response.state);
      }
    });
  }, []);

  // get the tab new information when tab is switched

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(async function (
      message,
      sender,
      sendResponse
    ) {
      if (message.action === "Tab Switched") {
        console.log("tab is swtiched and this is the new url,", message.url);
        const abstractInfo = await getTabInformation(message.url);
        setAbstract(abstractInfo);
      }
      if (message.action === "URL Changed") {
        console.log("tab is swtiched and this is the new url,", message.url);
        const abstractInfo = await getTabInformation(message.url);
        setAbstract(abstractInfo);
      }
    });
  }, []);

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message.action === "updateState") {
        console.log("state will be update for the ");
        console.log(message.state);
        updateState(setState, message.state);
        // setState((prevState) => ({
        //   ...prevState,
        //   ...message.state,
        // }));
      }
    });
  }, []);

  // This function will only run if username changes(if we enter a username)
  React.useEffect(() => {
    async function sendMessage() {
      if (username !== null) {
        chrome.runtime.sendMessage(
          { action: "loginRequest", username },
          async function (response) {
            // This will update the state after the login was successfull
            // response state contains the token and the username here
            updateState(setState, response.state);
          }
        );
      }
    }

    sendMessage(); // Call the async function to send the message
  }, [username]);

  // callback function to receive the username from Login component
  function handleLoginChange(submittedUsername) {
    setUsername(submittedUsername);
  }
  function handleLogoutChange() {
    console.log("user has logged out");
    // Deleting the state upon logout
    setState(null);
    chrome.runtime.sendMessage({ action: "logoutRequest" });
  }

  React.useEffect(() => {
    console.log("new abstract", abstract);
  }, [abstract]);

  React.useEffect(() => {
    const fetchTabData = async () => {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const currentTab = tabs[0];
        // send url to the function and get url, originaltitle and originalabstract
        const abstractInfo = await getTabInformation(currentTab.url);
        setAbstract(abstractInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTabData();
    // console.log(abstract);
  }, []);

  // React Router Dom

  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Navigation />,
        children: [
          { path: "getsummary", element: <GetSummary /> },
          { path: "aiagent", element: <AiAgent /> },
        ],
      },
    ],
    {
      initialEntries: ["/", "/navigation"], // The initial URLs in the history stack
      initialIndex: 0, // The initial location's index in the history stack
    }
  );
  return (
    <div className="App">
      <AppContext.Provider
        value={{
          state,
          setState,
          handleLoginChange,
          handleLogoutChange,
          abstract,
        }}
      >
        <MemoryRouter>
          <Routes>
            <Route
              path="/"
              errorElement={<Error />}
              // element={!state && <Login />}

              element={state && <Layout />}
            >
              <Route
                path="/aiagent"
                errorElement={<Error />}
                element={<AiAgent />}
              />
              <Route
                path="/Login"
                errorElement={<Error />}
                element={<Login />}
              />
              <Route path="/main" errorElement={<Error />} element={<Main />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
