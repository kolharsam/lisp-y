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

    return toSubtractList.reduce(
        (total, number) => subtract(total, number),
        startValue
    );
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
            message: "Too few arguments",
        });
    }

    if (args.length === 1) {
        isZero(args[0]);

        return 1 / args[0];
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
            message: "Too many arguments",
        });
    }

    const num = args[1];

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
            message: "Too many arguments",
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
            message: "Too many arguments",
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
            message: "Too many arguments",
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
            message: "Too many arguments",
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
            message: "Too many arguments",
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

    return args.reduce(
        (accString, currentString) => accString.concat(currentString),
        ""
    );
}

// TODO: This function should work for all types

// Inserts a character in between the different words that are passed
// while concat-ing them in the process
function interpose() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwError({
            func: "interpose",
            message: "Incorrect arguments passed",
        });
    }

    // FIXME: "\"" The double quote can't be passed, unless it is escaped,
    // or else it goes into an infinite loop

    const [char, wordList] = args;
    const [startWord, ...restWordList] = wordList;
    const wordListLen = wordList.length;

    return restWordList.reduce((accStr, currentWord, index) => {
        if (index === wordListLen - 1) {
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
            message: "Incorrect arguments passed",
        });
    }

    const list = args[0];

    return list.reverse();
}

// generates a list with elements within a range
function range() {
    const [args, argsCount] = getArgs(arguments);

    let start = 0,
        end,
        step = 1;

    if (!argsCount) {
        throwError({
            func: "range",
            message: "Too few Arguments",
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
            message: "Too many Arguments",
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
            message: "Incorrect number of arguments passed",
        });
    }

    let listCopy = args[0];

    // NOTE: The algorithm is an in-place shuffling algorithm

    // I'm really sorry about the variable names if you don't use
    // autocomplete. This sentence was composed mainly by autocomplete.
    let marker = listCopy.length,
        temp,
        intermediate;

    while (marker) {
        intermediate = Math.floor(Math.random() * marker--);

        temp = listCopy[marker];
        listCopy[marker] = listCopy[intermediate];
        listCopy[intermediate] = temp;
    }

    return listCopy;
}

// Calculate the sum of all elements in a given list
function sum() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "sum",
            message: "Incorrect arguments passed",
        });
    }

    const list = args[0];

    return add(...list);
}

// Calculate the product of all elements of the given list
function product() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "product",
            message: "Incorrect arguments passed",
        });
    }

    const list = args[0];

    return multiply(...list);
}

// The infamous map function, supply a predicate and list.
function map() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwError({
            func: "map",
            message: "Incorrect arguments passed",
        });
    }

    const [funcToApply, list] = args;

    return list.map(elem => {
        // might have to do some checks perhaps? this will
        // come after additional information is supplied
        // by the AST

        return coreLibFunctions[funcToApply](elem);
    });
}

// interleave does what zip does in Haskell
// `interleaves` multiple lists until one of them is exhausted
// NOTE: Pass only lists as inputs
function interleave() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 1) {
        const list = args[0];

        return list;
    }

    if (argsCount === 0) {
        return [];
    }

    const lists = args;
    const listsLengths = lists.map(xs => xs.length);

    let numOfIterations = coreLibFunctions["sort"](listsLengths)[0];

    let finalResult = [];

    while (numOfIterations) {
        lists.forEach(list => {
            const currentElement = list.shift();
            finalResult.push(currentElement);
        });

        numOfIterations--;
    }

    return finalResult;
}

// Returns a new list with the values that are being
// appended to the list or conj[oined] to the list.
function conj() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount <= 1) {
        throwError({
            func: "conj",
            message: "Too few arguments passed",
        });
    }

    const [originalList, ...newElements] = args;

    return newElements.reduce(
        (resList, currentElement) => [...resList, currentElement],
        originalList
    );
}

// Returns a new list with an element added to the beginning
// of the list provided to this function
function cons() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount <= 1) {
        throwError({
            func: "cons",
            message: "Too few arguments passed",
        });
    }

    const [x, coll] = args;

    return [x, ...coll];
}

// Returns the length of a list
function count() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "count",
            message: "Incorrect arguments passed",
        });
    }

    const list = args[0];

    return list.length;
}

// Checks whether a number is even
function isEven() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "isEven",
            message: "Incorrect arguments passed",
        });
    }

    const number = args[0];

    return number % 2 === 0;
}

// Checks if the number is odd
function isOdd() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "isOdd",
            message: "Incorrect arguments passed",
        });
    }

    return !isEven(args);
}

// Checks if substring is present in the string
function includes() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwError({
            func: "includes",
            message: "Incorrect arguments passed",
        });
    }

    const [str, substr] = args;

    // NOTE: Using indexOf over includes
    return str.indexOf(substr) !== -1;
}

// Converts the first letter of the string to upper-case
// and the rest of the characters to lower-case
function capitalize() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwError({
            func: "capitalize",
            message: "Incorrect arguments passed",
        });
    }

    const str = args[0];
    const strSplit = str.split("");

    // NOTE: This process can be performed with simple
    // joins and then applying toUpperCase and toLowerCase
    // on those parts separately.

    return strSplit.reduce((capWord, letter, index) => {
        if (index === 0) {
            return capWord.concat(letter.toUpperCase());
        }

        return capWord.concat(letter.toLowerCase());
    }, "");
}

// the infamous `filter` reduction function
function filter() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwError({
            func: "filter",
            message: "Incorrect arguments applied",
        });
    }

    const [funcToApply, list] = args;

    return list.filter(elem => coreLibFunctions[funcToApply](elem));
}

// assoc[ciate] method is used to `cons` a key-value pair onto
// a given map

// TODO: as of now, only string keys can be added with assoc.
// otherwise it keeps going into this, infinite loop if the
// colon is used.
function assoc() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount <= 1) {
        throwError({
            func: "assoc",
            message: "Incorrect arguments passed",
        });
    }

    const [originalObj, ...keyValues] = args;

    const resObj = originalObj;
    // TODO: to get more data from the AST, to check whether `originalObj`
    // is a proper object or not

    if (keyValues.length % 2 !== 0) {
        // The keys and values aren't appropriate
        throwError({
            func: "assoc",
            message: "Key Value pairs are incorrect",
        });
    }

    // TODO: check whether the proper syntax is used to define the keys
    // and the values. This will be easier if at the very least that part
    // of the parser is separated out.

    for (let iter = 0; iter < keyValues.length; iter += 2) {
        // odd indices are values and even indices are keys
        const currentValue = keyValues[iter];
        resObj[currentValue] = keyValues[iter + 1];
    }

    return resObj;
}

// dissoc - dissassociates certain keys from a given map
function dissoc() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount <= 1) {
        throwError({
            func: "dissoc",
            message: "Too few arguments",
        });
    }

    const [originalObj, ...setOfKeys] = args;

    return Object.keys(originalObj).reduce((resObj, currentKey) => {
        if (setOfKeys.indexOf(currentKey) !== -1) {
            return resObj;
        }

        return { ...resObj, [currentKey]: originalObj[currentKey] };
    }, {});
}

// Returns merging lists together
function concat() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount <= 1) {
        throwError({
            func: "concat",
            message: "Too few arguments",
        });
    }

    const originalList = args[0];

    return originalList.reduce((concatColls, currentColl) => {
        if (!Array.isArray(currentColl)) {
            throwError({
                func: "concat",
                message: "Incorrect argument passed!",
            });
        }

        return [...concatColls, ...currentColl];
    }, []);
}

// Returns a new list with the duplicates removed
function distinct() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount < 1 || argsCount > 1) {
        throwError({
            func: "distinct",
            message: "Incorrect arguments",
        });
    }

    const coll = args[0];

    return [...new Set(coll)];
}

// returns a single, flat list by taking a nested list as input
function flatten() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount < 1 || argsCount > 1) {
        throwError({
            func: "flatten",
            message: "Incorrect arguments",
        });
    }

    const originalList = args[0];

    function flattenHelper(list) {
        return list.reduce((flatList, currentElement) => {
            if (Array.isArray(currentElement)) {
                return [...flatList, ...flattenHelper(currentElement)];
            }

            return [...flatList, currentElement];
        }, []);
    }

    return flattenHelper(originalList);
}

// Returns an object with the count of each unique element in the collection
function frequencies() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount < 1 || argsCount > 1) {
        throwError({
            func: "frequencies",
            message: "Incorrect arguments",
        });
    }

    const originalList = args[0];

    return originalList.reduce((freqObj, currentElement) => {
        if (!freqObj[currentElement]) {
            return { ...freqObj, [currentElement]: 1 };
        }

        return { ...freqObj, [currentElement]: freqObj[currentElement] + 1 };
    }, {});
}

// Returns the greatest of the numbers passed
function max() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount < 1) {
        throwError({
            func: "max",
            message: "Incorrect arguments passed",
        });
    }

    const listOfNumbers = args;
    const sortedList = listOfNumbers.sort((a, b) => a - b);
    const reverseList = sortedList.reverse();
    const greatest = reverseList[0];

    return greatest;
}

// Returns the minimum of the numbers passed
function min() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount < 1) {
        throwError({
            func: "min",
            message: "Incorrect arguments passed",
        });
    }

    const listOfNumbers = args;
    const sortedList = listOfNumbers.sort((a, b) => a - b);
    const smallest = sortedList[0];

    return smallest;
}

function nth() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount < 2 || argsCount > 2) {
        throwError({
            func: "nth",
            message: "Incorrect arguments passed",
        });
    }

    const [coll, index] = args;

    // Handle error state
    if (!coll[index]) {
        throwError({
            func: "nth",
            message: "Index out of bounds",
        });
    }

    return coll[index];
}

// Returns random float value between 0 (inclusive) and n (default 1) (exclusive)
function rand() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount > 1) {
        throwError({
            func: "rand",
            message: "Incorrect number of arguments",
        });
    }

    const n = argsCount ? args[0] : 1;

    return Math.random() * n;
}

// Returns random integer value between 0 (
function randInt() {
    // NOTE: For some reason, the node REPL would stop
    // if I used the name of the function to be rand_int
    // although it is a valid function name

    // A similar problem happens when I use :'s in the code

    const [args, argsCount] = getArgs(arguments);

    if (argsCount > 1 || argsCount < 1) {
        throwError({
            func: "randInt",
            message: "Incorrect number of arguments",
        });
    }

    const n = args[0];

    return Math.floor(Math.random() * n);
}

// Returns a random element from a collection
function randNth() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount > 1 || argsCount < 1) {
        throwError({
            func: "randNth",
            message: "Incorrect number of arguments",
        });
    }

    const coll = args[0];
    const collLength = coll.length;
    const randomIndex = randInt(collLength);

    return coll[randomIndex];
}

// Returns a sequence of xs
function repeat() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount > 2 || argsCount < 2) {
        throwError({
            func: "repeat",
            message: "Incorrect number of arguments",
        });
    }

    // NOTE: No Lazy Sequences available as of yet,
    // therefore I'm not working on the only x as
    // argument case

    // TODO: Handle the only x case as described above

    const [n, x] = args;
    let resultList = [];
    let counter = 0;

    while (counter < n) {
        resultList.push(x);
        counter++;
    }

    return resultList;
}

// Prints values
function print() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        return;
    }

    console.log(...args);
}

// The total list of functions supported in lisp-y
const coreLibFunctions = {
    list,
    add,
    first,
    subtract,
    multiply,
    divide,
    sort,
    last,
    rest,
    inc,
    dec,
    str,
    interpose,
    reverse,
    range,
    shuffle,
    sum,
    product,
    map,
    interleave,
    count,
    isEven,
    isOdd,
    includes,
    capitalize,
    filter,
    assoc,
    dissoc,
    conj,
    cons,
    concat,
    distinct,
    flatten,
    frequencies,
    max,
    min,
    nth,
    rand,
    randInt,
    randNth,
    repeat,
    print,
};

module.exports = coreLibFunctions;
