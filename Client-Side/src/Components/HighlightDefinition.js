import React, { useEffect } from "react";
import { fetchWikipediaDefinition } from "../apis";
export default function HighlightDefinition({ hardWords, text }) {
  const [modifiedOriginalText, setModifiedOriginalText] = React.useState(null);
  const [tooltipVisible, setTooltipVisible] = React.useState({});
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const styleDefinition = {
    backgroundColor: "rgba(255, 216, 64, 1)",
    position: "absolute",
    minWidth: "200px",
    color: "black",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    zIndex: "1000",
    wordWrap: "break-word",
    textAlign: "left",
    fontSize: "0.9rem",
    fontFamily: "var(--primary-font)",
    left: 20,
    top: 20,
  };

  //  This function highglight the hards words and show the definition on hover
  useEffect(() => {
    setModifiedOriginalText(showDefinition(text));
  }, [tooltipVisible]);
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
            className="text-warningg"
            style={{ color: "rgba(255, 165, 0, 1)", position: "relative" }}
            onMouseEnter={(event) => handleMouseEnter(lowerCaseWord, event)}
            onMouseLeave={() => handleMouseLeave(lowerCaseWord)}
          >
            {remainingText.substring(
              startIndex,
              startIndex + lowerCaseWord.length
            )}
            <span
              key={result.length}
              className={tooltipVisible[word] ? "definitionOnHover" : "hidden"}
              style={styleDefinition}
            >
              <span className="inline-block fw-bold">Wikipedia: </span>
              <p>{definition}</p>
            </span>
          </span>
        );
        // push the definition of the hard word to the result array
        // result.push(
        //   <span
        //     key={result.length}
        //     className={tooltipVisible[word] ? "definitionOnHover" : "hidden"}
        //     style={styleDefinition}
        //   >
        //     <span className="inline-block fw-bold">Wikipedia: </span>
        //     <p>{definition}</p>
        //   </span>
        // );

        remainingText = after;
      }
    });

    // Append the remaining text if any
    if (remainingText) {
      result.push(<span key={result.length}>{remainingText}</span>);
    }

    return result;
  }
  // Event handler for entering a highlighted word
  const handleMouseEnter = (word, event) => {
    console.log("mouse enter", word);
    const { clientX, clientY } = event;
    setTooltipPosition({ x: clientX, y: clientY });
    setTooltipVisible((prevState) => ({
      ...prevState,
      [word]: true, // Set visibility state for the hovered word
    }));
  };
  // Event handler for leaving a highlighted word
  const handleMouseLeave = (word) => {
    console.log("mouse left", word);

    setTooltipVisible((prevState) => ({
      ...prevState,
      [word]: false, // Set visibility state for the hovered word
    }));
    setTooltipPosition({ x: 0, y: 0 }); // Reset tooltip position
  };

  return (
    <>
      <p className="flex-grow-1">{modifiedOriginalText}</p>
    </>
  );
}
