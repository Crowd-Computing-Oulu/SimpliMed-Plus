/*global chrome*/

chrome.runtime.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  if (message.action === "submitUserQuestion") {
    let result = await submitUserQuestion(message.userQuestion);
    console.log(result);
  }
});

// Request User Question to AI
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
