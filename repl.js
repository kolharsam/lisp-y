// The one with the REPL
// Trying to keep things a little fancy here for the complete lisp-env experience

const readline = require('readline');

// TODO: Can add autocomplete feature for the REPL! Option is available on the
// readline package

/**
 * Drives the repl for the current lisp
 * @param {Object} config - use the config to set the REPL name, function to evalute,
 * error handling .etc
 */
function REPL(config) {
    const {
        name,
        read,
        eval,
        welcomeMsg,
        exitMsg
    } = config;

    // Welcome message - could've been done in a better way.
    console.log("\n\n", welcomeMsg, "\n\n");
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${name}> `
    });

    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();

        // read
        const readInput = read(input);

        // evalutate
        const resultFromEval = eval(readInput);

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
    }).on('close', () => {
        console.log("\n\n", exitMsg);
        process.exit(0);
    });
}

module.exports = REPL;
