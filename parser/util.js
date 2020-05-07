// Utility functions for that can be used for the parser

/**
 * checks whether there are matching parentheses present within a particular expression
 * @param {string} expr
 * @returns {bool} - whether the parentheses are matched correctly
 */
function checkParentheses(expr) {
    let parenStack = [];
    const openParens = "(";
    const closedParens = ")";

    // it's a valid expression
    const exprArr = expr.split("");

    exprArr.forEach(char => {
        if (char === openParens) {
            parenStack.unshift(openParens);
        } else if (char === closedParens) {
            parenStack.shift();
        }
    });

    // if parenStack is empty, it is balanced
    return parenStack.length === 0;
}

/**
 * Returns the numerical value of number strings
 * @param {string} numString
 * @returns {number}
 */
function getNumberValue(numString) {
    let numValue = parseFloat(numString);

    if (Number.isNaN(numValue)) {
        // It's not a number at all
        return undefined;
    }

    // we know it is a number for sure
    return numValue;
}

/**
 * Counts the number of decimal points in the number string
 * This method operates on the string form of the input as recorded in the input
 *
 * Also, parseFloat handles this silently. I don't want that, the policy is to
 * make noise if you find something inconsistent
 * @param {string} number
 * @returns {bool} - whether it is a valid decimal number.
 */
function isValidDecimal(number) {
    const dotCount = number
        .split("")
        .reduce((numberOfDecimals, currentElement) => {
            if (currentElement !== ".") {
                return numberOfDecimals;
            }

            return [...numberOfDecimals, currentElement];
        }, []).length;

    return dotCount === 0 || dotCount === 1;
}

// NOTE: But really though, I should be using good Regular
// Expressions to be doing this for me. Help? Please?

/**
 * Returns the variable names and their specific values
 * This method will mainly be used by let bindings
 * @param {string} statement
 * @returns {string[]} bindings - variable's along with their
 * values/init?. If a falsy value is retuned then, it should
 * be reported as an error
 */

function markBindings(statement) {
    // basically all we need to do is,
    // locate the white spaces between
    // the names and the expressions
    // that we must evaluate

    if (typeof statement !== "string") {
        return undefined;
    }

    let bindings = [],
        insideExp = false,
        currentValue = "",
        pointer = 0,
        numberOfBounds = 0;

    const statementSplits = statement.split(""),
        statementLen = statementSplits.length;

    const CHARS = /[a-zA-Z]/,
        WHITESPACE = /\s/;

    while (pointer < statementLen) {
        const currentChar = statementSplits[pointer];

        if (pointer === 0 && !CHARS.test(currentChar)) {
            return undefined;
        }

        if (insideExp) {
            if (currentChar === '"') {
                pointer++;

                while (statementSplits[pointer] !== '"') {
                    currentValue += statementSplits[pointer++];
                }
            } else if (
                currentChar === "'" ||
                currentChar === "(" ||
                currentChar === "#" ||
                currentChar === "{"
            ) {
                if (currentChar === "'" || currentChar === "#") {
                    pointer += 2;

                    if (currentChar === "'") {
                        currentValue += "'(";
                    } else {
                        currentValue += "#{";
                    }
                } else {
                    pointer++;
                    currentValue += currentChar;
                }

                numberOfBounds = 1;

                while (true) {
                    if (
                        statementSplits[pointer] === "(" ||
                        statementSplits[pointer] === "{"
                    ) {
                        numberOfBounds++;
                    }

                    if (
                        statementSplits[pointer] === ")" ||
                        statementSplits[pointer] === "}"
                    ) {
                        numberOfBounds--;

                        if (numberOfBounds === 0) {
                            if (
                                currentValue[0] === "(" ||
                                currentValue[1] === "("
                            ) {
                                currentValue += ")";
                            } else {
                                currentValue += "}";
                            }

                            break;
                        }
                    }

                    currentValue += statementSplits[pointer++];
                }
            } else {
                // because it is an unrecognised expr. character
                return undefined;
            }

            insideExp = false;

            bindings.push(currentValue);

            currentValue = "";

            pointer += 2;
            continue;
        }

        if (CHARS.test(currentChar)) {
            currentValue += currentChar;

            pointer++;
            continue;
        }

        if (WHITESPACE.test(currentChar)) {
            bindings.push(currentValue);

            currentValue = "";

            insideExp = true;

            pointer++;
            continue;
        }
    }

    return bindings;
}

module.exports = {
    checkParentheses,
    getNumberValue,
    isValidDecimal,
    markBindings,
};
