// Here's the magic happens!

// The AST can reduced to simplified values based on
// the functions that are passed to it as input.

const supportedMethods = require("../lib");
const throwError = require("../error").throwError;
const varStore = require("../store");

// special forms are evaluated differently than the usual
// lisp code that are applying a bunch of functions
const validSpecialForms = ["def", "ldef"];

function reducedArgList(args, specialForm) {
    return args.reduce((currentList, currentElement) => {
        if (!Array.isArray(currentElement)) {
            // using only the value for the evaluation
            // the type information can also be checked,
            // if necessary.

            const { type, value } = currentElement;

            if (type === "symbol" && specialForm !== "def") {
                // if it is a name, then we check if
                // variable listed in our var store.
                // if not then this should be reported
                // as an invalid symbol

                const currentState = varStore.getState();

                let symbolValue;

                if (currentState[value]) {
                    symbolValue = currentState[value];
                } else if (supportedMethods[value]) {
                    symbolValue = supportedMethods[value];
                } else {
                    // the symbol is not found, in either locations
                    throwError({ message: `${value} is not a valid symbol` });
                    return;
                }

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
        return ast.value;
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

    // Of the currenly supported special forms, we check if
    // the current function might be any one of those
    const filterSpecialFunc = validSpecialForms.filter(
        funct => funct === functionName
    );

    // since there at most 1 match from all the special forms
    let specialFunction = filterSpecialFunc[0];

    if (!supportedMethods[functionName]) {
        throwError({ message: `${functionName} method doesn't exist!` });
        return;
    }

    if (specialFunction === "ldef") {
        const [bindings, expressions] = args;

        let evaluatedBindings = bindings.value.reduce(
            (newObj, currentElement) => {
                if (currentElement.type === "expression") {
                    return [
                        ...newObj,
                        {
                            type: "expression",
                            value: evaluate(currentElement.value),
                        },
                    ];
                }

                return [...newObj, currentElement];
            },
            []
        );

        return supportedMethods[functionName](evaluatedBindings, expressions);
    }

    const reducedArguments = reducedArgList(args, specialFunction);

    if (!reducedArguments) {
        // this is done to prevent readline throwing an error
        // the error is due to the undefined symbols found while
        // reducing the arguments
        return;
    }

    return supportedMethods[functionName](...reducedArguments);
}

module.exports = evaluate;
