import * as freeplay from "freeplay";
import dotenv from 'dotenv';
import path from 'path';
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
const freeplayTestListName = 'rag-qa-examples';
async function main() {
    // create the client
    const fpclient = new freeplay.Freeplay({
        freeplayApiKey: freeplayApiKey,
        baseUrl: freeplayUrl,
        providerConfig: {
            openai: {
                apiKey: process.env.OPENAI_API_KEY,
            }
        }
    });
    const testRun = await fpclient.createTestRun({
        projectId: freeplayProjID,
        environment: 'latest',
        testList: freeplayTestListName
    });
    for await (const testCase of testRun.testCases) {
        const session = await testRun.createSession();
        console.log(testCase.inputs);
        const completion = await session.getCompletion({ templateName: 'rag-qa', variables: testCase.inputs });
        console.log("Completion: ", completion.content.trim());
    }
}
main();
