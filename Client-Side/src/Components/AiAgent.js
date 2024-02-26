/*global chrome*/
import React from "react";
import "./aiagent.css";
export default function AiAgent() {
  const [userQuestion, setUserQuestion] = React.useState("");
  function submitUserQuestion() {
    console.log(userQuestion, "state will be sent to ai");
    setUserQuestion("");
    chrome.runtime.sendMessage({
      action: "submitUserQuestion",
      userQuestion,
    });
  }
  return (
    <div className="aiagent aiagent-container">
      <div className="mt-5 mx-3 prompt-box p-4">
        <span className="d-block ai-symbol">AI</span>
        <p className="">
          Ask me a question related to health, and I give you keywords to
          search.
        </p>
      </div>
      <div className="mx-3 mt-3 ">
        {/* <label for="inputField"></label> */}
        <textarea
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          className="p-3"
          type="text"
          id="inputField"
          name="inputField"
          rows={5}
          cols={50}
          placeholder="Enter the text here"
        />

        <button onClick={submitUserQuestion} className="btn d-flex-end">
          Send
        </button>
      </div>
    </div>
  );
}
