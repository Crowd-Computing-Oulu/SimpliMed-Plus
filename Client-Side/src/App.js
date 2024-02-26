/*global chrome*/
// import logo from './logo.svg';
import React from "react";
import "./App.css";
import Header from "./Components/Header";
import Loading from "./Components/Loading";
import Login from "./Components/Login";
import Instructions from "./Components/Instructions";
import Abstracts from "./Components/Abstracts";
import AiAgent from "./Components/AiAgent";

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
  console.log(originalTitle, originalText);
  return { originalText: originalText, originalTitle: originalTitle };
}
function App() {
  const [username, setUsername] = React.useState("");
  const [currentTab, setCurrentTab] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);

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
        console.log(currentTab);
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

  // Login

  return (
    <div className="App">
      <Header />
      <Login onStateChange={handleLoginChange} />
      {/* <Instructions /> */}
      {/* {abstract && <Abstracts abstract={abstract} />} */}
      <AiAgent />

      {/* <Abstracts abstract={abstract} /> */}

      {/* <Loading /> */}

      {/* <h1 className="app-blue">RReady to build the SimpliMed plus</h1> */}
    </div>
  );
}

export default App;
