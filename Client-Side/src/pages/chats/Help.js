/*global chrome*/
import React from "react";
import "./chat-help.css";
import { NavLink } from "react-router-dom";
import aiAvatar from "../../../public/images/ai-avatar.jpg";

document.addEventListener("DOMContentLoaded", function () {
  const scrolltoView = () => {
    const similarArticlesHeading = document.querySelector(
      'h2:contains("Similar Articles")'
    );
    if (similarArticlesHeading) {
      similarArticlesHeading.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Assuming you have a button with id 'scrollButton'
});

export default function Help() {
  // To show different options to user
  const [foundInfo, setFoundInfo] = React.useState(null);
  const handleClick = (event) => {
    // Remove "clicked" class from all buttons
    let parentElement;
    // Some children has an extra parent that is a link or a tag
    if (event.currentTarget.parentElement.tagName === "A") {
      console.log("parentElement", parentElement);
      parentElement = event.currentTarget.parentElement.parentElement;
    } else {
      parentElement = event.currentTarget.parentElement;
      console.log("parentElement", parentElement);
    }
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
    }
    // Add "clicked" class to the clicked button
    event.currentTarget.classList.add("clicked");
    if (event.currentTarget.classList.contains("response-similarArticles")) {
      console.log("similar articles should jump to simlar articles");
      // JUMP TO NEW SECTION ON PUBMED
      // document.addEventListener("DOMContentLoaded", () => {
      //   const similarArticlesElement = document.getElementsByTagName("h2");
      //   similarArticlesElement.scrollIntoView({ behavior: "smooth" });
      // });
      chrome.runtime.sendMessage({ action: "scrollToSimilarArticles" });
    }
  };

  return (
    <div className="aiagent aiagent-container pt-3 ">
      <div className="chatbox">
        <div className="chat-container mt-2 ai">
          <div className="avatar">
            <img
              alt="ai avatar"
              src={aiAvatar}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <div className="message">
            Did you Find the information you were looking for?{" "}
          </div>
        </div>
        {/* SHOW SUGGESTIONS TO USER */}
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
        {/* SHOW SUGGESTIONS TO USER DEPENDING ON THEIR INPUT */}
        {foundInfo === "no" && (
          <div className="suggestions-container mt-3 d-flex flex-column justify-content-center align-items-center">
            <NavLink
              to="https://pubmed.ncbi.nlm.nih.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                className="suggestion-item response-goBack"
                id=""
                onClick={handleClick}
              >
                Go back to PubMed search page!
              </button>
            </NavLink>

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
          </div>
        )}
      </div>
    </div>
  );
}
