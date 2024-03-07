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

// var port = chrome.runtime.connect({ name: "popupConnection" });

async function getTabInformation(currentTab) {
  const response = await fetch(currentTab.url);
  const text = await response.text();
  const parser = new DOMParser();
  // coverting html into a document
  const doc = parser.parseFromString(text, "text/html");
  // to add all paraghraphs when we have different p for background, methods,...
  const paragraphs = doc.querySelectorAll("div.abstract-content p");
  let allParagraphs = "";
  for (let i = 0; i < paragraphs.length; i++) {
    allParagraphs += paragraphs[i].textContent;
  }
  var originalText = allParagraphs;
  var originalTitle = doc
    .getElementsByClassName("heading-title")[0]
    .textContent.trim();
  // console.log(originalTitle, originalText);
  return {
    url: currentTab.url,
    originalAbstract: originalText,
    originalTitle: originalTitle,
  };
}

function App() {
  const [username, setUsername] = React.useState(null);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [state, setState] = React.useState(null);
  // console.log(state);
  const [currentTab, setCurrentTab] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ action: "firstOpen" }, (response) => {
      console.log("state upon open is", response.state);
      if (response.response === "TokenExist") {
        setState((prevState) => ({
          ...prevState,
          ...response.state,
        }));
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
        // console.log("state:", message.state);
        setState((prevState) => ({
          ...prevState,
          ...message.state,
        }));
        // console.log(state);
        // if (!message.state.accessToken) {
        //   setAccessToken(null);
        // }
        // console.log(state);
      }
    });
  }, [state]);

  // This function will only run if username changes(if we enter a username)
  React.useEffect(() => {
    async function sendMessage() {
      if (username !== null) {
        console.log("I should only be rendered once");
        chrome.runtime.sendMessage(
          { action: "loginRequest", username },
          async function (response) {
            console.log("I am the response", response.response);
            console.log("I am the state", response.state);
            // This will update the state after the login was successfull
            // response state contains the token and the username here
            setState((prevState) => ({
              ...prevState,
              ...response.state,
            }));
            setIsLoggedIn(true);
          }
        );
      }
    }

    sendMessage(); // Call the async function to send the message
  }, [username]);
  // Sending the username to the service worker if there is any

  // callback function to receive the username from Login component
  function handleLoginChange(submittedUsername) {
    console.log("the username should be updated here");
    setUsername(submittedUsername);
  }
  function handleLogoutChange() {
    console.log("user has logged out");
    // Deleting the state upon logout
    setState(null);
    // Do I need to send anything to background?!
    chrome.runtime.sendMessage({ action: "logoutRequest" });
  }

  React.useEffect(() => {
    console.log("abstract is", abstract);
  }, [abstract]);

  React.useEffect(() => {
    const fetchTabData = async () => {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const currentTab = tabs[0];
        setCurrentTab(currentTab);
        const abstractInfo = await getTabInformation(currentTab);
        console.log(abstractInfo);
        setAbstract(abstractInfo);
        // Send a message to background script to get tab information and HTML content
        // chrome.runtime.sendMessage({ action: "currentTab", currentTab });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTabData();
    console.log(abstract);
  }, []);

  // what is the pint of this
  React.useEffect(() => {
    chrome.storage.local.get(["accessToken", "username"], (data) => {
      if (data.accessToken) {
        console.log("storage is", data);
        setState((prevState) => ({
          ...prevState,
          username: data.username,
          accessToken: data.accessToken,
        }));
        // setAccessToken(data.accessToken);
      }
      // console.log("Access token from storage is", accessToken);
      // You can perform further operations with the accessToken here
    });
  }, []);
  // end of the point
  React.useEffect(() => {
    if (state && state.isLoading) {
      console.log("sate is loading", state.isLoading);
    }
  }, [state]);

  // function updateState(newState) {
  //   setState((prevState) => ({
  //     ...prevState,
  //     ...newState,
  //   }));
  // }

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
      {state && state.abstractData && (
        <Abstracts abstracts={state.abstractData} />
      )}

      {state && state.isLoading ? <Loading /> : ""}

      {/* <h1 className="app-blue">RReady to build the SimpliMed plus</h1> */}
    </div>
  );
}

export default App;
