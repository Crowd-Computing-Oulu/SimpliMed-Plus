/*global chrome*/

import React from "react";
import {
  createMemoryRouter,
  RouterProvider,
  redirect,
  Route,
  Navigate,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";

import Login, { action as loginAction } from "./Components/Login";
import AiAgent from "./Components/AiAgent";
import { getTabInformation, updateState } from "./utils";
import Error from "./Components/Error";
import Test3 from "./Components/Test3";
import Test2 from "./Components/Test2";
import Layout from "./Components/Layout";
import Main from "./Components/Main";
import AuthRequired from "./Components/AuthRequired";

// var port = chrome.runtime.connect({ name: "popupConnection" });
export const AppContext = React.createContext();
function App() {
  const [wrongPage, setWrongPage] = React.useState(false);
  const [state, setState] = React.useState(null);
  const [abstract, setAbstract] = React.useState(null);
  // Send a message each time the sidepanel opens
  React.useEffect(() => {
    chrome.runtime.sendMessage({ action: "firstOpen" }, (response) => {
      console.log("state upon open is", response.state);
      if (response.response === "TokenExist") {
        updateState(setState, response.state);
      } else {
        console.log("token does not exist");
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
        try {
          const abstractInfo = await getTabInformation(message.url);
          setAbstract(abstractInfo);
          setWrongPage(false);
        } catch (error) {
          setWrongPage(true);
        }
      }
      if (message.action === "URL Changed") {
        console.log("tab is swtiched and this is the new url,", message.url);
        try {
          const abstractInfo = await getTabInformation(message.url);
          setAbstract(abstractInfo);
          setWrongPage(false);
        } catch (error) {
          setWrongPage(true);
        }

        // when url changes, delete the state.abstractData
        // updateState(setState, message.state);
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
        console.log("state will be update in the useeffect ");
        console.log(message.state);
        updateState(setState, message.state);
      }
    });
  }, []);

  function handleLogoutChange() {
    console.log("user has logged out");
    // Deleting the state upon logout
    setState(null);
    chrome.runtime.sendMessage({ action: "logoutRequest" });
  }

  React.useEffect(() => {
    console.log("new state", state);
  }, [state]);

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
        <Route
          path="/layout"
          errorElement={<Error />}
          // element={state && <Login />}
          // action={(obj) => loginAction(obj, setState)}
          element={<Layout />}
          // element={<Test1 />}
          // loader={() => {
          //   // const baghali = false;
          //   if (!state) {
          //     console.log("we dont have state yet");
          //     // <Navigate to="test3" />;
          //     return redirect("/login");
          //   }
          //   return null;
          // }}
        >
          {/* <Route
          path="test1"
          element={<Test1 />}
          loader={async () => {
            const isLoggedIn = false;
            if (!isLoggedIn) {
              return redirect("/login");
            }
            return null;
          }}
        /> */}
          {/* <Route path="test2" element={<Test2 />} /> */}
          {/* <Route
            path="login"
            errorElement={<Error />}
            element={<Login />}
            action={(obj) => loginAction(obj, setState)}
          /> */}
          {/* <Route element={<AuthRequired />}> */}
          <Route
            path="aiagent"
            errorElement={<Error />}
            element={<AiAgent />}
          />
          <Route
            path="main"
            errorElement={<Error />}
            element={<Main />}
            // loader={() => {
            //   if (state && abstract) {
            //     return null;
            //     return null;
            //   }
            // }}
          />
          <Route path="test3" element={<Test3 />} />
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
      initialEntries: ["/layout"],
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
