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
              backgroundColor: "var(--secondary-color)",
              color: "white",
            }}
          >
            Go To Chat
          </button>
        </NavLink>
      </div>
    </div>
  );
}
