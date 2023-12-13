import { QdrantClient } from "@qdrant/js-client-rest";
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
// connfigure openai
const openaiKey = process.env.OPENAI_API_KEY || console.error("OpenAI Key not Found in Environment Variables");
const openaiEmbeddingUrl = "https://api.openai.com/v1/embeddings";
const openaiEmbeddingModel = "text-embedding-ada-002";
// create the db config
const url = "localhost";
const port = 6333;
const defaultCollection = "freeplay_content";
const client = new QdrantClient({ host: url, port: port });
// function to generate an embedding
async function embedText(inputText) {
    // call the embedding api
    try {
        const response = await fetch(openaiEmbeddingUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                input: inputText,
                model: openaiEmbeddingModel
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const embedRes = await response.json();
        // console.log(embedRes)
        return embedRes.data[0].embedding;
    }
    catch (error) {
        console.error(error);
    }
}
// function to run a vector search
export async function vectorSearch(inputString, topK = 10, collection = defaultCollection) {
    // embed the input string
    const embedding = await embedText(inputString);
    // run the vector search
    let searchResult = await client.search(collection, {
        vector: embedding,
        limit: topK
    });
    return searchResult;
}
