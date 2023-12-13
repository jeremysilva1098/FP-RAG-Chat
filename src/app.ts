import * as chat from "./utils/chatFunctions.js";
import * as freeplay from "freeplay";
import readline from 'readline';

// create the interface for the readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Type 'exit' to end the session");

async function initChat() {
    console.log("\n\n")
    // initialize the conversation
    const session = await chat.newConversation();
    const welcomeMsg = session.messageHistory[session.messageHistory.length - 1]
    console.log(welcomeMsg.content);
    console.log("\n");

    // ask questions unil the user terminates the session
    askQuestion(session);
}

async function askQuestion(session: freeplay.ChatSession) {
    rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log("Closing Session...");
            rl.close();
            return;
        }
        // send the message to the chatbot
        const newResponse = await chat.sendMessage(session, input);
        console.log("\n");
        console.log(newResponse.content);
        console.log("\n");

        //ask again
        askQuestion(session);
    });
}

initChat();

rl.on('close', () => {
    process.exit(0);
});