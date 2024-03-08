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
  setState((prevState) => ({
    ...prevState,
    ...newState,
  }));
}
