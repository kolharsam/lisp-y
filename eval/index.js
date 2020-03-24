// Here's the magic happens!

// The AST can reduced to simplified values based on
// the functions that are passed to it as input.

const supportedMethods = require("../lib");
const throwError = require("../error").throwError;

function reducedArgList(args) {
    return args.reduce((currentList, currentElement) => {
        if (!Array.isArray(currentElement)) {
            // using only the value for the evaluation
            // the type information can also be checked,
            // if necessary.

            return [...currentList, currentElement.value];
        }

        // NOTE: I don't know if this will improve the performance
        // but the point being that the recursive action is `tail`-ed
        return [...currentList, evaluate(currentElement)];
    }, []);
}

function evaluate(ast) {
    if (!Array.isArray(ast)) {
        throwError({ message: "Not a valid AST" });
        return;
    }

    // when enter is pressed or () is passed as input
    if (!ast.length) {
        return ast;
    }

    const [func, ...args] = ast;

    // .value parameter is being used to consume
    // the value of the token and like mentioned
    // above the type information can be used too

    if (!supportedMethods[func.value]) {
        throwError({ message: `${func.value} method doesn't exist!` });
        return;
    }

    return supportedMethods[func.value](...reducedArgList(args));
}

module.exports = evaluate;
