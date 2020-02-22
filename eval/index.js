// Here's the magic happens!

// The AST can reduced to simplified values based on
// the functions that are passed to it as input.

const supportedMethods = require("../lib");

function evaluate(ast) {
    if (!Array.isArray(ast)) {
        throw new TypeError("Not a valid AST");
    }

    // when enter is pressed or () is passed as input
    if (!ast.length) {
        return ast;
    }

    const [func, ...args] = ast;

    let argList = args.reduce((currentList, currentElement) => {
        if (Array.isArray(currentElement)) {
            return [...currentList, evaluate(currentElement)];
        }

        return [...currentList, currentElement];
    }, []);

    // TODO: Tail call optimisation? Read More.
    return supportedMethods[func](...argList);
}

module.exports = evaluate;
