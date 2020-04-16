// Contains all the utilities that can be used while defining the core library methods

const throwError = require("../error").throwError;

/**
 * Separates the function arguments from the `arguments` object
 * @param {Object} args - arguments object from the function
 * @returns {(string|number)[]} - the arguments & the arguments length
 */
function getArgs(args) {
    const funcArgs = Array.prototype.slice.call(args);
    const funcArgsLength = args.length;

    return [funcArgs, funcArgsLength];
}

/**
 * If zero isn't allowed, show error
 * @param {number} num
 * @throws {Error}
 */
function isZero(num) {
    if (!num) {
        throwError({ message: "Zero error -_-" });
        return;
    }
}

// NOTE: This is a step closer to the lazy seqs. that are available in Clojure. YAY!
// NOTE: The idea of a lazy sequence is a double-edged sword, handle with care.
/**
 * Generator for a number sequence
 * @param {number} start
 * @param {number} end
 * @param {number} step
 * @returns {number} - the latest `yield` from the iterator
 */
function* sequenceIterator(start = 0, end = Infinity, step = 1) {
    let number = start;
    let counter = 0;

    while (number < end) {
        counter++;
        yield number;
        number += step;
    }

    return counter;
}

/**
 * Returns true, if all elements in the colls
 * are equal.
 * @param {(string[] | number[])} x
 * @param {(string[] | number[])} y
 */
function isArrayEqual(x, y) {
    if (!Array.isArray(x) || !Array.isArray(y)) {
        return false;
    }

    if (x.length !== y.length) {
        return false;
    }

    for (let iter = 0; iter < x.length; iter++) {
        if (x[iter] !== y[iter]) {
            return false;
        }
    }

    return true;
}

/**
 * Returns true, if x and y are equal.
 * @param {Object} x
 * @param {Object} y
 */
function isObjectEqual(x, y) {
    if (typeof x !== "object" || typeof y !== "object") {
        return false;
    }

    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);

    if (xKeys.length !== yKeys.length) {
        return false;
    }

    for (let iter = 0; iter < xKeys.length; iter++) {
        const currentKey = xKeys[iter];

        if (x[currentKey] !== y[currentKey]) {
            return false;
        }
    }

    return true;
}

/**
 * Returns true if one of the binary operands,
 * holds true through all elements of the coll.
 * @param {Object[]} args
 * @param {string} comparator
 */
function compareItems(args, comparator) {
    let methodToApply;

    if (comparator === "<") {
        methodToApply = (a, b) => a < b;
    } else if (comparator === ">") {
        methodToApply = (a, b) => a > b;
    } else if (comparator === "<=") {
        methodToApply = (a, b) => a <= b;
    } else if (comparator === ">=") {
        methodToApply = (a, b) => a >= b;
    } else {
        return false;
    }

    const [x, ...rest] = args;

    for (let iter = 0; iter < rest.length; iter++) {
        const currentElement = rest[iter];

        if (typeof currentElement !== "number") {
            return false;
        }

        if (!methodToApply(x, currentElement)) {
            return false;
        }
    }

    return true;
}

exports.getArgs = getArgs;
exports.isZero = isZero;
exports.sequenceIterator = sequenceIterator;
exports.isArrayEqual = isArrayEqual;
exports.isObjectEqual = isObjectEqual;
exports.compareItems = compareItems;
