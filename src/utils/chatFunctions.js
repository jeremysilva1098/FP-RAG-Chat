import * as vector_search from "./vectorSearch.js";
import * as freeplay from "freeplay";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Load the environment variables from the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Set the path to the .env file
const envPath = path.resolve(__dirname, '../../.env');
// load the vars
dotenv.config({ path: envPath });
console.log("Looking for .env file in: ", envPath);
// configure freeplay
const freeplayApiKey = process.env.FREEPLAY_KEY;
const freeplayProjID = process.env.FREEPLAY_PROJECT_ID;
const freeplayUrl = process.env.FREEPLAY_URL;
// instantiate the freeplay client
const fpclient = new freeplay.Freeplay({
    freeplayApiKey: freeplayApiKey,
    baseUrl: freeplayUrl,
    providerConfig: {
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
        }
    }
});
export async function newConversation() {
    // can either start session explicitly or implicitly
    // explicit session creation
    /*
    const session = await fpclient.createSession(
        {projectId: freeplayProjID, templateName: 'rag-directions'}
    );
    */
    // implicit session creation
    const session = await fpclient.startChat({
        projectId: freeplayProjID,
        templateName: 'rag-directions',
        variables: {}
    });
    return session;
}
export async function sendMessage(sessionObj, message) {
    // perform rag on the question
    const vectorRes = await vector_search.vectorSearch(message, 4);
    // get the payload from each of the results
    const vectorPayloads = vectorRes.map((res) => res.payload);
    // send the message to the chatbot
    // I'd like to be able to pass in the message and use a prompt template to enrich it
    // rather than have to do the formatting myself
    /*
    const newResponse = await sessionObj.getCompletion({
        templateName: 'rag-query',
        variables: {
            "question": message,
            "supporting_information": JSON.stringify(vectorRes)
        }
    });
    */
    // instead I have to format myself
    const enrichedMessage = message + "\n\n---\n\n" + `SUPPORTING INFORMATION: ${JSON.stringify(vectorPayloads)}`;
    const newResponse = await sessionObj.continueChat({ newMessages: [{ 'role': 'user', 'content': enrichedMessage }] });
    return newResponse.choices[0];
}
export async function getCompletion(message) {
    // perform rag on the question
    const vectorRes = await vector_search.vectorSearch(message, 4);
    // get the payload from each of the results
    const vectorPayloads = vectorRes.map((res) => res.payload);
    // send the message to the LLM via completions
    const newCompletion = await fpclient.getCompletion({
        projectId: freeplayProjID,
        templateName: 'rag-qa',
        variables: {
            "question": message,
            "supporting_information": JSON.stringify(vectorRes)
        }
    });
    return newCompletion.choices[0];
}
// via chat session
/*
const chatSession = await newConversation();
console.debug(chatSession);
const answer = await sendMessage(chatSession, "Can I deploy different prompts to different environments?");
console.debug(answer);
*/
// via completions
/*
const answer = await getCompletion("Can I deploy different prompts to different environments?");
console.debug(answer);
*/
