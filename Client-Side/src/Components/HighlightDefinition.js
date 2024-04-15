import React, { useEffect } from "react";
import { fetchWikipediaDefinition } from "../apis";
import { WindowDash } from "react-bootstrap-icons";
import "./highlightDefinition.css";
export default function HighlightDefinition({ hardWords, text }) {
  const [modifiedOriginalText, setModifiedOriginalText] = React.useState(null);
  const tooltipRefs = React.useRef({}); // to hold tooltip position states
  // const [tooltipStyle, setTooltipStyle] = React.useState({
  //   display: "none",
  // });

  //  This function highglight the hards words and show the definition on hover
  useEffect(() => {
    setModifiedOriginalText(showDefinition(text));
  }, [text]);
  function showDefinition(text) {
    let result = [];
    let remainingText = text;

    Object.keys(hardWords).forEach((word) => {
      const lowerCaseWord = word.toLowerCase().trim();
      const definition = hardWords[lowerCaseWord];
      const startIndex = remainingText.toLowerCase().indexOf(lowerCaseWord);

      if (startIndex !== -1) {
        // All the words before the hard word
        const before = remainingText.substring(0, startIndex);
        // all the words after the hard word
        const after = remainingText.substring(
          startIndex + lowerCaseWord.length
        );
        // push the text before the hard word to the result array
        result.push(<span key={result.length}>{before}</span>);
        // push the hard word to the result array

        result.push(
          <span
            key={result.length}
            className="highlitedWord"
            style={{}}
            onMouseEnter={(event) => handleMouseEnter(lowerCaseWord, event)}
            onMouseLeave={() => handleMouseLeave(lowerCaseWord)}
          >
            {remainingText.substring(
              startIndex,
              startIndex + lowerCaseWord.length
            )}
            <span>
              <p
                key={result.length}
                ref={(ref) => (tooltipRefs.current[lowerCaseWord] = ref)}
                className="tooltip-definition hidden"
                // style={tooltipStyle}
              >
                <span className="inline-block fw-bold">Wikipedia: </span>
                {definition}
              </p>
            </span>
          </span>
        );
        remainingText = after;
      }
    });

    // Append the remaining text if any
    if (remainingText) {
      result.push(<span key={result.length}>{remainingText}</span>);
    }

    return result;
  }
  function calculateTooltipPosition(
    clientX,
    clientY,
    tooltipWidth,
    tooltipHeight,
    word
  ) {
    // if (!tooltipRefs) return; // Ensure buttonRect is available
    let tooltipLeft = 0 + 20;
    let tooltipTop = 20;
    if (clientX + tooltipWidth > window.innerWidth) {
      let newTooltipX = window.innerWidth - tooltipWidth; // Adjusted left position
      tooltipLeft = newTooltipX - clientX;
    }
    if (clientY + tooltipHeight > window.innerHeight) {
      let newTooltipY = window.innerHeight - tooltipHeight; // Adjusted top position
      tooltipTop = newTooltipY - clientY;
    }
    console.log("tooltip style should be set");
    // setTooltipStyle({
    //   display: "block",
    //   backgroundColor: "gray",
    //   left: `${tooltipLeft}px`,
    //   top: `${tooltipTop}px`,
    //   width: `${popupWidth}px`,
    //   height: `${popupHeight}px`,
    //   position: "absolute",
    // });
    const tooltip = tooltipRefs.current[word];
    tooltip.className = "tooltip-definition";
    tooltip.style.left = `${tooltipLeft}px`;
    tooltip.style.top = `${tooltipTop}px`;
  }

  // Event handler for entering a highlighted word
  const handleMouseEnter = (word, event) => {
    const tooltip = tooltipRefs.current[word];
    if (tooltip) {
      calculateTooltipPosition(event.clientX, event.clientY, 300, 100, word);
    }
  };
  // Event handler for leaving a highlighted word
  const handleMouseLeave = (word) => {
    const tooltip = tooltipRefs.current[word];
    if (tooltip) {
      //reseting the position of the tooltip
      tooltip.style.left = `0px`;
      tooltip.style.top = `0px`;
      tooltip.className = "hidden";
    }
  };

  return (
    <>
      <p className="flex-grow-1">{modifiedOriginalText}</p>
    </>
  );
}
