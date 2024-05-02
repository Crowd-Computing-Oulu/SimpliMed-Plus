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
  const [wrongPage, setWrongPage] = React.useState(false);
  const [state, setState] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);
  // Send a message each time the sidepanel opens
  React.useEffect(() => {
    new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "firstOpen" }, (response) => {
        if (response.response === "TokenExist") {
          console.log("Token exist");
          updateState(setState, response.state);
          resolve(redirect("/"));
        } else {
          resolve(redirect("/login"));
          console.log("token does not exist");
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
        try {
          const abstractInfo = await getTabInformation(message.url);
          setAbstract(abstractInfo);
          setWrongPage(false);
        } catch (error) {
          setWrongPage(true);
        }
      }
      if (message.action === "URL Changed") {
        try {
          const abstractInfo = await getTabInformation(message.url);
          setAbstract(abstractInfo);
          setWrongPage(false);
        } catch (error) {
          setWrongPage(true);
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
        const abstractInfo = await getTabInformation(currentTab.url);
        setWrongPage(false);
        setAbstract(abstractInfo);
      } catch (error) {
        console.error("Error fetching the abstract data from the page:", error);
        setWrongPage(true);
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
    <div className="App">
      <AppContext.Provider
        value={{
          state,
          setState,
          handleLogoutChange,
          abstract,
          wrongPage,
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
