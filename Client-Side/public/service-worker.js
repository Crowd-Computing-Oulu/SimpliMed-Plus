// /*global chrome*/

// chrome.runtime.onMessage.addListener(async function (
//   request,
//   sender,
//   sendResponse
// ) {
//   if (request.action === "currentTab") {
//     console.log("I got the currentTab in the worker ", request.currentTab);
//     const response = await fetch(request.currentTab.url);
//     // console.log(response);
//     const text = await response.text();
//     // console.log(text);
//     const parser = new DOMParser();

//     // coverting html into a document
//     const doc = parser.parseFromString(text, "text/html");
//     // console.log(doc);

//     // Specify the target where you want to inject the script
//     const target = { tabId: request.currentTab.id };
//     const scriptCode = "document.documentElement.outerHTML";
//     chrome.scripting
//       .executeScript({
//         target: target,
//         func: () => "document.documentElement.outerHTML", // Use a function that returns the script code
//       })
//       .then((injectionResults) => {
//         // Handle the results of the script execution
//         for (const { frameId, result } of injectionResults) {
//           console.log(`Frame ${frameId} result:`, result);
//         }
//       })
//       .catch((error) => {
//         console.error("Error executing script:", error);
//       });
//   }
// });
