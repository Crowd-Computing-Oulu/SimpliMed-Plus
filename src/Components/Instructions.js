import React from "react";
import "./instructions.css";

export default function Instructions() {
  return (
    <div
      id="instructions-container"
      className="instructions-container  hiddenn"
    >
      <h6 className="fw-bold">Instructions:</h6>
      <ol>
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
      </ol>
    </div>
  );
}
