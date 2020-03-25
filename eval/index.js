// Here's the magic happens!

// The AST can reduced to simplified values based on
// the functions that are passed to it as input.

const supportedMethods = require("../lib");
const throwError = require("../error").throwError;
const varStore = require("../store");

function reducedArgList(args, isFuncDef = false) {
    return args.reduce((currentList, currentElement) => {
        if (!Array.isArray(currentElement)) {
            // using only the value for the evaluation
            // the type information can also be checked,
            // if necessary.

            const { type, value } = currentElement;

            if (type === "name" && !isFuncDef) {
                // if it is a name, then we check if
                // variable listed in our var store.
                // if not then this should be reported
                // as an invalid symbol

                const currentState = varStore.getState();

                if (!currentState[value]) {
                    // the symbol is not found
                    throwError({ message: `${value} is not a valid symbol` });
                    return;
                }

                const symbolValue = currentState[value];

                // return the value of the symbol instead
                return [...currentList, symbolValue];
            }

            return [...currentList, value];
        }

        // NOTE: I don't know if this will improve the performance
        // but the point being that the recursive action is `tail`-ed

        // going back to evaluate since currentElement is a list
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
    const functionName = func.value;

    // this boolean will help us not to report an
    // error if a name is being defined using def
    const isFuncDef = functionName === "def";

    if (!supportedMethods[functionName]) {
        throwError({ message: `${functionName} method doesn't exist!` });
        return;
    }

    const reducedArguments = reducedArgList(args, isFuncDef);

    if (!reducedArguments) {
        // this is done to prevent readline throwing an error
        // the error is due to the undefined symbols found while
        // reducing the arguments
        return;
    }

    return supportedMethods[functionName](...reducedArguments);
}

module.exports = evaluate;
