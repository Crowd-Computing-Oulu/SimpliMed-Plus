/*global chrome*/
import React from "react";
export default function GetAbstractBtn({ setState, abstract }) {
  const style = { backgroundColor: "var(--primary-color)", width: "80%" };
  async function getAbstract() {
    // const abstractInformation = await getTabInformation(currentTab);
    console.log("the abstract in btn is", abstract);
    chrome.runtime.sendMessage(
      {
        action: "summaryRequest",
        abstract,
      },
      (response) => {
        // if(response.response === "")
        console.log("i am the response in getbtn", response);
        if (response.response === "Token Exist and page should go on loading") {
          console.log("page should go on loading");
          setState((prevState) => ({
            ...prevState,
            ...response.state,
          }));
        }
      }
    );
  }
  return (
    <div className="d-flex align-items-center justify-content-center mt-3">
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
