/*global chrome*/

import React from "react";
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
// var port = chrome.runtime.connect({ name: "popupConnection" });

// async function getTabInformation(url) {
//   const response = await fetch(url);
//   const text = await response.text();
//   const parser = new DOMParser();
//   // coverting html into a document
//   const doc = parser.parseFromString(text, "text/html");
//   // to add all paraghraphs when we have different p for background, methods,...
//   const paragraphs = doc.querySelectorAll("div.abstract-content p");
//   let allParagraphs = "";
//   for (let i = 0; i < paragraphs.length; i++) {
//     allParagraphs += paragraphs[i].textContent;
//   }
//   var originalText = allParagraphs;
//   var originalTitle = doc
//     .getElementsByClassName("heading-title")[0]
//     .textContent.trim();
//   // console.log(originalTitle, originalText);
//   return {
//     url: url,
//     originalAbstract: originalText,
//     originalTitle: originalTitle,
//   };
// }

function App() {
  const [username, setUsername] = React.useState(null);
  const [state, setState] = React.useState(null);
  // console.log(state);
  // const [currentTab, setCurrentTab] = React.useState(null);
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
        // setCurrentTab(tabs[0]);
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

  // what is the pint of this
  React.useEffect(() => {
    chrome.storage.local.get(["accessToken", "username"], (data) => {
      if (data.accessToken) {
        console.log("storage is", data);
        // This needs to be checked
        updateState(setState, data);

        // setState((prevState) => ({
        //   ...prevState,
        //   username: data.username,
        //   accessToken: data.accessToken,
        // }));
        // setAccessToken(data.accessToken);
      }
    });
  }, []);
  // end of the point

  return (
    <div className="App">
      {state && state.accessToken ? (
        <>
          <Header state={state} handleLogout={handleLogoutChange} />
          {abstract && state && !state.isLoading && (
            <GetSummary setState={setState} tabAbstract={abstract} />
          )}
          {/* <AiAgent /> */}
        </>
      ) : (
        <Login handleLogin={handleLoginChange} />
      )}

      {state && !state.isLoading && !state.abstractData && <Instructions />}
      {state && !state.isLoading && state.abstractData && (
        <Abstracts abstracts={state.abstractData} />
      )}

      {state && state.isLoading ? <Loading /> : ""}

      {/* <h1 className="app-blue">RReady to build the SimpliMed plus</h1> */}
    </div>
  );
}

export default App;
