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
 * @throws {TypeError}
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

    throw new TypeError(completeMessage);
}

/**
 * If zero isn't allowed, throw error
 * @param {number} num
 * @throws {boolean}
 */
function isZero(num) {
    if (!num) {
        throw new Error({message: "Zero error -_-"});
    }
}

exports.getArgs = getArgs;
exports.throwError = throwError;
exports.isZero = isZero;
