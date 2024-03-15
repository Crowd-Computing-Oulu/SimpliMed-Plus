import React, { useEffect } from "react";
import { fetchDefinition } from "../apis";
export default function Test2() {
  const [hardWordsObj, setHardWordsObj] = React.useState({});

  const [tooltipVisible, setTooltipVisible] = React.useState({});
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
  const styleDefinition = {
    background: "yellow",
    color: "black",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    zIndex: "1000",
    wordWrap: "break-word",
    textAlign: "left",
    fontSize: "0.9rem",
    fontFamily: "var(--primary-font)",
    left: tooltipPosition.x,
    top: tooltipPosition.y + 20,
  };
  const someText =
    "  Hello, This cancer is for testing wikipedia for hard words leukemia diabetes";
  const hardWords = ["blood pressure", "leukemia", "cancer", "control group"];
  ///
  useEffect(() => {
    async function fetchData() {
      const newWordObjects = {};
      const promises = hardWords.map(async (word) => {
        try {
          const response = await fetchDefinition(word);
          newWordObjects[word] = response;
        } catch (error) {
          console.error("Error fetching definition for", word, ":", error);
          newWordObjects[word] = "Not Found";
        }
      });

      await Promise.all(promises);
      setHardWordsObj(newWordObjects);
    }

    fetchData();
  }, []);

  //  This function highglight the hards words and show the definition on hover
  function showDefinition(text) {
    const words = text.split(/\s+/); // Split the paragraph into words
    return words.map((word, index) => {
      console.log("word", word);
      const lowerCaseWord = word.toLowerCase();
      if (hardWordsObj.hasOwnProperty(lowerCaseWord)) {
        return (
          <>
            <span
              key={index}
              className="text-warning"
              style={{ color: "#ab6700" }}
              onMouseEnter={(event) => handleMouseEnter(lowerCaseWord, event)}
              onMouseLeave={() => handleMouseLeave(lowerCaseWord)}
            >
              {word}{" "}
            </span>
            {tooltipVisible[lowerCaseWord] && (
              <div className="definitionOnHover" style={styleDefinition}>
                <span className="inline-block">Wikipedia: </span>
                <p>{hardWordsObj[lowerCaseWord]}</p>
              </div>
            )}
          </>
        );
      } else {
        console.log("Key 'test' not found");
        return <span key={index}>{word} </span>;
      }
    });
  }

  const handleMouseEnter = (word, event) => {
    console.log("Hovered over:", word);
    const { clientX, clientY } = event;
    setTooltipPosition({ x: clientX, y: clientY });
    setTooltipVisible((prevState) => ({
      ...prevState,
      [word]: true, // Set visibility state for the hovered word
    }));
  };

  // Event handler for leaving a highlighted word
  const handleMouseLeave = (word) => {
    console.log("Left highlighted word");
    setTooltipVisible((prevState) => ({
      ...prevState,
      [word]: false, // Set visibility state for the hovered word
    }));
  };

  return (
    <>
      <p className="flex-grow-1">{showDefinition(someText)}</p>
    </>
  );
}
