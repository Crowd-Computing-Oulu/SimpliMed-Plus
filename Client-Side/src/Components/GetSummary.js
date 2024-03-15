/*global chrome*/
import React from "react";
import "./getSummary.css";
import { AppContext } from "../App";
import { updateState } from "../utils";
export default function GetSummary() {
  const { state, setState, abstract } = React.useContext(AppContext);

  const [error, setError] = React.useState("");

  async function getSummary() {
    console.log("getSummary");
    chrome.runtime.sendMessage(
      {
        action: "summaryRequest",
        tabAbstract: abstract,
      },
      (response) => {
        if (response.response === "Error") {
          setError(response.error);
        }
        updateState(setState, response.state);
      }
    );
  }
  return (
    <div className="getSummary-container flex-grow-0">
      <div className="d-flex align-items-center justify-content-center pt-3">
        {!state.isLoading ? (
          <button
            className="button getSummaryBtn"
            id="getSummary"
            onClick={getSummary}
          >
            Get Summary
          </button>
        ) : (
          <button
            className="button getSummaryBtn disabledBtn "
            id="getSummary"
            disabled
          >
            Summary Requested
          </button>
        )}
      </div>
      {state.isLoading
        ? null
        : error && (
            <p style={{ color: "red" }} className="pt-3">
              {error.message}
            </p>
          )}
    </div>
  );
}
