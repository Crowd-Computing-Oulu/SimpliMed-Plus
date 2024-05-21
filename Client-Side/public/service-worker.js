/*global chrome*/

// -------------------------
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
  // feedback: {
  //   text,
  //   originalDifficulty,
  //   advancedDifficulty,
  //   elementaryDifficulty,
  //   originalTime,
  //   advancedTime,
  //   elementaryTime,
  // },
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
    // console.log("First open message received");
    chrome.storage.local.get(["accessToken", "username"], function (data) {
      if (data.username && data.accessToken) {
        state.username = data.username;
        state.accessToken = data.accessToken;
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
    updateStudyStatus()
      .then(() => {})
      .catch((error) => {
        console.error("fetching study status failed", error);
      });
    // To indicate that sendResponse will be called asynchronously
    return true;
  }

  if (message.action === "loginRequest") {
    console.log("state in background upon login", state);

    if (message.username) {
      requestLogin(message.username)
        .then(function (accessToken) {
          state.username = message.username;
          state.accessToken = accessToken;
          // SAVING TOKEN IN CHROME STORAGE

          chrome.storage.local.set({
            accessToken: state.accessToken,
            username: state.username,
          });

          sendResponse({
            response: "Login Successful",
            state: state,
          });
        })

        .catch(function (error) {
          // console.error("Login failed:", error);
          sendResponse({
            response: "Login Failed",
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
  // if (message.action === "updateChatHistory") {
  //   state.chatHistory = message.chatHistory;
  //   console.log("MESSAGE chat history", message.chatHistory);
  //   console.log("UPDATED CHAT HISTORY in service worker", state.chatHistory);
  // }
  if (message.action === "summaryRequest") {
    // console.log("new summary has been requested");
    if (state.accessToken) {
      // All the information from the previous abstract will be deleted from the state
      delete state.abstractData;
      delete state.feedback;
      state.feedback = { originalTime: 0, advancedTime: 0, elementaryTime: 0 };
      state.instructionShown = true;
      state.isLoading = true;
      // The new state will be updated in sidepanel to have the loading component
      chrome.runtime.sendMessage({ action: "updateState", state });

      requestSummary(message.tabAbstract)
        .then((result) => {
          state.isLoading = false;
          state.abstractData = result.abstract;
          state.feedback = result.feedback;
          if (!state.feedback) {
            state.feedback = {
              originalTime: 0,
              advancedTime: 0,
              elementaryTime: 0,
            };
          } else {
            state.feedback.status = "sent";
            state.feedback.message =
              "You have already read this article and submitted your answers. If there are remaining daily submissions, choose another article!";
          }
          // UPDATING THE STATE IN THE SIDEPANEL - DATA CONTAINS ABSTRACTS AND FEEDBACKS IF AVAILABLE
          sendResponse({
            response: "Successful",
            state: state,
          });
        })
        .catch((err) => {
          // console.log("Error", err);
          state.isLoading = false;
          sendResponse({
            response: "Error",
            error: err,
            state: state,
          });
        });
    }
    // To indicate that sendResponse will be called asynchronously
    return true;
  }
  if (message.action === "requestKeywords") {
    requestKeywords(message.initialQuestion)
      .then((result) => {
        // console.log(result);
        sendResponse({
          response: "Ai response",
          aiResponse: result,
        });
      })
      .catch((error) => {
        // console.log("Error in workerjs", error);
        sendResponse({
          error: "Error",
          message: error.message,
        });
        // console.error("Submit user initial question failed:", error);
      });
    // To indicate that sendResponse will be called asynchronously
    return true;
  }
});

// FUNCTIONS

// REQUEST STUDY STATUTS AT VERY BEGINING
// we want to see what is the phrase of the day
async function requestStudyStatus() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("accessToken", async function (data) {
      if (data.accessToken) {
        const accessToken = data.accessToken;
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "JWT " + accessToken,
          },
          // body: JSON.stringify({
          //   // we are sending the user authentication in server side
          // }),
        };

        try {
          const response = await fetch(
            `http://localhost:8080/study/status`,
            options
          );
          let responseData = await response.json();
          if (response.status == 200) {
            resolve(responseData);
          } else {
            reject({ message: responseData.message });
          }
        } catch (error) {
          console.error("Error Fetching study status");
          reject(error);
        }
      } else {
        return;
      }
    });
  });
}

// REQUEST ABSTRACT SUMMARIES
async function requestSummary(abstractInfromation) {
  const { url, originalTitle, originalAbstract } = abstractInfromation;
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("accessToken", async function (data) {
      const accessToken = data.accessToken;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken,
        },
        body: JSON.stringify({
          originalAbstract: originalAbstract,
          originalTitle: originalTitle,
          url: url,
        }),
      };

      try {
        const response = await fetch(
          `http://localhost:8080/abstracts/abstract`,
          options
        );
        let responseData = await response.json();
        if (response.status == 200) {
          let result = {};
          // adding the interactionId in abstractData
          responseData.abstract.interactionID = responseData.interactionId;
          result.abstract = responseData.abstract;
          result.feedback = responseData.feedback;
          resolve(result);
        } else {
          reject({ message: responseData.message });
        }
        // console.log("this is responseData", responseData);
      } catch (error) {
        // console.log("fetching will be rejected", error);
        reject(error);
      }
    });
  });
}

// UPDATE STUDY STATUS WITH EVERY CHANGE
// FOR THE USER STUDY
async function updateStudyStatus() {
  // to check the daily phrase and the remainin daily feedbacks
  let studyStatus = await requestStudyStatus();
  state.numberOfDailyFeedbacks = studyStatus.dailyFeedbacks.length;
  state.isStudyCompleted = studyStatus.isCompleted;
  let remainingFeedbacks =
    studyStatus.requiredFeedbacks - studyStatus.dailyFeedbacks.length;
  state.dailyPhrase = studyStatus.dailyPhrase;
  state.remainingFeedbacks = remainingFeedbacks;
  return;
}

// CLEAR ACCESSTOKEN FROM THE STORAGE
async function clearChromeStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(["username", "accessToken"], function () {
      resolve();
    });
  });
}

// SET ACCESS TOKEN IN THE STORAGE
async function setChromeStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(
      { accessToken: state.accessToken, username: state.username },
      async function () {
        await updateStudyStatus();
        resolve();
      }
    );
  });
}

// REQUEST LOGIN
async function requestLogin(username) {
  let accessToken = "";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  };
  try {
    var response = await fetch(`http://localhost:8080/users/login`, options);
    response = await response.json();
    accessToken = response.accessToken;
  } catch (error) {
    console.error("Submitting username in the database failed", error);
  }
  return accessToken;
}

// REQUEST USER QUESTION FROM THE AI
async function requestKeywords(initialQuestion) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("accessToken", async function (data) {
      const accessToken = data.accessToken;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "JWT " + accessToken,
        },
        body: JSON.stringify({
          initialQuestion: initialQuestion,
        }),
      };

      try {
        const response = await fetch(
          `http://localhost:8080/users/suggestions`,
          options
        );
        let responseData = await response.json();
        if (response.status == 200) {
          let result = {};
          // console.log(responseData);
          result.suggestedKeywords = responseData.suggestion.suggestedKeywords;
          result.message = responseData.message;
          // console.log("this is the message", result.message);
          resolve(result);
        } else {
          reject({ message: responseData.message });
        }
      } catch (error) {
        reject(error);
      }
    });
  });
}
