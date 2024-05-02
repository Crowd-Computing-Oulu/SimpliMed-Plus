import React from "react";
import { NavLink } from "react-router-dom";

export default function Instructions() {
  return (
    <div className="information-container mt-5">
      <h6 className="fw-bold px-3">Infromation:</h6>
      <p className="px-4" style={{ textAlign: "justify" }}>
        SimpliMed is a web-based application that helps users to find abstracts
        based on medical questions. SimpliMed works on PubMed website and
        simplifies articles abstracts. The 3 main sections consist of a chatbot
        that connects users with an open ai agent, a summary sections that shows
        different simplified versions to the users, and also help users to see
        the difficult words meaning from wikipedia on hover. and the last
        section helps users to see if they have found what they are looking for.
        In order for simpliMed to work with openAI APIs, users need to enter
        their OpenAI tokens. The consumptions will approximately be ... tokens
        per abstract.
      </p>

      <div className="d-flex flex-column justify-content-center align-items-center">
        <span style={{ fontFamily: "var(--secondary-font)" }}>
          Start here by asking your medical quesiton:
        </span>
        <NavLink to="/chat">
          <button
            className="btn fw-bold mt-2"
            style={{
              backgroundColor: "var(--quaternary-color)",
              color: "white",
            }}
          >
            Go To Chat!
          </button>
        </NavLink>
      </div>
      {/* BELOW IS FOR THE USER STUDY */}
      {/* <ol>
        <li>
          Please check your <b> Prolific username</b> from the top right corner
          of the page. If you have entered a wrong username, logout and login
          again!
        </li>
        <li>
          The "phrase of the day" is:
          <span className="dailyPhrase .text-success"></span>
        </li>
        <li>
          Go to pubmed website and use the search bar to find related articles
          to this phrase.
        </li>
        <li>Open the article of your choice.</li>
        <li>Start the study by clicking on the "Get Abstract" button.</li>
        <li>
          If you are going away from your keyword for few minutes, close the
          popup window by clicking outside of the popup!
        </li>
      </ol> */}
    </div>
  );
}
