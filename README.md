# SimpliMed

## Project Demo

https://github.com/Nawzneen/SimpliMed-Plus/assets/86608888/2ed1e19c-6f45-42de-ab8f-dbb4fc5bd678

## Project Description

**SimpliMed Plus** is a React-Based Chrome browser extension powered by the GPT-4 model. It's designed to streamline the reading of academic articles on the PubMed domain.

The extension is a sidepanel and doesnt change the DOM elements of the page. It contains of 3 different section. In the first one, the users can ask medical quesitons to an AI agent and recieve keywords suggestions. Then the user can find the articles and by using the Get Summary button they can request for simplified versions.

SimpliMed simplifies article abstracts into two distinct versions: elementary and advanced. The elementary version provides a simplified summary of the content, while the advanced version offers a more detailed overview. Also the original articles has a new feature where it highlight the 10 most difficult terms and show the meaning either from wikipedia or gpt itself.

The articles, simplified versions, user questions will be saved on the database, meaning that if the user request for a simplified version of an abstract, they no longer can send request for this abstract and only see the previous results.

## Installation Guide for users

To use SimpliMed, follow these installation steps:

1. **Download the Project:**

   - Download the project with the branch named extension (https://github.com/Nawzneen/SimpliMed-Plus/archive/refs/heads/extension.zip) and unzip it.
   - Go to the "Client-Side" folder.

2. **install the plugin extension on chrome:**

   - Go to chrome browser
   - Open the setting
   - From left menu open extensions
   - Enable developers mode (top right)
   - Click on "load unpacked"
   - Find the folder that contains the extension files. Go to the "Client-Side" folder. Click on the "Build" folder to open.
   - The extension should have been added to your chrome.
   - If you have error, you are probably openning a wrong folder.

**Important Note:** - To Login and use the extension, you need an OpenAI token. Visit the website to see how to get one. - Also check this list for the pricing of using gpt-4 model (https://openai.com/api/pricing/)

## Installation Guide for Developers

To develop SimpliMed, follow these installation steps:

1. **Download the Project:**

   - Download the project with the branch named extension (https://github.com/Nawzneen/SimpliMed-Plus/archive/refs/heads/extension.zip) and unzip it.

2. **Client-Side Configuration for Development:**

   - Navigate to the client-side folder and install the required dependencies using npm:

     `npm install`

   - node_module folder should have been added to your proejct.

3. **Development Mode**

   - After installing the dependencies, run the following command:

     `npm run dev`

   - This file should create another folder called "dist" inside the client-side folder.

4. **install the plugin extension on chrome:**

   - Go to chrome browser
   - Open the setting
   - From left menu open extensions
   - Enable developers mode (top right)
   - Click on "load unpacked"
   - Find the folder that contains the extension files. Go to the "Client-Side" folder. Click on the "dist" folder to open.
   - The extension should have been added to your chrome.
   - If you have error, you are probably openning a wrong folder.

5. **Webpack**

This file will create the dist folder and help you to not build a "build" file everytime you make a small change in the code.

That's it! The SimpliMed extension should now be up and running.

##Some Technical Features

1. The front-end is working with React (react router dom)
2. There is no back-end in this version, but the API calls will take place inside the `backend-utils.js` file.

3. You need an OpenAI Token in order to login and work with the extension.

4. The "service-worker" file will run in the background, even if the sidepanel window is closed.

5. You can change the GPT model in backend-utils.js, but you might need to do some modifications.

6. The "app.js" file is responsible for everything that happens on the sidepanel .

7. App and service-worker javascript files communicate with each other through a port and they send messages and objects to each other when some events happen.

8. You can find the prompts inside the `back-end-utils.js`
