// The one with the REPL
// Trying to keep things a little fancy here for the complete lisp-env experience

const readline = require('readline');

/**
 * Drives the repl for the current lisp
 * @param {Object} config - use the config to set the REPL name, function to evalute,
 * error handling .etc
 */
function REPL(config) {
    const replName = config.name;

    const replEvalFunc = config.eval;

    const replWelcome = config.replWelcome;

    const replExit = config.replExit;

    // Welcome message - could've been in a better way.
    console.log("\n\n", replWelcome, "\n\n");
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${replName}> `
    });

    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();

        // evalutate
        const resultFromEval = replEvalFunc(input);

        // print
        console.log("-> ", resultFromEval);

        // this is what keeps the repl going!
        // idk if this is mem. eff in the long run
        rl.prompt();
    }).on('close', () => {
        console.log("\n", replExit);
        process.exit(0);
    });
}

module.exports = REPL;
