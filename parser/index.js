// The Parser for lisp-y

// NOTE: I just realized that this is a terrible parser

const parserUtils = require("./util.js");

// Required Regular Expressions
const OPEN_PARENS = /\(/;
const CLOSE_PARENS = /\)/;
const WHITESPACE = /\s/;
const CHARS = /[a-zA-Z]/;
const NUMBERS = /[+-]?[0-9]/;
const STRINGS = /\w/;
const DOUBLE_QUOTE = /"/;
const OPEN_BRACKET = /{/;
const SINGLE_QUOTE = /'/;
const COMMA = ",";
const COMMA_WHITESPACE = ", ";

// valid token types
const validTokens = {
    PARENS: "parens",
    NAME: "name",
    NUMBER: "number",
    STRING: "string",
    MAP: "map",
};

// May not be required since the second-phase of the current parser can be modified
// to also check for the complete-ness of the expression

/**
 * Converts the expression to an object based on it's type
 * @param {string} expr - a valid lisp expression
 * @returns {Object[]} - a list of objects that has detials like the value and type of each token
 */
function lispParserStep1(expr) {
    // An effort to not mutate the input directly
    const exprCopy = expr;
    const exprLength = exprCopy.length;

    let cursor = 0;
    let step1Result = [];

    while (cursor < exprLength) {
        // ignore whitespaces & end parentheses
        if (WHITESPACE.test(exprCopy[cursor])) {
            cursor++;
            continue;
        }

        // check if it is an opening parentheses or closed parentheses
        // it will serve as a marker in the next
        // step of the parser
        if (
            OPEN_PARENS.test(exprCopy[cursor]) ||
            CLOSE_PARENS.test(exprCopy[cursor])
        ) {
            step1Result.push({
                type: "parens",
                value: exprCopy[cursor],
            });

            cursor++;
            continue;
        }

        if (CHARS.test(exprCopy[cursor])) {
            let value = "";

            while (CHARS.test(exprCopy[cursor])) {
                value += exprCopy[cursor];
                cursor++;
            }

            step1Result.push({
                type: "name",
                value,
            });

            continue;
        }

        // TODO: abstract this into a method to get similar kind of values,
        // where you can include function to help format the value to the
        // required format

        // added or condition to support negative numbers too
        if (NUMBERS.test(exprCopy[cursor]) || exprCopy[cursor] === "-") {
            let value = "";
            let isNegative = false;

            if (exprCopy[cursor] === "-") {
                isNegative = true;
                // move beyond the negative sign
                cursor++;
            }

            while (NUMBERS.test(exprCopy[cursor])) {
                value += exprCopy[cursor];
                cursor++;
            }

            let numericalValue = parserUtils.getNumberValue(value);

            if (isNegative) {
                numericalValue *= -1;
            }

            step1Result.push({
                type: "number",
                value: numericalValue,
            });

            continue;
        }

        // Identifying String tokens

        if (DOUBLE_QUOTE.test(exprCopy[cursor])) {
            // move cursor beyond the quote
            cursor++;
            let value = "";

            while (!DOUBLE_QUOTE.test(exprCopy[cursor])) {
                value += expr[cursor];
                cursor++;
            }

            // move beyond the ending quote
            cursor++;

            step1Result.push({
                type: "string",
                value,
            });

            continue;
        }

        if (OPEN_BRACKET.test(exprCopy[cursor])) {
            // move the cursor beyond the {
            cursor++;

            if (exprCopy[cursor] === "}") {
                step1Result.push({
                    type: "map",
                    value: {},
                });

                cursor++;

                continue;
            }

            let mapValues = "";

            // accumulate all values of the map until I
            // get to the end of the map
            while (exprCopy[cursor] !== "}") {
                mapValues += exprCopy[cursor];
                cursor++;
            }

            // now, we can split by whitespace or commas, which
            // ever one that works out and see if there are an
            // even number of values
            let keyValueSplits;

            if (mapValues.indexOf(COMMA) !== -1) {
                keyValueSplits = mapValues.split(", ");
            } else {
                keyValueSplits = mapValues.split(" ");
            }

            if (keyValueSplits.length % 2 !== 0) {
                throw new Error("Syntax error");
            }

            let objValue = {};
            let keys = [],
                values = [];

            keyValueSplits.forEach((objVal, index) => {
                // even indices are the keys
                if (index % 2 === 0) {
                    // keys have to either begin with either : or "
                    if (objVal[0] === ":") {
                        const [colon, ...restOfKey] = objVal;
                        keys.push(restOfKey.join(""));
                    } else if (objVal[0] === '"') {
                        const keySplit = objVal.split('"');
                        const keyVal = keySplit[1];

                        keys.push(keyVal);
                    }
                }

                // odd indices are the values
                if (index % 2 !== 0) {
                    // TODO: Check if this a valid data-type
                    values.push(objVal);
                }
            });

            keys.forEach((key, index) => {
                // check for value type and then do attach the values
                // possibly a try-catch with parseInt
                const currentValue = values[index];

                const numberValue = parserUtils.getNumberValue(currentValue);

                if (typeof numberValue !== "number") {
                    // it is a string
                    const valSplit = currentValue.split('"');
                    objValue[key] = valSplit[1];
                } else {
                    // it is a number
                    objValue[key] = numberValue;
                }
            });

            step1Result.push({
                type: "map",
                value: objValue,
            });

            // move beyond the last }
            cursor++;
            continue;
        }

        // Support for quoted lists
        if (SINGLE_QUOTE.test(exprCopy[cursor])) {
            let listContent = "(list ";

            // Move past the (
            cursor += 2;

            // get all text within the brackets
            while (!CLOSE_PARENS.test(exprCopy[cursor])) {
                listContent += exprCopy[cursor++];
            }

            // These are the values within the brackets
            // splitting on whitespace. I also realize
            // that commas and a combination of commas
            // and spaces can be used. So I thought I could
            // resolve this issue by recursively going through
            // the list

            listContent += ")";

            const listValue = lispParserStep1(listContent);

            // move cursor past the )
            cursor++;

            // append the values of the parsed values to the current
            // step1Result since it'll just be like using the "list"
            // keyword
            step1Result = [...step1Result, ...listValue];
        }
    }

    return step1Result;
}

/**
 * Produces a list of a function with it's arguments, which in our case might be other such lists
 * @param {Object[]} flatList - list of tokens
 * @param {number} cursor - the index on the flatlist from which we traversing the list
 * @returns {(string|number|Object)[][]} - something that closely resembles an AST for a lisp
 */
function lispParserStep2(flatList) {
    let resultList = [];

    // starting from index 0
    let pointer = 0;

    const flatListCopy = flatList;

    // a helper for traversing the parsed list and returning an AST for 1 s-exp
    function recursiveTraverse(list) {
        const listCopy = list;
        const listLen = list.length;
        const nestedList = [];

        // NOTE: Perhaps use better condition or use something like .filter or .some

        while (pointer < listLen) {
            if (
                listCopy[pointer].type === validTokens.PARENS &&
                listCopy[pointer].value !== ")"
            ) {
                //get pointer beyond the "("
                pointer++;

                nestedList.push(recursiveTraverse(listCopy));

                // get pointer beyond the current s-exp
                pointer++;

                continue;
            } else if (
                listCopy[pointer].type === validTokens.NAME ||
                listCopy[pointer].type === validTokens.NUMBER ||
                listCopy[pointer].type === validTokens.STRING ||
                listCopy[pointer].type === validTokens.MAP
            ) {
                // gives the output that is expected
                nestedList.push(listCopy[pointer].value);

                // preserves the details that were extracted in the previous step
                // nestedList.push(listCopy[pointer]);

                pointer++;
            } else if (listCopy[pointer].value === ")") {
                break;
            }
        }

        return nestedList;
    }

    resultList = recursiveTraverse(flatListCopy);

    return resultList;
}

/**
 * The main lisp parser method that can be exported to produce an AST for a valid
 * lisp-y expression.
 * @param {string} expr - a lisp-y expression
 * @returns {(string|number)[][]} - something that closely represents an AST
 */
function lispParser(expr = "") {
    if (expr === "") {
        // we can ignore the empty string
        return [];
    }

    if (expr === "()") {
        // we can ignore the empty expression too
        return [];
    }

    // simple check to see if the last char of the expression is a closing parentheses
    const exprLength = expr.length;

    // first character of the current input
    const firstChar = expr[0];

    // Check for errors in input early and stop the
    // execution of the function as early as possible
    if (!(OPEN_PARENS.test(firstChar) || SINGLE_QUOTE.test(firstChar))) {
        throw new Error("Invalid Expression!");
    }

    // check if the parentheses are balanced
    if (!parserUtils.checkParentheses(expr)) {
        throw new Error("Parentheses are not balanced");
    }

    // now, that the parens are balanced, do further parsing

    const flatListOfTokens = lispParserStep1(expr);
    const finalParsedOutput = lispParserStep2(flatListOfTokens);

    // the parsed output returns a list and hence we can return this.
    return finalParsedOutput[0];
}

module.exports = lispParser;
