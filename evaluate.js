// Here's the magic happens!

// The AST can reduced to simplified values based on
// the functions that are passed to it as input.

// What I hadn't thought of:
// Multiple nested sibilings within a single expr
// For Example:
//          (sort (list (add 1 2) (subtract 3 2) 2 4))
//          which yields (1 2 3 4)

const supportedMethods = require("./methods");

function evaluate(ast) {    
    if (!Array.isArray(ast)) {
        throw new TypeError("Not a valid AST");
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
