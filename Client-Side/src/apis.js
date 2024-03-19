import axios from "axios";

// Function to fetch definition from Wikipedia
export const fetchWikipediaDefinition = async (word) => {
  try {
    // Use wikipedia api to fetch definition
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${word}`
    );
    // Extract definition from API response
    const { extract } = response.data;
    return extract;
  } catch (error) {
    console.error("Error fetching definition:", error);
    throw error;
  }
};
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

    if (response instanceof Error) {
      // If response is an Error object (i.e., timeout error)
      throw response;
    }

    if (response.status !== 200) {
      throw new Error(`Error code: ${response.status}. ${response.data}`);
    }

    const message = response.data.choices[0].message.content;
    let result = { message: message, status: "Ok" };
    return result;
  } catch (error) {
    let result = { status: "Error" };
    return result;
  }
}
