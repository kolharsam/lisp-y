// Here's the magic happens!

// The AST can reduced to simplified values based on
// the functions that are passed to it as input.

const supportedMethods = require("../lib");

function reducedArgList(args) {
    return args.reduce((currentList, currentElement) => {
        if (!Array.isArray(currentElement)) {
            return [...currentList, currentElement];
        }

        // NOTE: I don't know if this will improve the performance
        // but the point being that the recursive action is `tail`-ed
        return [...currentList, evaluate(currentElement)];
    }, []);
}

function evaluate(ast) {
    if (!Array.isArray(ast)) {
        throw new Error("Not a valid AST");
    }

    // when enter is pressed or () is passed as input
    if (!ast.length) {
        return ast;
    }

    const [func, ...args] = ast;

    if (!supportedMethods[func]) {
        throw new Error(`${func} method doesn't exist!`);
    }

    return supportedMethods[func](...reducedArgList(args));
}

module.exports = evaluate;
