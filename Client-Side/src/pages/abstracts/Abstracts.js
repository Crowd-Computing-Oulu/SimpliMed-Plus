import React from "react";
import "./abstracts.css";
import { AppContext } from "../../App";
import HighlightDefinition from "./HighlightDefinition";
export default function Abstracts() {
  const { state } = React.useContext(AppContext);
  const abstracts = state.abstractData;
  // this is the hardwords and their definition array of objects from Wikipedia or gpt
  const hardWordsDefinitionArray = abstracts.hardWords;
  const [version, setVersion] = React.useState(0);
  // split the paragphras instead of a block of text
  function split(abstract) {
    const paragraphs = abstract.split("\n");
    const allParagraphs = paragraphs.map((paragraph, index) => {
      return <p key={index}>{paragraph}</p>;
    });
    return allParagraphs;
  }

  function handleSliderChange(e) {
    // change the value from string to integer
    setVersion(parseInt(e.target.value));
  }
  return (
    <div className="main-content " id="main-content">
      <div id="difficulty-lvl" className="">
        <span className="difficulty-lvl__title">
          Change the version of the abstract
        </span>
        <div className="difficulty-lvl__slider">
          <input
            type="range"
            id="difficulty-lvl__input"
            name="slider"
            min="0"
            max="4"
            step="1"
            value={version}
            list="tickmarks"
            className="slider"
            onChange={handleSliderChange}
          />
          <datalist id="tickmarks">
            <option value="0">Start</option>
            <option value="1">Elementary</option>
            <option value="2">Advanced</option>
            <option value="3">Original</option>
            <option value="4">Finish</option>
          </datalist>
        </div>
      </div>
      {version === 0 && (
        <div id="difficulty-lvl_instructions" className=" mt-5">
          <p className="fw-bolder">
            The "daily phrase" is:
            <span className="dailyPhrase text-success"></span>
          </p>
          <ol>
            <li>
              Use the above slider to see the different versions of the
              abstract.
            </li>
            <li>Read and rate all the 3 versions.</li>
            <li>Go to the Finish section. Answer the questions and submit.</li>
            <li>
              You need to repeat these steps for 3 different articles each day.
            </li>
            <li>
              You can see the remaining daily submission next to "Get Abstract"
              button.
            </li>
            <li>
              After the fifth day, you will see the post-questionnaire link.
            </li>
          </ol>
        </div>
      )}
      <div id="abstract-container">
        {/* {version === 3 && (
          <h4 className="original-title">{abstracts.originalTitle}</h4>
        )} */}
        {(version === 1 || version === 2) && (
          <h4 className="title">{abstracts.summerizedTitle}</h4>
        )}
        {version === 1 && (
          <p className="elementary-abs">
            {split(abstracts.elementaryAbstract)}
          </p>
        )}
        {version === 2 && (
          <p className="advanced-abs">{split(abstracts.advancedAbstract)}</p>
        )}
        {version === 3 && <h4 className="title">{abstracts.originalTitle}</h4>}
        {/* {version === 4 &&
          Object.keys(hardWords).map(function (key, index) {
            return (
              <div key={index}>
                <p>Key: {key}</p>
                <p>Value: {hardWords[key]}</p>
              </div>
            );
          })} */}
        {version === 3 &&
          // Object.keys(hardWords).map(function (key, index) {
          //   return (
          //     <div key={index}>
          //       <p>Key: {key}</p>
          //       <p>Value: {hardWords[key]}</p>
          //     </div>
          //   );
          // })

          abstracts && (
            <HighlightDefinition
              hardWordsDefinitionArray={hardWordsDefinitionArray}
              text={abstracts.originalAbstract}
            />
          )}
      </div>
    </div>
  );
}
