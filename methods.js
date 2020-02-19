// define some methods to evaluate from the AST

// NOTE: these functions are mostly reduction functions over a list
// which I feel is absolutely amusing. One of the many things
// that are amazing about a list.

// could've used variadic functions too. But yeah, I just wanted
// to use the arguments object for fun and also that lisp-y wants
// run in a lot more environments...like one's before the ES6 and
// so yeah I thought this would help


// NOTE: These functions are modeled after the clojure docs

function throwError(err) {
    const {func, message} = err;

    const errOn = `Error: on ${func} call.`;

    const completeMessage = errOn + "\n" + message;

    // TODO: might want to include the stacktrace

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

    console.log(args, argsCount);

    if (argsCount !== 1) {
        throwError({
            func: "first",
            message: "too many arguments"
        });
    }

    const coll = args[0];

    // return the first element of the collection
    return coll[0];
}

// The idea is to get as close as possible
// to a symbol lookup table
module.exports = {
    "list": list,
    "add" : add,
    "first": first
};
