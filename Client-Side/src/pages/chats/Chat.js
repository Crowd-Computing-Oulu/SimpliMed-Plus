/*global chrome*/
import React from "react";
import "./chat-help.css";
// import icon
import { ArrowUpRight } from "react-bootstrap-icons";
import userAvatar from "../../../public/images/user-avatar.jpg";
import aiAvatar from "../../../public/images/ai-avatar.jpg";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../App";

export default function AiAgent() {
  const [isTyping, setIsTyping] = React.useState(false);
  const textareaRef = React.useRef(null);
  const [medicalQuestion, setMedicalQuestion] = React.useState("");
  const { state, setState } = React.useContext(AppContext);

  function submitUserQuestion() {
    const newUserChat = {
      sender: "user",
      message: medicalQuestion,
    };
    setState((prevState) => ({
      ...prevState,
      chatHistory: [...prevState.chatHistory, newUserChat],
    }));
    setIsTyping(true);
    chrome.runtime.sendMessage(
      {
        action: "requestKeywords",
        medicalQuestion,
      },
      function (response) {
        // Split suggestedKeywords into an array of lines
        if (response.error) {
          let newAiChat;
          if (response.errorStatus == 400) {
            newAiChat = {
              sender: "ai",
              message: (
                <span>I can only provide keywords in the medical domain.</span>
              ),
            };
          } else {
            newAiChat = {
              sender: "ai",
              message: <span>Server error, please try again.</span>,
            };
          }

          setIsTyping(false);
          setState((prevState) => ({
            ...prevState,
            chatHistory: [...prevState.chatHistory, newAiChat],
          }));
        } else {
          const suggestedKeywordsArray = response.suggestedKeywords;
          // Create a new chat message for each line
          const newAiChats = suggestedKeywordsArray.map((keyword) => {
            const searchQuery = keyword
              .replace(/^\d+\.\s*"?(.*?)"?$/, "$1")
              .replace(/\s+/g, "+"); // Replace spaces with '+'
            const url = `https://pubmed.ncbi.nlm.nih.gov/?term=${searchQuery}`;
            return {
              sender: "ai",
              message: (
                <NavLink to="/abstracts" onClick={() => changePath(url)}>
                  {keyword}
                  <ArrowUpRight />
                </NavLink>
              ),
            };
          });
          setIsTyping(false);
          newAiChats.forEach((newChat) => {
            setState((prevState) => ({
              ...prevState,
              chatHistory: [...prevState.chatHistory, newChat],
            }));
          });
        }
      }
    );
    // clear input field
    textareaRef.current.value = "";
    setMedicalQuestion("");
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitUserQuestion();
    }
  }
  function changePath(url) {
    chrome.tabs.create({ url: url });
  }

  return (
    <div className="aiagent aiagent-container mt-3 ">
      {/* Render Chat History  */}
      <div className="chatbox">
        {state.chatHistory &&
          state.chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`chat-container mt-2 ${
                chat.sender === "ai" ? "ai" : "user"
              }`}
            >
              {chat.sender === "user" ? (
                <>
                  <div className="message">{chat.message}</div>
                  <div className="avatar">
                    <img alt="user avatar" src={userAvatar} />
                  </div>
                </>
              ) : (
                <>
                  <div className="avatar">
                    <img
                      alt="ai avatar"
                      src={aiAvatar}
                      style={{ borderRadius: "50%" }}
                    />
                  </div>
                  <div className="message">{chat.message}</div>
                </>
              )}
            </div>
          ))}
        {isTyping && (
          <>
            <div className="chat-container mt-2 isTyping">
              <div className="avatar">
                <img
                  alt="ai avatar"
                  src={aiAvatar}
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <div className="message ">
                <div className="dot-elastic"></div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="input-container mt-1">
        <textarea
          onChange={(e) => setMedicalQuestion(e.target.value)}
          ref={textareaRef}
          type="text"
          id="user-input"
          placeholder="Type your medical question here..."
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={submitUserQuestion}
          id="send-button"
          className="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
