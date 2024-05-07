# SimpliMed

## Project Description

**SimpliMed Plus** is a React-Based Chrome browser extension powered by the GPT-4 model. It's designed to streamline the reading of academic articles on the PubMed domain. The extension is a sidepanel and doesnt change the DOM elements of the page. It contains of 3 different section. In the first one, the users can ask medical quesitons to an AI agent and recieve keywords suggestions. Then the user can find the articles and by using the Get Summary button they can request for simplified versions.SimpliMed simplifies article abstracts into two distinct versions: elementary and advanced. The elementary version provides a simplified summary of the content, while the advanced version offers a more detailed overview. Also the original articles has a new feature where it highlight the 10 most difficult terms and show the meaning either from wikipedia or gpt itself.
The articles, simplified versions, user questions will be saved on the database, meaning that if the user request for a simplified version of an abstract, they no longer can send request for this abstract and only see the previous results.

## Installation Guide

To use SimpliMed, follow these installation steps:

1. **Download the Project:**

   - Download the entire project and unzip it.

2. **Server-Side Setup:**

   - Navigate to the server-side folder and install the required dependencies using npm:

     `npm install`

   - To start the server run

     `npm run start`

3. **Create a .env File:**

   - In the Server-Side folder, create a `.env` file.
   - Add your OpenAI API token to this file as follows:

     `OPENAI_TOKEN = 'YOUR_API_TOKEN'`

4. **Client-Side Configuration for Development:**

   - Navigate to the client-side folder and install the required dependencies using npm:

     `npm install`

   - In the Client-Side folder, open the "service-worker" file.
   - If you're running the project on another server, adjust the server address accordingly (it is now set on localhost).

5. **Set Up MongoDB:**

   - You'll need a MongoDB database to store data.
   - Create a database named "abstracts" with 5 collections for "abstracts," "users," "interactions, suggestions" and "feedbacks."

6. **Start the Development:**

   - To start the development mode run the following command in the Client-side folder:

     `npm run dev`

   - This command will creat a dist folder in the root folder.

7. **instal the plugin extension on chrome:**

   - Go to chrome
   - Open the setting
   - from left menu open extensions
   - enable developers mode (top right)
   - click on "load unpacked"
   - find the folder that contains the extension files (dist) and click open
   - The extension should have been added to your chrome.

8. **Important Note:**
   - If the plugin isn't working correctly, access the "studyStatus.json" file.
   - Update the dates to reflect the current date and the following days for each phrase.

That's it! The SimpliMed extension should now be up and running.

##Some Technical Features

1. The front end is React and the backend is express.js/node.js. MongoDB is used for the database.
2. You can login with any username now, it will be saved in the db. no signing in is required.
3. Each time a user login a token will be created and saved in the chrome local storage. This user token will be saved in the browser for 10days. It is required for using the API's. if the plugin doesnt work, logout and login again.
4. Make sure to always keep the "studyStatus.json" file up to date
5. The "service-worker" file will run in the background, even if the sidepanel window is closed. (It stores a state object, important for the user study)
6. The "app.js" file is responsible for everything that happens on the popup window.

7. Back and Front javascript files communicated with each other through a port and they send messages and objects to each other when some events happen.

8. Prompts can be found in "abstract.controller.js" file. When the "Get Abstract" button is clicked, the page title and abstract will be sent to the gpt-model with these prompts. 4 different prompts are used here.
