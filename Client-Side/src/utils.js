/*global chrome*/
// TO GET THE TAB INFORMATION SUCH AS URL AND TEXT
export async function getTabInformation(url) {
  const response = await fetch(url);
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
  return {
    url: url,
    originalAbstract: originalText,
    originalTitle: originalTitle,
  };
}
//  TO UPDATE THE STATE BASED ON A NEW STATE
export function updateState(setState, newState) {
  setState((prevState) => {
    if (JSON.stringify(prevState) === JSON.stringify(newState)) {
      // if newState and prevState are the same, it should not cause a rerender
      return prevState;
    }
    return {
      ...prevState,
      ...newState,
    };
  });
}

export function requireAuth() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "firstOpen" }, (response) => {
      if (response.response === "NoToken") {
        console.log("token exist, should the state be updated");
        resolve("NoToken");
      } else if (response.response === "TokenExist") {
        console.log("token does exist, i should be redirected to layout");
        resolve("TokenExist");
      }
    });
  });
}
