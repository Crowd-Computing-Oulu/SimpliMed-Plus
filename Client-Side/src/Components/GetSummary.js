/*global chrome*/
import React from "react";
import { Tooltip } from "bootstrap";
import { AppContext } from "../App";
import { updateState } from "../utils";
export default function GetSummary() {
  const { setState, abstract } = React.useContext(AppContext);

  const style = {
    backgroundColor: "var(--secondary-color)",
    width: "80%",
    boxShadow: "0px 3px 5px 0px gray",
  };
  const disabledStyle = {
    backgroundColor: "gray !important",
  };
  const [error, setError] = React.useState("");
  const [isDisabled, setIsDisabled] = React.useState(false);
  const buttonRef = React.useRef(null);

  // React.useEffect(() => {
  //   // Initialize tooltip if buttonRef exists
  //   if (buttonRef.current && isDisabled) {
  //     const tooltip = new Tooltip(buttonRef.current, {
  //       title: "Summary already exist for this article!", // Define your tooltip text here
  //       placement: "top",
  //       trigger: "hover",
  //     });

  //     return () => {
  //       // Cleanup the tooltip instance when component unmounts
  //       tooltip.dispose();
  //     };
  //   }
  // }, [isDisabled]);

  async function getSummary() {
    console.log("request a new  abstract", abstract);
    chrome.runtime.sendMessage(
      {
        action: "summaryRequest",
        tabAbstract: abstract,
      },
      (response) => {
        if (response.response === "Successful") {
          console.log(response.response);
          // disabling the get abstract btn
          // setIsDisabled(true);
        } else {
          setError("There was an error, please try again");
        }
        console.log("response in btn", response);
        updateState(setState, response.state);
      }
    );
  }
  return (
    <div className="getSummary-container flex-grow-0">
      <div className="d-flex align-items-center justify-content-center pt-3">
        <button
          id="getSummary"
          style={style}
          className={isDisabled ? "button disabled" : "button"}
          onClick={getSummary}
          ref={buttonRef}
        >
          {isDisabled ? "Summary already exist" : "Get Summary"}
        </button>
      </div>
      <p className="text-danger">{error}</p>
      {/* <p className="mt-3 px-3">
        Click the above button to get the simplified versions of this abstract
      </p> */}
    </div>
  );
}
