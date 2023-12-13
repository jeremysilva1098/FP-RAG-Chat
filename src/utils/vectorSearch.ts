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
const openaiKey: string | void = process.env.OPENAI_API_KEY || console.error("OpenAI Key not Found in Environment Variables");
const openaiEmbeddingUrl: string = "https://api.openai.com/v1/embeddings"
const openaiEmbeddingModel: string = "text-embedding-ada-002"

// create the db config
const url: string = "localhost";
const port: number = 6333;
const defaultCollection: string = "freeplay_content";
const client = new QdrantClient({ host: url, port: port });

// create the interfaces for embedding
interface EmbeddingResponse {
    object: string;
    data: EmbeddingData[];
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}

interface EmbeddingData {
    object: string;
    index: number;
    embedding: number[];
}

// create the interfaces for vector search res
export interface VectorSearchResponse {
    id: number | string;
    version: number;
    score: number;
    payload?: VectorDBPayload | Record<string, unknown>;
    vector?: number[] | Record<string, unknown>;
}

export interface VectorDBPayload {
    description: string;
    source: string;
    text: string;
    title: string;
}


// function to generate an embedding
async function embedText(inputText: string){
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

        const embedRes: EmbeddingResponse = await response.json();
        // console.log(embedRes)
        return embedRes.data[0].embedding;
    } catch (error) {
        console.error(error)
    }
}

// function to run a vector search
export async function vectorSearch(inputString: string,
    topK: number = 10, collection: string = defaultCollection
    ): Promise<VectorSearchResponse[]>{
    // embed the input string
    const embedding: number[] = await embedText(inputString);
    // run the vector search
    let searchResult: VectorSearchResponse[] = await client.search(collection, {
        vector: embedding,
        limit: topK
    });
    return searchResult;
}
