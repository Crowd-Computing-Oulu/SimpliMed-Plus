// const User = require("../models/user");
const Abstract = require("../models/abstract");
const Interaction = require("../models/interaction");
const Feedback = require("../models/feedback");
const Suggestion = require("../models/suggestion");

const { sendHttpRequest, sendHttpsRequest } = require("../utils/requestUtils");
const axios = require("axios");
// const feedback = require("../models/feedback");

// fetch abstracts
async function requestToOpenAI(text, systemPrompt, userPrompt) {
  const payload = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `${systemPrompt}`,
      },
      {
        role: "user",
        content: `${userPrompt}: ${text}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 900,
  };

  try {
    const responsePromise = axios.post(
      "https://api.openai.com/v1/chat/completions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_TOKEN}`,
        },
      }
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Timeout: Request took too long to complete"));
      }, 120000); //Time in milliseconds
    });

    const response = await Promise.race([responsePromise, timeoutPromise]);
    // console.log("this is response in request to open ai", response);

    if (response instanceof Error) {
      // If response is an Error object (i.e., timeout error)
      throw response;
    }

    if (response.status !== 200) {
      throw new Error(`Error code: ${response.status}. ${response.data}`);
    }

    const message = response.data.choices[0].message.content;
    // Check if the response indicates that the user input is not a medical question
    if (message.includes("User input is not a medical question")) {
      throw new Error("User input is not a medical question");
    }
    let result = { message: message, status: "Ok" };
    return result;
  } catch (error) {
    console.log("Error in requestToOpenAI", error.message);
    // let result = { status: "Error", message: error.message };
    // return result;
    // throw new Error("failed to get response from openai", error.message);
    throw error;
  }
}
async function requestToWikipedia(hardWordsJson) {
  // hardWords object is an object with words as keys and definitions as values in json format (definitions are initially from gpt-4)
  let hardWordsObject = JSON.parse(hardWordsJson);
  let hardWordsArray = [];
  let id = 0;
  for (const word in hardWordsObject) {
    hardWordsArray.push({
      id: id,
      word: word,
      definition: hardWordsObject[word],
      wikipedia: false,
    });
    id++;
  }
  console.log("this is hard words object", hardWordsObject);
  console.log("this is hard words array", hardWordsArray);
  let mergedDefinition = [];
  const promises = hardWordsArray.map(async (obj) => {
    const word = obj.word;
    try {
      // Use wikipedia api to fetch definition
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${word}`
      );
      const { extract } = response.data;
      // remove the uncertain definitions
      if (extract.includes("may refer to:")) {
        mergedDefinition.push({
          id: obj.id,
          word: word,
          definition: obj.definition,
          wikipedia: false,
        });
        // mergedDefinition[word] = hardWordsObject[word];
      } else {
        mergedDefinition.push({
          id: obj.id,
          word: word,
          definition: extract,
          wikipedia: true,
        });
        // mergedDefinition[word] = extract;
      }
    } catch (error) {
      // if there is no wikipedia definition, then keep the gpt-4 definition
      mergedDefinition.push({
        id: obj.id,
        word: word,
        definition: obj.definition,
        wikipedia: false,
      });
      // throw error;
    }
  });
  await Promise.all(promises);
  // Sorting the array based on the id
  mergedDefinition.sort((a, b) => a.id - b.id);

  return mergedDefinition;
}

//

exports.submitFeedback = async (req, res) => {
  console.log("this is request body in submit feedback", req.body);

  const feedback = new Feedback({
    userID: req.user.id,
    interactionID: req.body.interactionID,
    abstractID: req.body.abstractID,
    originalDifficulty: req.body.originalDifficulty,
    advancedDifficulty: req.body.advancedDifficulty,
    elementaryDifficulty: req.body.elementaryDifficulty,
    onBoardingQuestionnaire: req.body.onBoardingQuestionnaire,
    originalTime: req.body.originalTime,
    advancedTime: req.body.advancedTime,
    elementaryTime: req.body.elementaryTime,
  });

  await feedback
    .save()
    .then((feedback) => {
      console.log("feedback submitted.");
      res.status(200).send({
        message: "feedback registered successfully",
        feedback,
      });
    })
    .catch((err) => {
      console.log("Error submitting feedback.");
      res.status(500).send({ message: err });
    });
  // res.status(200).send({ message: "Done" });
  return;
};

////
async function requestSummary(req) {
  console.log("the request in server is:", req.body);

  const systemPrompt =
    "You are an expert science communicator who understands how to simplify scientific text specifically in the medical field. You can simplify the text based on different levels of simplification. In this task, you must simplify the given text, using the user's description.";

  const advancedPrompt =
    "Simplify the following abstract of a medical article while retaining the main idea. The target audience is individuals with an undergraduate university degree. Use language that is understandable for this audience while keeping some technical terms that are not overly complicated. Try not to summerize it. Ensure that the main idea of the original text is preserved without adding any additional information. this is the abstract:";

  const elementaryPrompt =
    "Simplify the following abstract of a medical article while retaining the main idea. The target audience is individuals with an elementary school education degree. Use easy-to-understand language and avoid technical jargon and complex terms. You are allowed to summerize the text, but try not to summerize it too much. Ensure that the main idea of the original text is preserved without adding any additional information.  this is the abstract";

  const titlePrompt = "Simplify the following title:";

  const hardWordsPrompt =
    "Find maximum 10 words from this abstract that might not be known to a reader with elementary school degree, also add 1-2 line of description for each, the end result should be in json format, which keys are the words in lowercase and values are the definition of the words:";

  const advancedResult = await requestToOpenAI(
    req.body.originalAbstract,
    systemPrompt,
    advancedPrompt
  );
  const elementaryResult = await requestToOpenAI(
    req.body.originalAbstract,
    systemPrompt,
    elementaryPrompt
  );
  const titleResult = await requestToOpenAI(
    req.body.originalTitle,
    systemPrompt,
    titlePrompt
  );
  const hardWordsResult = await requestToOpenAI(
    req.body.originalAbstract,
    systemPrompt,
    hardWordsPrompt
  );
  // This merge the definitions from wikipedia and gpt-4
  const hardWordsWikipediaGPT = await requestToWikipedia(
    hardWordsResult.message
  );
  // res.status(200).send({ message: "Done" });
  return {
    advancedAbstract: advancedResult.message,
    elementaryAbstract: elementaryResult.message,
    summerizedTitle: titleResult.message,
    hardWords: hardWordsWikipediaGPT,
  };
}
exports.requestAbstract = async (req, res) => {
  console.log("Abstract Requested.");

  let abstract = null;
  await Abstract.findOne({ url: req.body.url })
    .exec()
    .then((anAbstract) => {
      abstract = anAbstract;
      // Checking if the abstract already exist in the databas
      if (anAbstract != null) {
        console.log("Abstract Already Exists. ", abstract);
      }
    })
    .catch((err) => {
      console.log("Abstract Request Error.");
      res.status(500).send({ message: err });
      throw new Error("Abort");
    });
  // Creating a new Abstract Record if it doesnt already exist
  if (abstract == null) {
    console.log("Creating a new Abstract Record.");
    // add api call
    const results = await requestSummary(req);
    console.log("this is final results", results);
    //
    abstract = new Abstract({
      url: req.body.url,
      originalTitle: req.body.originalTitle,
      originalAbstract: req.body.originalAbstract,
      summerizedTitle: results.summerizedTitle,
      advancedAbstract: results.advancedAbstract,
      elementaryAbstract: results.elementaryAbstract,
      hardWords: results.hardWords,
    });

    try {
      await abstract
        .save()
        .then((anAbstract) => {
          console.log("Created a new Abstract Record.");
        })
        .catch((err) => {
          console.log("Error Creating a new Abstract Record.");
          res.status(500).send({
            message:
              "There was an error generating all the content, please try again!",
          });
          throw new Error("Abort");
        });
    } catch {
      return; //added to stop the app from crashing
    }
  }

  // Check if there is any feedback for this abstract id or not
  let feedback = null;
  await Feedback.findOne({ abstractID: abstract._id, userID: req.user.id })
    .exec()
    .then((aFeedback) => {
      feedback = aFeedback;
      // Checking if the abstract already has a feedback with this user id
      if (aFeedback != null) {
        console.log("feedback Already Exists. ", feedback);
      }
    })
    .catch((err) => {
      console.log("Feedback Request Error.");
      // res.status(500).send({ message: err });
      // throw new Error("Abort");
    });
  //
  const interaction = new Interaction({
    userID: req.user.id,
    abstractID: abstract._id,
    originalTime: req.body.originalTime,
    advancedTime: req.body.advancedTime,
    elementaryTime: req.body.elementaryTime,
  });
  // interaction will be saved regardless of the existance of the abstract in database
  await interaction
    .save()
    .then((interaction) => {
      console.log("Logged Interaction.");
      res.status(200).send({
        message: "Interaction registered successfully",
        abstract,
        feedback,
        interactionId: interaction._id,
      });
    })
    .catch((err) => {
      console.log("Error Logging Interaction.");
      res.status(500).send({ message: err });
      throw new Error("Abort");
    });
};

// SIMPLIMED PLUS, USER ASK A QUESITON AND RECIEVE KEYWORD SUGGESTIONS
exports.requestKeywords = async (req, res) => {
  console.log("keywords Requested.");
  try {
    const suggestedKeywords = await requestKeywordsOpenAI(req);
    console.log("resulllllllllllllllllllllllllt", suggestedKeywords);
    console.log("sugesteeeeet", suggestedKeywords);

    const suggestion = new Suggestion({
      userID: req.user.id,
      interactionID: req.body.interactionID,
      initialQuestion: req.body.initialQuestion,
      suggestedKeywords: suggestedKeywords,
    });
    await suggestion
      .save()
      .then(() => {
        console.log("intial question submitted and keywords.");
        res.status(200).send({
          message: "intial question registered successfully",
          suggestion,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  } catch (err) {
    if (err.message === "User input is not a medical question") {
      res.status(400).send({ message: "Bbbbbad request", statusCode: 400 });
      return;
    } else {
      res.status(500).send({ message: "server failed" });
      return;
    }
  }
  return;
};
async function requestKeywordsOpenAI(req) {
  const suggestKeywordsPrompt =
    "Generate keywords relevant to the question. Focus on terms that elucidate the relationship between the words and their topic, including related factors, mechanisms, and relevant research areas. These keywords should facilitate searching for pertinent articles on PubMed. You should provide at least 3 phrases that contains keywords relevent to the question. seperate each phrase with a comma. ";
  const systemPrompt =
    "You suggest keywords in medical domain to help people search articles in pubmed database. You provide the answers in json format with a property called Results. Results property has an array of the suggested phrases elements. Each suggested phrase can contain few keywords. If the user input is not a medical or bio question or related to health, you are only allowed to create a json with property of Element that has an array with one element. the element is :User input is not a medical question.";

  const results = await requestToOpenAI(
    req.body.initialQuestion,
    systemPrompt,
    suggestKeywordsPrompt
  );
  const resultsJson = results.message;
  console.log(
    "suggested keywords jjjjjjjjjjjjjjjjsssssssssssssssssssssssssssss",
    resultsJson
  );
  var resultsObject = JSON.parse(resultsJson);

  // Access the "Phrases" property and store its array in the "suggestedKeywords" array
  var suggestedKeywords = resultsObject.Results;

  console.log(
    "suggested keywords isssssssssssssssssssssssssssss",
    suggestedKeywords
  );
  return suggestedKeywords;
}
