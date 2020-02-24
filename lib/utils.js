// Contains all the utilities that can be used while defining the core library methods

// TODO: We can setup, an object with error codes and the respective messages

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
 * Helper to throw error
 * @param {string} func - errored function name
 * @param {string} message - error message
 * @throws {Error}
 */
function throwError({func, message}) {
    if (func === undefined && message !== undefined) {
        throw new Error(message);
    }

    if (message === undefined && func !== undefined) {
        throw new Error(`Error: on ${func} call.`);
    }

    if (message === undefined && func === undefined) {
        throw new Error();
    }

    const errOn = `Error: on ${func} function call`;
    const completeMessage = errOn + "\n" + message;

    throw new Error(completeMessage);
}

/**
 * If zero isn't allowed, throw error
 * @param {number} num
 * @throws {Error}
 */
function isZero(num) {
    if (!num) {
        throw new Error({message: "Zero error -_-"});
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
function* sequenceIterator(start=0, end=Infinity, step=1) {
    let number = start;
    let counter = 0;

    while(number < end) {
        counter++;
        yield number;
        number += step;
    }

    return counter;
}

exports.getArgs = getArgs;
exports.throwError = throwError;
exports.isZero = isZero;
exports.sequenceIterator = sequenceIterator;