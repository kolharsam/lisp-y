// The one with the REPL
// Trying to keep things a little fancy here for the complete lisp-env experience

const readline = require("readline");
const autoComplete = require("./autoComplete");

/**
 * Drives the repl for the current lisp
 * @param {Object} config - use the config to set the REPL name, function to evalute,
 * error handling .etc
 */
function REPL(config) {
    const { name, read, evaluate, welcomeMsg, exitMsg } = config;

    // Welcome message - could've been done in a better way.
    console.log("\n\n", welcomeMsg, "\n\n");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${name}> `,
        completer: autoComplete,
    });

    rl.prompt();

    rl.on("line", line => {
        const input = line.trim();

        // read
        const readInput = read(input);

        // evalutate
        const resultFromEval = evaluate(readInput);

        if (Array.isArray(resultFromEval)) {
            if (resultFromEval.length) {
                // print for list outputs
                console.log("-> ", resultFromEval);
            }
        } else {
            // print for other statements
            console.log("-> ", resultFromEval);
        }

        // this is what keeps the repl going!
        // idk if this is mem. eff in the long run
        rl.prompt();
    }).on("close", () => {
        console.log("\n\n", exitMsg);
        process.exit(0);
    });
}

module.exports = REPL;
