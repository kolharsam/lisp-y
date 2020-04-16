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
const throwArgsError = require("../error").throwArgsError;
const throwError = require("../error").throwError;
const storeImports = require("../store");

const getArgs = utils.getArgs;
const isZero = utils.isZero;
const sequenceIterator = utils.sequenceIterator;
const { dispatchers, dispatch, getState } = storeImports;

// Returns the sum of numbers
function add() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        return 0;
    }

    return args.reduce((total, number) => total + number, 0);
}

// Returns the difference of numbers
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

// Returns the product of numbers
function multiply() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        return 1;
    }

    return args.reduce((total, number) => total * number, 1);
}

// Returns the quotient of numbers
function divide() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount === 0) {
        throwArgsError("divide", argsCount, 1);
        return;
    }

    if (args.length === 1) {
        // show error if it is 0
        isZero(args[0]);

        return 1 / args[0];
    }

    if (args.length === 2) {
        const [x, y] = args;
        // Show error if it is 0
        isZero(y);

        return x / y;
    }

    // NOTE: divide(/) in clojure gives the fraction if the
    // numbers are not perfectly divisible.
    // TODO: Try to emulate clojure divide function, in the sense that
    // I must display the fraction rep. by default

    const [startNumber, ...restArgs] = args;

    return restArgs.reduce((total, number) => {
        // Show error if it is 0
        isZero(number);

        return divide(total, number);
    }, startNumber);
}

// Returns modulus of num & div
function mod() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("mod", argsCount, 2);
        return;
    }

    const [num, div] = args;

    if (!div) {
        throwError({
            func: "mod",
            message: "div is not valid",
        });
        return;
    }

    return num % div;
}

// Returns a number one greater than num
function inc() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("inc", argsCount, 1);
        return;
    }

    const num = args[0];

    if (typeof num !== "number") {
        throwError({ func: "inc", message: "expected a number!" });
        return;
    }

    // Or could have used the add function, like so: return add(num, 1)
    return num + 1;
}

// Returns a number one less than num
function dec() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("dec", argsCount, 1);
        return;
    }

    const num = args[0];

    return num - 1;
}

// NOTE: we might have to add support for the types but yes,
// this is a lisp within javascript-land. So yeah, let it be.

// Returns a list of xs
function list() {
    const [args] = getArgs(arguments);

    return args;
}

// Returns the first item in the collection
function first() {
    const [args, argsCount] = getArgs(arguments);

    // NOTE: It'll be good to check if it is an array/list as well
    if (argsCount !== 1) {
        // NOTE: I'm doing this because I think it would help
        // for something like prop-types to exist for node
        // projects and this object representation atleast
        // would help in the documentation process. And this
        // applies to all the functions that are applied to collections.

        throwArgsError("first", argsCount, 1);
        return;
    }

    const coll = args[0];
    const [first, ...rest] = coll;

    return first;
}

// Returns the last element from a collection
function last() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("last", argsCount, 1);
        return;
    }

    const coll = args[0];
    const collLength = args.length;

    return coll[collLength - 1];
}

// Returns the sorted collection in ascending order
// Can use in combination with `reverse` to get the descending order
function sort() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("sort", argsCount, 1);
        return;
    }

    const coll = args[0];

    // return the first element of the collection
    // TODO: try and implement the function my self, to
    // help add performance gains.

    // GOTCHA: sort function sorts the list lexicographically.
    coll.sort((a, b) => a - b);

    return coll;
}

// Returns all elements after the first
function rest() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("rest", argsCount, 1);
        return;
    }

    const coll = args[0];
    const [first, ...rest] = coll;

    return rest;
}

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
        throwArgsError("interpose", argsCount, 2);
        return;
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

// Returns a collection in the reverse order
function reverse() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("reverse", argsCount, 1);
        return;
    }

    const list = args[0];

    return list.reverse();
}

// Returns a collection of numbers from start, until stop
// increments are in step (default 1)
function range() {
    const [args, argsCount] = getArgs(arguments);

    let start = 0,
        end,
        step = 1;

    if (argsCount <= 0 || argsCount > 3) {
        throwArgsError("range", argsCount, 1);
        return;
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
        throwArgsError("shuffle", argsCount, 1);
        return;
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

// Returns the sum of collection of numbers
function sum() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("sum", argsCount, 1);
        return;
    }

    const list = args[0];

    return add(...list);
}

// Returns the product of all elements of collection
function product() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("product", argsCount, 1);
        return;
    }

    const list = args[0];

    return multiply(...list);
}

// The infamous map function, supply a predicate and list.
function map() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("map", argsCount, 2);
        return;
    }

    const [funcToApply, list] = args;

    return list.map(elem => {
        // TODO: might have to do some checks perhaps? this will
        // come after additional information is supplied
        // by the AST

        return funcToApply(elem);
    });
}

// interleave does what zip does in Haskell
// `interleaves` multiple lists until one of them is exhausted
// NOTE: Pass only lists as arguments
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

    let numOfIterations = sort(listsLengths)[0];

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

    if (argsCount !== 2) {
        throwArgsError("conj", argsCount, 1);
        return;
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

    if (argsCount !== 2) {
        throwArgsError("cons", argsCount, 2);
        return;
    }

    const [x, coll] = args;

    return [x, ...coll];
}

// Returns the length of a list
function count() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("count", argsCount, 1);
        return;
    }

    const list = args[0];

    return list.length;
}

// Checks whether a number is even
function isEven() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("isEven", argsCount, 1);
        return;
    }

    const number = args[0];

    return number % 2 === 0;
}

// Checks if the number is odd
function isOdd() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("isOdd", argsCount, 1);
        return;
    }

    return !isEven(args);
}

// Returns true if number is > 0
function isPos() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("isPos", argsCount, 1);
        return;
    }

    const num = args[0];

    return num > 0;
}

// Returns true if number is < 0
function isNeg() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("isNeg", argsCount, 1);
        return;
    }

    const num = args[0];

    return num < 0;
}

// Checks if substring is present in the string
function includes() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("includes", argsCount, 2);
        return;
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
        throwArgsError("capitalize", argsCount, 1);
        return;
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
        throwArgsError("filter", argsCount, 2);
        return;
    }

    const [funcToApply, list] = args;

    return list.filter(elem => funcToApply(elem));
}

// assoc[ciate] method is used to `cons` a key-value pair onto
// a given map

// TODO: as of now, only string keys can be added with assoc.
// otherwise it keeps going into this, infinite loop if the
// colon is used.
function assoc() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount <= 1) {
        throwArgsError("assoc", argsCount, 2);
        return;
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
        return;
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
        throwArgsError("dissoc", argsCount, 2);
        return;
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

    if (argsCount < 1) {
        throwArgsError("concat", argsCount, 1);
        return;
    }

    const [originalList, ...concatColls] = args;

    return concatColls.reduce(
        (concatedList, currentColl) => {
            // Check if it is a valid list
            if (!Array.isArray(currentColl)) {
                throwError({
                    func: "concat",
                    message: "Incorrect argument passed!",
                });
                return;
            }

            return [...concatedList, ...currentColl];
        },
        [...originalList]
    );
}

// Returns a new list with the duplicates removed
function distinct() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("distinct", argsCount, 1);
        return;
    }

    const coll = args[0];

    return [...new Set(coll)];
}

// returns a single, flat list by taking a nested list as input
function flatten() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("flatten", argsCount, 1);
        return;
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

    if (argsCount !== 1) {
        throwArgsError("frequencies", argsCount, 1);
        return;
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
        throwArgsError("max", argsCount, 1);
        return;
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
        throwArgsError("min", argsCount, 1);
        return;
    }

    const listOfNumbers = args;
    const sortedList = listOfNumbers.sort((a, b) => a - b);
    const smallest = sortedList[0];

    return smallest;
}

function nth() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("nth", argsCount, 2);
        return;
    }

    const [coll, index] = args;

    // Handle error state
    if (!coll[index]) {
        throwError({
            func: "nth",
            message: "Index out of bounds",
        });
        return;
    }

    return coll[index];
}

// Returns random float value between 0 (inclusive) and n (default 1) (exclusive)
function rand() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount > 1) {
        throwArgsError("rand", argsCount, 1);
        return;
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

    if (argsCount !== 1) {
        throwArgsError("randInt", argsCount, 1);
        return;
    }

    const n = args[0];

    return Math.floor(Math.random() * n);
}

// Returns a random element from a collection
function randNth() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 1) {
        throwArgsError("randNth", argsCount, 1);
        return;
    }

    const coll = args[0];
    const collLength = coll.length;
    const randomIndex = randInt(collLength);

    return coll[randomIndex];
}

// Returns a sequence of xs
function repeat() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("repeat", argsCount, 2);
        return;
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

    // To sort off match the clojure REPL
    return null;
}

// Returns the collection rotated by x positions
function rotate() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("rotate", argsCount, 2);
        return;
    }

    const [x, coll] = args;

    if (x === 0) {
        return coll;
    }

    let list = [];
    let listLen = coll.length;

    coll.forEach((currentElement, currentIndex) => {
        let updatedIndex;

        if (x < 0) {
            updatedIndex = (currentIndex + (listLen - x) - 1) % listLen;
        } else {
            updatedIndex = (currentIndex + x - 1) % listLen;
        }

        list[updatedIndex] = currentElement;
    });

    return list;
}

// Within clojure-land, this method is known as a
// special form. As of now, unbounds are not supported.

// TODO: Add support for docstrings, but for that a
// docs function must exist.

// This method saves a varaible with a global scope
function def() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("def", argsCount, 2);
        return;
    }

    const [varName, value] = args;

    // obtaining the dispatch object from the
    // action creators
    const actionObject = dispatchers.updateVar(varName, value);

    // dispatching the action
    dispatch(actionObject);

    // to make it similar to the Clojure REPL
    const result = `#user/${varName}`;

    // printing the confirmation that
    print(result);

    return;
}

// This method is similar to a let binding. The
// problem in naming the method as let is that it
// is already a keyword within JS. Hence ldef.
function ldef() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("ldef", argsCount, 2);
        return;
    }

    const [bindings, expression] = args;

    const currentState = getState();

    let currentLocalVars = [];

    // evaluate the expression
    // delete the varaible

    let pointer = 0;

    const bindingsLen = bindings.length;

    while (pointer < bindingsLen) {
        const currentElement = bindings[pointer];

        // currentElement is an object that contains the details
        // as was passed by the evaluate method that preceeds a
        // call to this method.

        if (currentElement.type === "name") {
            // check if another symbol with such name exists
            if (currentState[currentElement.value]) {
                // it exists already in the store
                throwError({
                    message: "A binding with such a name already exists",
                });
                return;
            }

            const bindingValue = bindings[pointer + 1].value;

            const actionObject = dispatchers.updateVar(
                currentElement.value,
                bindingValue
            );

            // dispatching the action for storing the variable
            dispatch(actionObject);

            // Saving the varaible of the current call to ldef
            // the delete action to be called on each of these
            // at the end
            currentLocalVars.push(currentElement.value);
        }

        pointer += 2;
    }

    // Now, that the local bindings are in place, we must evaluate
    // the expression that following these bindings

    const evaluatedResult = evaluate(expression);

    // Now, the evaluated result is here, all we need to remove the
    // local bindings from the store

    currentLocalVars.forEach(binding => {
        const deleteAction = dispatchers.deleteVar(binding);

        dispatch(deleteAction);
    });

    return evaluatedResult;
}

// Returns the first true logical value on applying the predicate
// to each of the elements on the list
function some() {
    const [args, argsCount] = getArgs(arguments);

    if (argsCount !== 2) {
        throwArgsError("some", argsCount, 2);
        return;
    }

    const [func, arr] = args;

    // JS does have a some method, but that only returns
    // if the predicate is true for any value across the list

    const isPredTrue = arr.some(elem => func(elem));

    if (!isPredTrue) {
        // Clojure returns a nil
        return null;
    }

    for (let iter = 0; iter < arr.length; iter++) {
        const currentElement = arr[iter];
        const funcVal = func(currentElement);

        // the predicate should return a bool alone,
        // not any other falsy/truthy value
        if (funcVal) {
            return currentElement;
        }
    }
}

// The total list of functions supported in lisp-y
const coreLibFunctions = {
    list,
    add,
    first,
    subtract,
    multiply,
    divide,
    mod,
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
    isPos,
    isNeg,
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
    rotate,
    def,
    ldef,
    some,
};

module.exports = coreLibFunctions;

// this is to sort-off evade the cyclic
// dependency problem. This may reveal to
// you that my designing skills are the
// absolute worst.
const evaluate = require("../eval");
