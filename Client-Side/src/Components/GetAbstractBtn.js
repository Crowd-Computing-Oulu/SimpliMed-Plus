/*global chrome*/
import React from "react";
export default function GetAbstractBtn({ setState, updateState, abstract }) {
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
        console.log("response in btn", response);

        // if (response.response === "Token Exist and page should go on loading") {
        //   console.log("page should go on loading", response.state);
        //   // updateState(response.state);
        //   setState((prevState) => ({
        //     ...prevState,
        //     ...response.state,
        //   }));
        // } else if (response.respones === "Another Response") {
        //   console.log("i am the seonc response in the application");
        // } else if (response.response === "Error") {
        //   console.error(response.error);
        // } else if (response.respones === "ErrorIn") {
        //   console.log(
        //     "i am the seoncd response in the applications and i have an error",
        //     response.error
        //   );
        // }
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
