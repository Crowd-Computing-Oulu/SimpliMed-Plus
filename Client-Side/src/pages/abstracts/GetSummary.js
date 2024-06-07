/*global chrome*/
import React from "react";
import "./getSummary.css";
import { AppContext } from "../../App";
import { updateState } from "../../utils";
import { Exclamation } from "react-bootstrap-icons";
export default function GetSummary() {
  const { state, setState, abstract, urlStatus } = React.useContext(AppContext);

  const [error, setError] = React.useState("");

  async function getSummary() {
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
      // IF THE UESR IS NOT ON PUBMED WEBSITE
      if (urlStatus === "notPubmed") {
        return (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="px-3">
              This feature only works if you go to PubMed website, and open an
              article.
            </p>
            <button
              className="button getSummaryBtn"
              onClick={() =>
                chrome.tabs.create({
                  url: "https://pubmed.ncbi.nlm.nih.gov/",
                  active: true,
                })
              }
            >
              Go to PubMed
            </button>
          </div>
        );
      }
      // IF THE UESR IS ON PUBMED WEBSITE BUT NOT ON AN ARTICLE, OR THE ARTICLE DOESNT HAVE AN ABSTRACT BUT
      else if (urlStatus === "pubmedNoAbstract") {
        return (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="px-3">Open an article with available abstract.</p>
            <button className="button getSummaryBtn disabledBtn">
              No available abstract
            </button>
          </div>
        );
      } else if (urlStatus === "pubmedWithAbstract") {
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
              <p className=" p-2" style={{ color: "var(--quaternary-color)" }}>
                This is a new article, but the content you see is for the
                previous article. Get the new summary
              </p>
              <button className="button getSummaryBtn" onClick={getSummary}>
                Get Summary
              </button>
            </div>
          );
        } else if (!state.abstractData && abstract) {
          return (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <p className=" p-2" style={{ color: "var(--quaternary-color)" }}>
                Click on the button to get 2 different summary versions for this
                abstract.
              </p>
              <button className="button getSummaryBtn" onClick={getSummary}>
                Get Summary
              </button>
            </div>
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
      <div className="getSummary-container flex-grow-0 mt-4">
        <div className="d-flex flex-column align-items-center justify-content-center  ">
          {state &&
            summaryButton(state.isLoading, error, state.abstractData, abstract)}
        </div>
      </div>
    </>
  );
}
