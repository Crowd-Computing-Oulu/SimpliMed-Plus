/*global chrome*/
// chrome.runtime.onConnect.addListener(function (port) {
//   if (port.name === "popupConnection") {
//     port.onDisconnect.addListener(function () {
//       // console.log("popup has been closed");
//     });
//   }
// });
// chrome.commands.onCommand.addListener(function (command) {
//   if (command === "open-devtools") {
//     console.log("devtools should be open");
//     chrome.devtools.inspectedWindow.eval("DevToolsAPI.showPanel('console')");
//   }
// });

// ----------------------------------
// chrome.action.onClicked.addListener(function (tab) {
//   if (tab.url.startsWith("http")) {
//     chrome.debugger.attach({ tabId: tab.id }, "1.2", function () {
//       chrome.debugger.sendCommand(
//         { tabId: tab.id },
//         "Network.enable",
//         {},
//         function () {
//           if (chrome.runtime.lastError) {
//             console.error(chrome.runtime.lastError);
//           }
//         }
//       );
//     });
//   } else {
//     console.log("Debugger can only be attached to HTTP/HTTPS pages.");
//   }
// });

// chrome.debugger.onEvent.addListener(function (source, method, params) {
//   if (method === "Network.responseReceived") {
//     console.log("Response received:", params.response);
//     // Perform your desired action with the response data
//   }
// });

// -------------------------
let state = {
  // accessToken: "",
  isLoading: false,
  difficultyLevel: 0,
  instructionShown: false,

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

// UPON OPENING THE EXTENSION

// chrome.runtime.sendMessage("updateState", state);
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "firstOpen") {
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
    // To indicate that sendResponse will be called asynchronously
    return true;
  }

  if (message.action === "loginRequest") {
    if (message.username) {
      requestLogin(message.username)
        .then(function (accessToken) {
          state.username = message.username;
          state.accessToken = accessToken;
          return setChromeStorage();
        })
        .then(function () {
          // this funciton will send a message and the state to the login request
          console.log("Access Token saved in the storage successfully!");
          sendResponse({
            response: "Login Successfull",
            state: state,
          });
        })
        .catch(function (error) {
          console.error("Login failed:", error);
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
  if (message.action === "summaryRequest") {
    if (state.accessToken) {
      // All the information from the previous abstract will be deleted from the state
      delete state.abstractData;
      delete state.feedback;
      state.feedback = { originalTime: 0, advancedTime: 0, elementaryTime: 0 };
      state.instructionShown = true;
      state.isLoading = true;
      // The new state will be updated in sidepanel to have the loading component
      chrome.runtime.sendMessage({ action: "updateState", state });
      // sendResponse({
      //   response: "Token Exist and page should go on loading",
      //   state: state,
      // });
      try {
        // state.abstractData = await requestSummary(message.abstractInformation);
        // let result = await requestSummary(message.abstractInformation);
        requestSummary(message.abstract)
          .then((result) => {
            state.isLoading = false;
            state.abstractData = result.abstract;
            state.feedback = result.feedback;
            console.log("state in background", state);
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
            sendResponse({
              response: "Succesfull Response",
              state: state,
            });
          })
          .catch((err) => {
            console.error("Error", err);
            sendResponse({
              response: "Error",
              error: err,
              // state: state,
            });
          });
        // sendResponse({
        //   response: "should i be here?",
        //   state: state,
        // });
        // state.abstractData.shuffledArray = shuffleArray(["1", "2", "3"]);
        // console.log(state.abstractData.shuffledArray);
      } catch (error) {
        // console.log(error.message);
        // showing the error message
        // chrome.runtime.sendMessage({
        //   action: "requestSummaryError",
        //   err: error.message,
        // });
        // the esndresponse here wont work!
        console.error("Error", error);
      }
      // state.isLoading = false;
      // to remove the loading page
      // chrome.runtime.sendMessage({ action: "updateState", state });
    }
    // To indicate that sendResponse will be called asynchronously
    return true;
  }
  if (message.action === "requestKeywords") {
    requestKeywords(message.initialQuestion)
      .then(function (result) {
        console.log(result);
        // sendResponse((response) => {
        //   console.log("test");
        // });
      })
      .catch(function (error) {
        console.error("Submit user initial question failed:", error);
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
          console.erorr("Error Fetching study status");
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
        // console.log("this is response", responseData);
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
        reject(error);
      }
    });
  });
}

// UPDATE STUDY STATUS WITH EVERYCHANGE
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
      // if (chrome.runtime.lastError) {
      //   reject(chrome.runtime.lastError);
      // } else {
      // }
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
  // console.log("I am the user in the service worker", username);
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
          console.log(responseData);
          // adding the interactionId in abstractData
          //   responseData.abstract.interactionID = responseData.interactionId;
          //   result.abstract = responseData.abstract;
          //   result.feedback = responseData.feedback;
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
