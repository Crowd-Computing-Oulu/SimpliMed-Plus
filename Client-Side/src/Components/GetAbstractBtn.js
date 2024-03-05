/*global chrome*/
import React from "react";
export default function GetAbstractBtn({ setState, updateState, abstract }) {
  const style = {
    backgroundColor: "var(--secondary-color)",
    width: "80%",
    boxShadow: "0px 3px 5px 0px gray",
  };
  async function getAbstract() {
    // const abstractInformation = await getTabInformation(currentTab);
    console.log("the abstract in btn is", abstract);
    chrome.runtime.sendMessage(
      {
        action: "summaryRequest",
        abstract,
      },
      (response) => {
        console.log("response in btn", response);
        setState((prevState) => ({
          ...prevState,
          ...response.state,
        }));
      }
    );
  }
  return (
    <div className="flex-grow-0 getAbstract-container d-flex align-items-center justify-content-center pt-3">
      <button
        id="getAbstract"
        style={style}
        className="  button "
        onClick={getAbstract}
      >
        Get Abstract
      </button>
    </div>
  );
}
