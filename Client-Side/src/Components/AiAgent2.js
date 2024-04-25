/*global chrome*/
import React from "react";
import "./aiagent.css";
// import icon
import { ArrowUpRight, Repeat1 } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";

export default function AiAgent2() {
  const textareaRef = React.useRef(null);
  const suggestionsRef = React.useRef(null);
  const [foundInfo, setFoundInfo] = React.useState(null);
  const [suggestionsResponse, setSuggestionsResponse] = React.useState(null);

  const [clicked, setClicked] = React.useState(false);
  const [initialQuestion, setInitialQuestion] = React.useState("");
  const [chatHistory, setChatHistory] = React.useState([
    {
      sender: "ai",
      message: "Did you the information you were looking for?",
    },
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  function submitUserQuestion() {
    const newUserChat = {
      sender: "user",
      message: initialQuestion,
    };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newUserChat]);
    setIsTyping(true);
    chrome.runtime.sendMessage(
      {
        action: "requestKeywords",
        initialQuestion,
      },
      function (response) {
        console.log("ai response in front", response.aiResponse);

        // Split suggestedKeywords into an array of lines
        const suggestedKeywordsArray =
          response.aiResponse.suggestedKeywords.split("\n");
        // Create a new chat message for each line
        const newAiChats = suggestedKeywordsArray.map((keyword) => {
          const searchQuery = keyword
            .replace(/^\d+\.\s*"?(.*?)"?$/, "$1")
            .replace(/\s+/g, "+"); // Replace spaces with '+'
          const url = `https://pubmed.ncbi.nlm.nih.gov/?term=${searchQuery}`;
          return {
            sender: "ai",
            message: (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {keyword}
                <ArrowUpRight />
              </a>
            ),
          };
        });

        setIsTyping(false);
        newAiChats.forEach((newChat) => {
          setChatHistory((prevChatHistory) => [...prevChatHistory, newChat]);
        });
      }
    );
    // clear input field
    textareaRef.current.value = "";
    setInitialQuestion("");
  }

  const handleClick = (event) => {
    // Remove "clicked" class from all buttons
    // event.currentTarget.textContent === "Go back to PubMed search page!" &&

    const parentElement = event.currentTarget.parentElement;
    // Remove "clicked" class from sibling buttons
    parentElement.querySelectorAll("button").forEach((button) => {
      if (button !== event.currentTarget) {
        button.classList.remove("clicked");
      }
    });
    if (event.currentTarget.textContent === "Yes") {
      setFoundInfo("yes");
    } else if (event.currentTarget.textContent === "No") {
      setFoundInfo("no");
    } else if (
      event.currentTarget.textContent === "Go back to PubMed search page!"
    ) {
      setSuggestionsResponse(true);
    }

    // Add "clicked" class to the clicked button
    event.currentTarget.classList.add("clicked");
    setSuggestionsResponse(event.currentTargert.id);
  };

  // Add "clicked" class to the clicked button

  return (
    <div className="aiagent aiagent-container mt-1 ">
      {/* Render Chat History  */}
      <div className="chatbox">
        <div className="chat-container mt-1 ai">
          <div className="avatar"></div>
          <div className="message">
            Did you Find the information you were looking for?{" "}
          </div>
        </div>
        <div className="suggestions-container mt-3">
          <button
            className="suggestion-item"
            id="response-yes"
            onClick={handleClick}
          >
            Yes
          </button>
          <button
            className="suggestion-item"
            id="response-no"
            onClick={handleClick}
          >
            No
          </button>
        </div>
        {foundInfo === "no" && (
          <div className="suggestions-container mt-3 d-flex flex-column justify-content-center align-items-center">
            <button
              className="suggestion-item response-goBack"
              id=""
              onClick={handleClick}
              ahref=""
            >
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "black" }}
              >
                Go back to PubMed search page!
              </a>
            </button>

            <NavLink to="/chat">
              <button
                className="suggestion-item response-newQuestion"
                id=""
                onClick={handleClick}
              >
                Ask a new question!
              </button>
            </NavLink>
            <button
              className="suggestion-item"
              id="response-similarArticles"
              onClick={handleClick}
            >
              Explore similar articles!
            </button>
          </div>
        )}
        {foundInfo === "yes" && (
          <div className="suggestions-container mt-3 d-flex flex-column justify-content-center align-items-center ">
            <NavLink to="/chat">
              <button
                className="suggestion-item response-newQuestion"
                id=""
                onClick={handleClick}
              >
                Ask a new question!
              </button>
            </NavLink>
            <button
              className="suggestion-item response-similarArticles"
              onClick={handleClick}
            >
              Another Option
            </button>
          </div>
        )}
      </div>
      {/* <div className="chatbox">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-container mt-1 ${
              chat.sender === "ai" ? "ai" : "user"
            }`}
          >
            {chat.sender === "user" ? (
              <>
                <div className="message">{chat.message}</div>
                <div className="avatar"></div>
              </>
            ) : (
              <>
                <div className="avatar"></div>
                <div className="message">{chat.message}</div>
              </>
            )}
          </div>
        ))}
        {isTyping && (
          <>
            <div className="chat-container mt-1 isTyping">
              <div className="avatar"></div>
              <div className="message ">
                <div className="dot-elastic"></div>
              </div>
            </div>
          </>
        )}
      </div> */}
      {/* <div className="input-container mt-1">
        <textarea
          onChange={(e) => setInitialQuestion(e.target.value)}
          ref={textareaRef}
          type="text"
          id="user-input"
          placeholder="Type your message here"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={submitUserQuestion}
          id="send-button"
          className="button"
        >
          Send
        </button>
      </div> */}
    </div>
  );
}
