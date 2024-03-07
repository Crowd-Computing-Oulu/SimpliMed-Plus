/*global chrome*/
import React from "react";
export default function GetAbstractBtn({ setState, abstract }) {
  const style = {
    backgroundColor: "var(--secondary-color)",
    width: "80%",
    boxShadow: "0px 3px 5px 0px gray",
  };
  const [error, setError] = React.useState("");
  async function getAbstract() {
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
        if (response.error) {
          setError("There was an error, please try again");
        }
      }
    );
  }
  return (
    <div className="getAbstract-container flex-grow-0">
      <div className="  d-flex align-items-center justify-content-center pt-3">
        <button
          id="getAbstract"
          style={style}
          className="  button "
          onClick={getAbstract}
        >
          Get Abstract
        </button>
      </div>
      <p className="text-danger">{error}</p>
      {/* <p className="mt-3 px-3">
        Click the above button to get the simplified versions of this abstract
      </p> */}
    </div>
  );
}
