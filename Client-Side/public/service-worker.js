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
chrome.storage.local.remove(["username", "accessToken"]);
// console.log("state in background", state);
chrome.storage.local.get(["accessToken", "username"], async function (data) {
  state.username = data.username;
  state.accessToken = data.accessToken;
  console.log(state.username, state.accessToken);
  await updateStudyStatus();
  // this is differnt than the v1
  // console.log("sending a message to update state in app.js");
  // chrome.runtime.sendMessage({ action: "updateState", state });
});

// chrome.runtime.sendMessage("updateState", state);
chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.action === "loginRequest") {
    if (message.username) {
      const accessToken = await requestLogin(message.username);
      state.username = message.username;
      state.accessToken = accessToken;
      await setChromeStorage();
      // this is differnt than the v1
      console.log("Access Token saved in the storage successfully!");
      chrome.runtime.sendMessage({ action: "updateState", state });
      // sendResponse({
      //   response: "Login Successfull",
      // });
    }
  } else if (message.action === "logoutRequest") {
    await clearChromeStorage();
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
    chrome.runtime.sendMessage({ action: "updateState", state });

    // sendResponse("this is the response");
  }
  if (message.action === "submitUserQuestion") {
    let result = await submitUserQuestion(message.userQuestion);
    console.log(result);
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
          // console.log(response);
          let responseData = await response.json();
          // console.log("this is study status", responseData);
          if (response.status == 200) {
            resolve(responseData);
          } else {
            reject({ message: responseData.message });
          }
          // console.log("this is responseData", responseData);
        } catch (error) {
          reject(error);
        }
      } else {
        return;
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
async function submitUserQuestion(userQuestion) {
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
          userQuestion: userQuestion,
        }),
      };

      try {
        const response = await fetch(
          `http://localhost:8080/users/questions`,
          options
        );
        let responseData = await response.json();
        if (response.status == 200) {
          let result = {};
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
