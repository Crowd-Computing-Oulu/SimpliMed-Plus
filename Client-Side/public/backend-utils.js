async function requestToOpenAI(text, systemPrompt, userPrompt, OPENAI_TOKEN) {
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error code: ${response.status}. ${response.statusText}`);
    }

    const responseData = await response.json();
    const message = responseData.choices[0].message.content;

    if (message.includes("User input is not a medical question")) {
      throw new Error("User input is not a medical question");
    }

    let result = { message: message, status: "Ok" };
    return result;
  } catch (error) {
    console.error("Error in requestToOpenAI:", error.message);
    throw error;
  }
}

async function requestToWikipedia(hardWordsJson) {
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

  let mergedDefinition = [];
  const promises = hardWordsArray.map(async (obj) => {
    const word = obj.word;
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${word}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const { extract } = data;
      if (extract.includes("may refer to:")) {
        mergedDefinition.push({
          id: obj.id,
          word: word,
          definition: obj.definition,
          wikipedia: false,
        });
      } else {
        mergedDefinition.push({
          id: obj.id,
          word: word,
          definition: extract,
          wikipedia: true,
        });
      }
    } catch (error) {
      mergedDefinition.push({
        id: obj.id,
        word: word,
        definition: obj.definition,
        wikipedia: false,
      });
    }
  });
  await Promise.all(promises);
  // Sorting the array based on the id
  mergedDefinition.sort((a, b) => a.id - b.id);

  return mergedDefinition;
}
async function requestKeywordsOpenAI(medicalQuestion) {
  const suggestKeywordsPrompt =
    "Generate keywords relevant to the question. Focus on terms that elucidate the relationship between the words and their topic, including related factors, mechanisms, and relevant research areas. These keywords should facilitate searching for pertinent articles on PubMed. You should provide at least 3 phrases that contains keywords relevent to the question. seperate each phrase with a comma. ";
  const systemPrompt =
    "You suggest keywords in medical domain to help people search articles in pubmed database. You provide the answers in json format with a property called Results. Results property has an array of the suggested phrases elements. Each suggested phrase can contain few keywords. If the user input is not a medical or bio question or related to health, you are only allowed to create a json with property of Element that has an array with one element. the element is :User input is not a medical question.";

  try {
    const results = await requestToOpenAI(
      medicalQuestion,
      systemPrompt,
      suggestKeywordsPrompt
    );
    const resultsJson = results.message;
    var resultsObject = JSON.parse(resultsJson);
    // Access the "Phrases" property and store its array in the "suggestedKeywords" array
    var suggestedKeywords = resultsObject.Results;
    // an array of keywords

    return suggestedKeywords;
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
}

export async function requestSummaryy(req) {
  //   request contains the original abstract and title of the article and the token
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
    req.body.OPENAI_TOKEN,
    systemPrompt,
    advancedPrompt
  );
  const elementaryResult = await requestToOpenAI(
    req.body.originalAbstract,
    req.body.OPENAI_TOKEN,
    systemPrompt,
    elementaryPrompt
  );
  const titleResult = await requestToOpenAI(
    req.body.originalTitle,
    req.body.OPENAI_TOKEN,
    systemPrompt,
    titlePrompt
  );
  const hardWordsResult = await requestToOpenAI(
    req.body.originalAbstract,
    req.body.OPENAI_TOKEN,
    systemPrompt,
    hardWordsPrompt
  );
  // This merge the definitions from wikipedia and gpt-4
  const hardWordsWikipediaGPT = await requestToWikipedia(
    hardWordsResult.message
  );
  return {
    advancedAbstract: advancedResult.message,
    elementaryAbstract: elementaryResult.message,
    summerizedTitle: titleResult.message,
    hardWords: hardWordsWikipediaGPT,
  };
}
export async function requestKeywords(req, res) {
  try {
    const suggestedKeywords = await requestKeywordsOpenAI(
      req.body.medicalQuestion,
      req.body.OPENAI_TOKEN
    );
    return suggestedKeywords;
  } catch (err) {
    if (err.message === "User input is not a medical question") {
      const error = new Error(err.message);
      error.status = 400;
      throw error;
    } else {
      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }
  }
}
