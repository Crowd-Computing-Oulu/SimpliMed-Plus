/*global chrome*/
import React from "react";
import "./getSummary.css";
import { AppContext } from "../../App";
import { updateState } from "../../utils";
import { Exclamation } from "react-bootstrap-icons";
export default function GetSummary() {
  const { state, setState, abstract, wrongPage } = React.useContext(AppContext);
  console.log("should be rerendered by swtiching tab");
  console.log("abstract", abstract);
  console.log("state", state);
  console.log("wrongPage", wrongPage);

  const [error, setError] = React.useState("");

  // async function getSummary() {
  //   console.log("getSummary");
  //   chrome.runtime.sendMessage(
  //     {
  //       action: "summaryRequest",
  //       tabAbstract: abstract,
  //     },
  //     (response) => {
  //       if (response.response === "Error") {
  //         setError(response.error);
  //       }
  //       updateState(setState, response.state);
  //     }
  //   );
  // }

  async function getSummary() {
    console.log("getSummary");

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            action: "summaryRequest",
            tabAbstract: abstract,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          }
        );
      });

      if (response.response === "Error") {
        setError(response.error);
      }

      updateState(setState, response.state);
    } catch (error) {
      console.error("Error requesting summary:", error);
    }
  }

  function summaryButton() {
    if (!state.isLoading) {
      if (wrongPage) {
        return (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="p-3">
              This page doesn't have any abstract content. Please go to the
              PubMed website and choose an article with an available abstract.
            </p>
            <button className="button getSummaryBtn disabledBtn">
              No available abstract
            </button>
          </div>
        );
      } else {
        if (error) {
          return (
            <>
              <p style={{ color: "red" }} className="pt-3">
                {error.message}
              </p>
              <button className="button getSummaryBtn" onClick={getSummary}>
                Get Summary
              </button>
            </>
          );
        } else if (
          state.abstractData &&
          state.abstractData.url === abstract.url
        ) {
          return (
            <button className="button getSummaryBtn disabledBtn" disabled>
              Summary Already Exists
            </button>
          );
        } else if (
          state.abstractData &&
          state.abstractData.url !== abstract.url
        ) {
          return (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <p className="text-warning p-3">
                <Exclamation /> This is a new article, but the content you see
                is for the previous article. Get the new summary
              </p>
              <button className="button getSummaryBtn" onClick={getSummary}>
                Get Summary
              </button>
            </div>
          );
        } else if (!state.abstractData && abstract) {
          return (
            <button className="button getSummaryBtn" onClick={getSummary}>
              Get Summary
            </button>
          );
        }
      }
    } else if (state.isLoading) {
      return (
        <button className="button getSummaryBtn loadingBtn" disabled>
          Summary Requested
        </button>
      );
    }
  }

  return (
    <>
      <div className="getSummary-container flex-grow-0">
        <div className="d-flex flex-column align-items-center justify-content-center pt-3 ">
          {state &&
            summaryButton(
              state.isLoading,
              error,
              state.abstractData,
              abstract,
              wrongPage
            )}
        </div>
      </div>
    </>
  );
}
