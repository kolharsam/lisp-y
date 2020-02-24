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

// NOTE: These functions are modeled after the clojure functions

// NOTE: What I also realized recently was that, the list functions
// almost always return a JS Array, which sits perfectly well into
// our AST, because our AST is also one. I'm not sure if this is the
// right way to do things. Help me out here?

const utils = require("./utils");

const getArgs = utils.getArgs;
const throwError = utils.throwError;
const isZero = utils.isZero;
const sequenceIterator = utils.sequenceIterator;

// Utitlity for adding n numbers
function add() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        return 0;
    }

    return args.reduce((total, number) => total + number, 0);
}

// Utility for subtracting n numbers
// NOTE: The implementation is similar to the one in the clojure docs
function subtract() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        return 0;
    }

    if (args.length === 1) {
        return -1 * args[0];
    }

    if (args.length === 2) {
        const [x, y] = args;
        return x - y;
    }

    const [startValue, ...toSubtractList] = args;

    return toSubtractList.reduce((total, number) => subtract(total, number), startValue);
}

// utility for multiplication
function multiply() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        return 1;
    }

    return args.reduce((total, number) => total * number, 1);
}

// Utility for division
function divide() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        throwError({
            func: "divide",
            message: "Too few arguments"
        });
    }

    if (args.length === 1) {
        isZero(args[0]);

        return 1/args[0];
    }

    if (args.length === 2) {
        const [x, y] = args;
        isZero(y);

        return x / y;
    }

    // NOTE: divide(/) in clojure gives the fraction if the
    // numbers are not perfectly divisible.
    // TODO: Try to emulate clojure divide function, in the sense that
    // I must display the fraction rep. by default

    const [startNumber, ...restArgs] = args;

    return restArgs.reduce((total, number) => {
        isZero(number);

        return divide(total, number);
    }, startNumber);
}

// Increment a value
function inc() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "inc",
            message: "Too many arguments"
        });
    }

    const num = args[0];

    // TODO: Check for the type of the arg, using the data within
    // the AST, do not use isNaN or any other method.

    // Or could have used the add function, like so: return add(num, 1)
    return num + 1;
}

// Decrement a value
function dec() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "dec",
            message: "Too many arguments"
        });
    }

    const num = args[0];

    return num - 1;
}

// NOTE: we might have to add support for the types but yes,
// this is a lisp within javascript-land. So yeah, let it be.
function list() {
    const [args] = getArgs(arguments);

    return args;
}

// get the first element from a collection
function first() {
    const [args, argsCount] = getArgs(arguments);

    // NOTE: It'll be good to check if it is an array/list as well
    if (argsCount !== 1) {
        // NOTE: I'm doing this because I think it would help
        // for something like prop-types to exist for node
        // projects and this object representation atleast
        // would help in the documentation process. And this
        // applies to all the functions that are applied to collections.

        throwError({
            func: "first",
            message: "Too many arguments"
        });
    }

    const coll = args[0];
    const [first, ...rest] = coll;

    // return the first element of the collection
    return first;
}

// get the last element from a collection
function last() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "last",
            message: "Too many arguments"
        });
    }

    const coll = args[0];
    const collLength = args.length;

    // return the first element of the collection
    return coll[collLength - 1];
}

// sort the collection
function sort() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "sort",
            message: "Too many arguments"
        });
    }

    const coll = args[0];

    // return the first element of the collection
    // TODO: try and implement the function my self, to
    // help add performance gains.

    // GOTCHA: sort function sorts the list lexicographically.
    coll.sort((a, b) => a - b);

    return coll;
}

// get the rest of the elements from the first
function rest() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "first",
            message: "Too many arguments"
        });
    }

    const coll = args[0];
    const [first, ...rest] = coll;

    // return the first element of the collection
    return rest;
}

// Add String functions here

// Concats all argument strings together
function str() {
    const [args, argsCount] = getArgs(arguments);

    if (!argsCount) {
        return "";
    }

    return args.reduce((accString, currentString) => accString.concat(currentString), "");
}

// TODO: This function should work for all types

// Inserts a character in between the different words that are passed
// while concat-ing them in the process
function interpose() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwError({
            func: "interpose",
            message: "Incorrect arguments passed"
        });
    }

    // FIXME: "\"" The double quote can't be passed, unless it is escaped,
    // or else it goes into an infinite loop

    const [char, wordList] = args;
    const [startWord, ...restWordList] = wordList;
    const wordListLen = wordList.length;

    return restWordList.reduce((accStr, currentWord, index) => {
        if (index === (wordListLen - 1)) {
            return accStr;
        }

        return accStr.concat(char, currentWord);
    }, startWord);
}

// this is the list reverse & not the string reverse
function reverse() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "reverse",
            message: "Incorrect arguments passed"
        });
    }

    const list = args[0];

    return list.reverse();
}

// generates a list with elements within a range
function range() {
    const [args, argsCount] = getArgs(arguments);

    let start = 0, end, step = 1;

    if (!argsCount) {
        throwError({
            func: "range",
            message: "Too few Arguments"
        });
    }

    if (argsCount === 1) {
        end = args[0];
    }

    if (argsCount === 2) {
        start = args[0];
        end = args[1];
    }

    if (argsCount === 3) {
        start = args[0];
        end = args[1];
        step = args[2];
    }

    if (argsCount > 3) {
        throwError({
            func: "range",
            message: "Too many Arguments"
        });
    }

    // get result from the iterator

    let result = [];
    let numberSeq = sequenceIterator(start, end, step);

    for (let num of numberSeq) {
        result.push(num);
    }

    return result;
}

// shuffles the elements of a list
// uses the Fisher-Yates Shuffle Algorithm to perform the shuffle
// This was taken right off of Mike Bostock's post : https://bost.ocks.org/mike/shuffle/
function shuffle() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "shuffle",
            message: "Incorrect number of arguments passed"
        });
    }

    let listCopy = args[0];

    // NOTE: The algorithm is an in-place shuffling algorithm

    // I'm really sorry about the variable names if you don't use
    // autocomplete. This sentence was composed mainly by autocomplete.
    let marker = listCopy.length, temp, intermediate;

    while(marker) {
        intermediate = Math.floor(Math.random() * marker--);

        temp = listCopy[marker];
        listCopy[marker] = listCopy[intermediate];
        listCopy[intermediate] = temp;
    }

    return listCopy;
}

// Calculates the sum of all elements in a given list
function sum() {
    const[args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "sum",
            message: "Incorrect arguments passed"
        });
    }

    const list = args[0];

    return add(...list);
}

function product() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "product",
            message: "Incorrect arguments passed"
        });
    }

    const list = args[0];

    return multiply(...list);
}


// The idea is to get as close as possible to library of core functions
module.exports = {
    "list": list,
    "add" : add,
    "first": first,
    "subtract": subtract,
    "multiply": multiply,
    "divide": divide,
    "sort": sort,
    "last": last,
    "rest": rest,
    "inc": inc,
    "dec": dec,
    "str": str,
    "interpose": interpose,
    "reverse": reverse,
    "range": range,
    "shuffle": shuffle,
    "sum": sum,
    "product": product
};
