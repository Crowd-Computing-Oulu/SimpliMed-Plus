/*global chrome*/

import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Loading from "./Components/Loading";
import Login from "./Components/Login";
import Instructions from "./Components/Instructions";
import Abstracts from "./Components/Abstracts";
import AiAgent from "./Components/AiAgent";

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
  return { originalText: originalText, originalTitle: originalTitle };
}

function App() {
  const [username, setUsername] = React.useState(null);

  const [accessToken, setAccessToken] = React.useState(null);
  const [state, setState] = React.useState(null);
  // console.log(state);
  const [currentTab, setCurrentTab] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);

  chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    sendResponse
  ) {
    if (message.action === "updateState") {
      console.log("state will be updated in the front");
      console.log("state:", message.state);
      setState((prevState) => ({
        ...prevState,
        username: message.state.username,
        accessToken: message.state.accessToken,
      }));
      // if (!message.state.accessToken) {
      //   setAccessToken(null);
      // }
      // console.log(state);
    }
  });

  React.useEffect(() => {
    // Sending the username to the service worker if there is any
    if (username !== null) {
      chrome.runtime.sendMessage(
        { action: "loginRequest", username }
        // (response) => {
        //   console.log("I am the response", response.response);
        // }
      );
      // console.log("I am the username insde the app component", username);
    }
  }, [username]);

  // callback function to receive the username from Login component
  function handleLoginChange(submittedUsername) {
    console.log("the username should be updated here");
    setUsername(submittedUsername);
  }

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
        setAbstract(abstractInfo);
        // Send a message to background script to get tab information and HTML content
        // chrome.runtime.sendMessage({ action: "currentTab", currentTab });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTabData();
  }, []);
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

  return (
    <div className="App">
      {state && state.accessToken ? (
        <>
          <Header state={state} />
          <AiAgent />
        </>
      ) : (
        <Login onStateChange={handleLoginChange} />
      )}

      {/* <Instructions /> */}
      {/* {abstract && <Abstracts abstract={abstract}  />} */}

      {/* <Abstracts abstract={abstract} /> */}

      {/* <Loading /> */}

      {/* <h1 className="app-blue">RReady to build the SimpliMed plus</h1> */}
    </div>
  );
}

export default App;
