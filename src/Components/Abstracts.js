import React from "react";
import "./abstracts.css";

export default function Abstracts() {
  return (
    <div className="main-content hiddenn" id="main-content">
      <div id="difficulty-lvl" className="">
        <span className="difficulty-lvl__title">
          Change the version of the abstract
        </span>
        <div className="difficulty-lvl__slider">
          <label for="slider"></label>
          <input
            type="range"
            id="difficulty-lvl__input"
            name="slider"
            min="0"
            max="4"
            step="1"
            value="0"
            list="tickmarks"
            className="slider"
          />
          <datalist id="tickmarks">
            <option value="0">Start</option>
            <option value="1">Elementary</option>
            <option value="2">Advanced</option>
            <option value="3">Original</option>
            <option value="4">Finish</option>
          </datalist>
        </div>
      </div>
      <div id="difficulty-lvl_instructions" className="hidden">
        <p>
          The "phrase of the day" is:
          <span className="dailyPhrase text-success"></span>
        </p>
        <ol>
          <li>
            Use the above slider to see the different versions of the abstract.
          </li>
          <li>Read and rate all the 3 versions.</li>
          <li>Go to the Finish section. Answer the questions and submit.</li>
          <li>
            You need to repeat these steps for 3 different articles each day.
          </li>
          <li>
            You can see the remaining daily submission next to "Get Abstract"
            button.
          </li>
          <li>
            After the fifth day, you will see the post-questionnaire link.
          </li>
        </ol>
      </div>
      <div id="abstract-container">
        <h4 className="original-title">test</h4>
        <h4 className="summary-title">test</h4>
        <p className="elementary-abs">test</p>
        <p className="advanced-abs">test</p>
        <p className="original-abs">test</p>
      </div>
    </div>
  );
}
