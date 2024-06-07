/*global chrome*/

import React from "react";
import {
  createMemoryRouter,
  RouterProvider,
  redirect,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";

import Login, { action as loginAction } from "./Components/Login";
import Chat from "./pages/chats/Chat";
import Help from "./pages/chats/Help";
import { getTabInformation, updateState } from "./utils";
import Error from "./Components/Error";
import Layout from "./Components/Layout";
import Main from "./pages/abstracts/Main";
import { requireAuth } from "./utils";

export const AppContext = React.createContext();
function App() {
  const [panelHeight, setPanelHeight] = React.useState(window.innerHeight);

  const adjustPanelHeight = () => {
    setPanelHeight(window.innerHeight);
  };

  React.useEffect(() => {
    // Set the initial height
    adjustPanelHeight();

    // Adjust the height when the window is resized
    window.addEventListener("resize", adjustPanelHeight);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", adjustPanelHeight);
    };
  }, []);

  const urlStatusOptions = {
    PUBMED_NO_ABSTRACT: "pubmedNoAbstract",
    PUBMED_WITH_ABSTRACT: "pubmedWithAbstract",
    NOT_PUBMED: "notPubmed",
  };
  const [urlStatus, setUrlStatus] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);
  // Send a message each time the sidepanel opens
  React.useEffect(() => {
    new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "firstOpen" }, (response) => {
        if (response.response === "TokenExist") {
          updateState(setState, response.state);
          resolve(redirect("/"));
        } else {
          resolve(redirect("/login"));
        }
      });
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
        if (message.url.indexOf("pubmed.ncbi.nlm.nih.gov") > -1) {
          try {
            const abstractInfo = await getTabInformation(message.url);
            setAbstract(abstractInfo);
            setUrlStatus(urlStatusOptions.PUBMED_WITH_ABSTRACT);
          } catch (error) {
            setUrlStatus(urlStatusOptions.PUBMED_NO_ABSTRACT);
          }
        } else {
          setUrlStatus(urlStatusOptions.NOT_PUBMED);
        }
      }
      if (message.action === "URL Changed") {
        if (message.url.indexOf("pubmed.ncbi.nlm.nih.gov") > -1) {
          try {
            const abstractInfo = await getTabInformation(message.url);
            setAbstract(abstractInfo);
            setUrlStatus(urlStatusOptions.PUBMED_WITH_ABSTRACT);
          } catch (error) {
            setUrlStatus(urlStatusOptions.PUBMED_NO_ABSTRACT);
          }
        } else {
          setUrlStatus(urlStatusOptions.NOT_PUBMED);
        }
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
        updateState(setState, message.state);
      }
    });
    return () => {
      chrome.runtime.onMessage.removeListener();
    };
  }, []);

  function handleLogoutChange() {
    // Deleting the state upon logout
    setState(null);
    chrome.runtime.sendMessage({ action: "logoutRequest" });
  }

  React.useEffect(() => {
    const fetchTabData = async () => {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const currentTab = tabs[0];
        // send url to the function and get url, originaltitle and originalabstract
        if (currentTab.url.indexOf("pubmed.ncbi.nlm.nih.gov") > -1) {
          try {
            const abstractInfo = await getTabInformation(currentTab.url);
            setAbstract(abstractInfo);
            setUrlStatus(urlStatusOptions.PUBMED_WITH_ABSTRACT);
          } catch (error) {
            setUrlStatus(urlStatusOptions.PUBMED_NO_ABSTRACT);
          }
        } else {
          setUrlStatus(urlStatusOptions.NOT_PUBMED);
        }
      } catch (error) {
        console.error("Error fetching the abstract data from the page:", error);
      }
    };
    fetchTabData();
  }, []);

  // React Router Dom
  const router = createMemoryRouter(
    createRoutesFromElements(
      <>
        <Route path="/">
          <Route index element={<Layout />} />
          <Route element={<Layout />}>
            <Route
              path="chat"
              errorElement={<Error />}
              element={<Chat />}
              loader={async () => {
                const authStatus = await requireAuth();
                if (authStatus === "NoToken") {
                  return redirect("/login");
                } else {
                  return null;
                }
              }}
            />
            <Route
              path="help"
              errorElement={<Error />}
              element={<Help />}
              loader={async () => {
                const authStatus = await requireAuth();
                if (authStatus === "NoToken") {
                  return redirect("/login");
                } else {
                  return null;
                }
              }}
            />
            <Route
              path="abstracts"
              errorElement={<Error />}
              element={<Main />}
              loader={async () => {
                const authStatus = await requireAuth();
                if (authStatus === "NoToken") {
                  return redirect("/login");
                } else {
                  return null;
                }
              }}
            />
          </Route>
        </Route>
        <Route
          path="/login"
          errorElement={<Error />}
          element={<Login />}
          action={(obj) => loginAction(obj, setState)}
        />
      </>
    ),
    {
      // The first path is /
      initialEntries: ["/"],
      initialIndex: 0,
    }
  );
  return (
    <div className="App" style={{ height: `${panelHeight}px` }}>
      <AppContext.Provider
        value={{
          state,
          setState,
          handleLogoutChange,
          abstract,
          urlStatus,
        }}
      >
        <RouterProvider
          router={router}
          fallbackElement={<p>Nothing here!</p>}
        />
      </AppContext.Provider>
    </div>
  );
}

export default App;
