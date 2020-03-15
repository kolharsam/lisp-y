// The one with the REPL
// Trying to keep things a little fancy here for the complete lisp-env experience

const readline = require("readline");
const autoComplete = require("./autoComplete");

function closeREPL(exitMessage) {
    const completeExitMessage = "".concat("\n\n", exitMessage);
    console.log(completeExitMessage);
    // exit with status 0
    process.exit(0);
}

// When the input is any of these strings, just ignore and show the prompt
// This is helpful as we save ourselves from going through 2 if statements
// before printing the result
const letGoCases = ["()", ""];

/**
 * Drives the repl for the current lisp
 * @param {Object} config - use the config to set the REPL name, function to evalute,
 * error handling .etc
 */
function REPL(config) {
    const { name, read, evaluate, welcomeMsg, details, exitMsg } = config;

    // Welcome message - could've been done in a better way.
    const completeWelcomeMsg = "".concat(welcomeMsg, "\n", details, "\n");
    console.log(completeWelcomeMsg);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${name}> `,
        completer: autoComplete,
    });

    rl.prompt();

    rl.on("line", line => {
        const input = line.trim();

        // if the input is .exit then quit the REPL
        if (input === ".exit") {
            closeREPL(exitMsg);
        }

        // see if there's match with any of our `let go` cases
        const checkIfLetGo = letGoCases.filter(expInput => input === expInput);

        if (!checkIfLetGo.length) {
            // there's no match, then do these

            // read
            const readInput = read(input);

            // evalutate
            const resultFromEval = evaluate(readInput);

            // NOTE: This is because the `print` method returns an undefined and
            // so this conditional is mainly present to not show that to users.
            if (resultFromEval !== undefined) {
                // print
                console.log("\n-> ", resultFromEval, "\n");
            }
        }

        // this is what keeps the repl going!
        rl.prompt();
    }).on("close", () => {
        closeREPL(exitMsg);
    });
}

module.exports = REPL;
