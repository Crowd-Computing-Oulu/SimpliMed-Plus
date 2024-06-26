import { requestSummary, requestKeywords } from "./backend-utils.js";
/*global chrome*/

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// A state should have these values overall

let state = {
  // accessToken: "",
  isLoading: false,
  difficultyLevel: 0,
  // abstractData: {
  //   interactionId: "test",
  //   url: "test",
  //   originalTitle: "test",
  //   summerizedTitle: "test",
  //   originalAbstract: "test",
  //   advancedAbstract: "test",
  //   elementaryAbstract: "test",
  // },
  feedback: {
    originalTime: 0,
    advancedTime: 0,
    elementaryTime: 0,
  },
  chatHistory: [
    {
      sender: "ai",
      message:
        "Ask a medical question and I will find relevant keywords for you.",
    },
  ],
};

// URL CHANGE WITHIN THE SWTICHIN TAB
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    // Access the tab URL
    // send a message to sidepanel for tab switch with the url
    chrome.runtime.sendMessage({
      action: "Tab Switched",
      url: tab.url,
    });
  });
});
// URL CHANGE WITHIN THE SAME TAB
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Check if the URL has changed
  if (changeInfo.url) {
    // Send a message to the side panel for the URL change
    chrome.runtime.sendMessage({
      action: "URL Changed",
      url: changeInfo.url,
    });
  }
});
// UPON OPENING THE EXTENSION
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "firstOpen") {
    chrome.storage.local.get(["openAIKey"], function (data) {
      if (data.openAIKey) {
        state.openAIKey = data.openAIKey;
        // state.accessToken = data.accessToken;
        sendResponse({
          response: "TokenExist",
          state: state,
        });
      } else {
        sendResponse({
          response: "NoToken",
        });
      }
    });
    // To indicate that sendResponse will be called asynchronously
    return true;
  }

  if (message.action === "loginRequest") {
    // this function will verify the token user has entered

    if (message.openAIKey) {
      verifyToken(message.openAIKey)
        .then(function (result) {
          state.openAIKey = message.openAIKey;
          // SAVING TOKEN IN CHROME STORAGE
          chrome.storage.local.set({
            openAIKey: state.openAIKey,
          });
          sendResponse({
            response: "Login Successful",
            state: state,
          });
        })
        .catch(function (error) {
          // error contains the status code here
          console.error("Login failed:", error);
          sendResponse({
            errorMessage: error.message,
            errorStatus: error.status,
          });
        });
    }
    // To indicate that sendResponse will be called asynchronously
    return true;
  } else if (message.action === "logoutRequest") {
    clearChromeStorage()
      .then(function () {
        state = {
          isLoading: false,
          difficultyLevel: 0,
          instructionShown: false,
          feedback: {
            originalTime: 0,
            advancedTime: 0,
            elementaryTime: 0,
            onBoardingQuestionnaire: {},
          },
          chatHistory: [
            {
              sender: "ai",
              message:
                "Ask a medical question and I will find relevant keywords for you.",
            },
          ],
        };
        sendResponse({
          response: "Logout Successfull",
          state: state,
        });
        // chrome.runtime.sendMessage({ action: "updateState", state });
      })
      .catch(function (error) {
        console.error("Logout failed:", error);
      });
    // To indicate that sendResponse will be called asynchronously
    return true;
  }

  if (message.action === "summaryRequest") {
    if (state.openAIKey) {
      // All the information from the previous abstract will be deleted from the state
      delete state.abstractData;
      delete state.feedback;
      state.feedback = { originalTime: 0, advancedTime: 0, elementaryTime: 0 };
      state.instructionShown = true;
      state.isLoading = true;
      // The new state will be updated in sidepanel to have the loading component
      chrome.runtime.sendMessage({ action: "updateState", state });

      const { url, originalTitle, originalAbstract } = message.tabAbstract;
      const body = {
        originalAbstract: originalAbstract,
        originalTitle: originalTitle,
        url: url,
        OPENAI_TOKEN: state.openAIKey,
      };
      requestSummary({ body: body })
        .then((result) => {
          state.abstractData = {};
          state.abstractData.originalAbstract = originalAbstract;
          state.abstractData.advancedAbstract = result.advancedAbstract;
          state.abstractData.elementaryAbstract = result.elementaryAbstract;
          state.abstractData.summerizedTitle = result.summerizedTitle;
          state.abstractData.hardWords = result.hardWords;
          state.abstractData.originalTitle = originalTitle;
          state.isLoading = false;
          chrome.runtime.sendMessage({ action: "updateState", state });
        })
        .catch((error) => {});
    }
    // To indicate that sendResponse will be called asynchronously
    return true;
  }
  if (message.action === "requestKeywords") {
    const body = {
      medicalQuestion: message.medicalQuestion,
      OPENAI_TOKEN: state.openAIKey,
    };
    requestKeywords({ body: body })
      .then((result) => {
        sendResponse({
          response: "Ai response",
          suggestedKeywords: result,
        });
      })
      .catch((error) => {
        sendResponse({
          error: "Error",
          errorMessage: error.message,
          errorStatus: error.status,
        });
      });
    // To indicate that sendResponse will be called asynchronously
    return true;
  }
});

// FUNCTIONS

// CLEAR OPENAIKEY FROM THE STORAGE
async function clearChromeStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(["openAIKey"], function () {
      resolve();
    });
  });
}

// REQUEST LOGIN
async function verifyToken(openAIKey) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
    });
    if (response.status !== 200) {
      if (response.status === 401) {
        const error = new Error("Invalid API key. Please try again.");
        error.status = `${response.status}`;
        throw error;
      } else if (response.status === 403) {
        const error = new Error("Country, region, or territory not supported.");
        error.status = response.status;
        throw error;
      } else if (response.status === 429) {
        const error = new Error("Rate limit reached for requests.");
        error.status = response.status;
        throw error;
      } else if (response.status === 500 || response.status === 503) {
        const error = new Error(
          "The server had an error while processing your request, try again."
        );
        error.status = response.status;
        throw error;
      } else {
        const error = new Error("Invalid API key. Please try again.");
        error.status = response.status;
        throw error;
      }
    }
    return openAIKey;
  } catch (error) {
    // error contains the status code here
    throw error;
  }
}
