// Core set of functions that are available. If it's not here, it
// is not supported.

// NOTE: these functions are mostly reduction functions over a list
// which I feel is absolutely amusing. One of the many things
// that are amazing about a list.

// NOTE:
// could've used variadic functions too. But yeah, I just wanted
// to use the arguments object for fun and also that lisp-y wants
// run in a lot more environments...like one's before the ES6 and
// so yeah I thought this would help

// NOTE: These functions are modeled after the clojure docs

function throwError(err) {
    const {func, message} = err;

    const errOn = `Error: on ${func} function call.`;

    const completeMessage = errOn + "\n" + message;

    // TODO: might want to include the stacktrace
    // BIG LOL! Node already does this. Thanks Node!

    throw new TypeError(completeMessage);
}


// helper to get the arguments from the arguments object
function getArgs(args) {
    return Array.prototype.slice.call(args);
}

// Utitlity for adding n numbers
function add() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount === 0) {
        return 0;
    }

    return args.reduce((total, number) => total + number, 0);
}

// Utility for subtracting n numbers
function subtract() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount === 0) {
        return 0;
    }

    return args.reduce((total, number) => total - number, 0);
}

// utility for multiplication
function multiply() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount === 0) {
        return 1;
    }

    return args.reduce((total, number) => total * number, 1);   
}

// Utility for division
function divide() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount === 0) {
        throwError({
            func: "divide",
            message: "Too few arguments"
        });
    }

    // NOTE: divide(/) in clojure gives the fraction if the
    // numbers are not perfectly divisible.
    // TODO: Try to emulate clojure divide function

    return args.reduce((total, number) => {
        if (number === 0) {
            throwError({
                func: "divide",
                message: "Divide by zero -_-"
            });
        }
    }, 1); 
}

// TODO We might have to add support for the types but yes,
// this is a lisp within javascript-land. So yeah, let it be.
function list() {
    const args = getArgs(arguments);

    return args;
}

// get the first element from a collection
function first() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    // TODO: It'll be good to check if it is an array as well
    if (argsCount !== 1) {
        // NOTE: I'm doing this because I think it would help
        // for something like prop-types to exist for node
        // projects and this object representation atleast
        // would help in the documentation process. And this
        // applies to all the functions that are applied to collections.

        throwError({
            func: "first",
            message: "too many arguments"
        });
    }

    const coll = args[0];
    const [first, ...rest] = coll;

    // return the first element of the collection
    return first;
}

// get the last element from a collection
function last() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount !== 1) {
        throwError({
            func: "last",
            message: "too many arguments"
        });
    }

    const coll = args[0];
    const collLength = args.length;

    // return the first element of the collection
    return coll[collLength - 1];
}

// sort the collection
function sort() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount !== 1) {
        throwError({
            func: "sort",
            message: "too many arguments"
        });
    }

    const coll = args[0];

    // return the first element of the collection
    // TODO: try and implement the function my self, to
    // help add performance gains.

    coll.sort((a, b) => a - b);

    return coll;
}

// get the rest of the elements from the first
function rest() {
    const args = getArgs(arguments);
    const argsCount = args.length;

    if (argsCount !== 1) {
        throwError({
            func: "first",
            message: "too many arguments"
        });
    }

    const coll = args[0];
    const [first, ...rest] = coll;

    // return the first element of the collection
    return rest;
}

// The idea is to get as close as possible
// to a symbol lookup table
module.exports = {
    "list": list,
    "add" : add,
    "first": first,
    "subtract": subtract,
    "multiply": multiply,
    "divide": divide,
    "sort": sort,
    "last": last,
    "rest": rest
};
