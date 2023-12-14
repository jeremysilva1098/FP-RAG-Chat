import * as chat from "./utils/chatFunctions.js";
import readline from 'readline';
// create the interface for the readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Type 'exit' to end the session");
async function initChat() {
    console.log("\n\n");
    console.log("Welcome to the Freeplay Chat Client! What can I help you with?");
    console.log("\n");
    // ask questions unil the user terminates the session
    askQuestion();
}
async function askQuestion() {
    rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log("Closing Session...");
            rl.close();
            return;
        }
        // send the message to the chatbot
        const newResponse = await chat.getCompletion(input);
        console.log("\n");
        console.log(newResponse.content);
        console.log("\n");
        //ask again
        askQuestion();
    });
}
initChat();
rl.on('close', () => {
    process.exit(0);
});
