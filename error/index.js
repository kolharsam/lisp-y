const TOO_FEW_ARGUMENTS = "Too Few Arguments Passed";
const TOO_MANY_ARGUMENTS = "Too Many Arguments Passed";
const GENERIC_ERROR = "Something was fishy!";
const INVALID_EXPRESSION = "Invalid Expression Passed";

const ERRORS = {
    TOO_FEW_ARGUMENTS,
    TOO_MANY_ARGUMENTS,
    GENERIC_ERROR,
    INVALID_EXPRESSION,
};

/**
 * Helper to display the error
 * @param {string} text
 */
function displayError(text) {
    console.error(`\n${text}\n`);
}

/**
 * Helper to display error
 * @param {string} func - errored function name
 * @param {string} message - error message
 */
function throwError({ func, message }) {
    if (func === undefined && message !== undefined) {
        displayError(message);
    } else if (message === undefined && func !== undefined) {
        displayError(`Error: on ${func} call.`);
    } else if (message === undefined && func === undefined) {
        throw new Error("An unknown error has occurred!");
    } else {
        const errOn = `Error: on ${func}`;
        const completeMessage = errOn + " -> " + message;

        displayError(completeMessage);
    }
}

/**
 * Helper to display error w.r.t arguments passed to functions
 * @param {string} func - function name
 * @param {number} argsCount - current number of arguments passed
 * @param {number} requiredCount - minimum number of arguments required
 */
function throwArgsError(func, argsCount, requiredCount) {
    if (requiredCount > argsCount) {
        throwError({ func, message: ERRORS.TOO_FEW_ARGUMENTS });
    } else if (requiredCount < argsCount) {
        throwError({ func, message: ERRORS.TOO_MANY_ARGUMENTS });
    } else {
        throwError({ func, message: ERRORS.GENERIC_ERROR });
    }
}

/**
 * Helper to show parser errors
 */
function showParseError() {
    throwError({ message: ERRORS.INVALID_EXPRESSION });
}

exports.throwArgsError = throwArgsError;
exports.throwError = throwError;
exports.showParseError = showParseError;
