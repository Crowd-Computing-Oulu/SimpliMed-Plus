/*global chrome*/
import React from "react";
import "./getSummary.css";
import { AppContext } from "../App";
import { updateState } from "../utils";
export default function GetSummary() {
  const { state, setState, abstract, wrongPage } = React.useContext(AppContext);
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
          wrongPage ? (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <p>
                This page doesnt have any abstract content, Please go to pubmed
                website and choose an article with an available abstract.
              </p>
              <button
                className="button getSummaryBtn disabledBtn"
                id="getSummary"
              >
                No available abstract
              </button>
            </div>
          ) : state.abstractData ? (
            state.abstractData.url === abstract.url ? (
              <button
                className="button getSummaryBtn disabledBtn"
                id="getSummary"
                // onClick={getSummary}
              >
                Summary Already Exists
              </button>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center">
                <p className="text-warning">
                  This is a new article, but the content you see is for previous
                  article, get the new summary
                </p>
                <button
                  className="button getSummaryBtn"
                  id="getSummary"
                  onClick={getSummary}
                >
                  Get Summary
                </button>
              </div>
            )
          ) : (
            <button
              className="button getSummaryBtn"
              id="getSummary"
              onClick={getSummary}
            >
              Get Summary
            </button>
          )
        ) : (
          <button
            className="button getSummaryBtn loadingBtn "
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
