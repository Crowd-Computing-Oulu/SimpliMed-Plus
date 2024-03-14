/*global chrome*/
import React from "react";
import "./getSummary.css";
import { AppContext } from "../App";
import { updateState } from "../utils";
export default function GetSummary() {
  const { state, setState, abstract } = React.useContext(AppContext);

  const [error, setError] = React.useState("");

  async function getSummary() {
    chrome.runtime.sendMessage(
      {
        action: "summaryRequest",
        tabAbstract: abstract,
      },
      (response) => {
        if (response.response === "Successful") {
        } else {
          setError("There was an error, please try again");
        }
        updateState(setState, response.state);
      }
    );
  }
  return (
    <div className="getSummary-container flex-grow-0">
      <div className="d-flex align-items-center justify-content-center pt-3">
        {state.isLoading ? (
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
      <p className="text-danger">{error}</p>
    </div>
  );
}
