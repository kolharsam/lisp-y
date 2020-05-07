// The Parser for lisp-y

// NOTE: I just realized that this is a terrible parser

const parserUtils = require("./util.js");
const showParserError = require("../error").showParseError;
const { evalString, toJS } = require("@borkdude/sci");

// Required Regular Expressions
const OPEN_PARENS = /\(/;
const CLOSE_PARENS = /\)/;
const WHITESPACE = /\s/;
const CHARS = /[a-zA-Z]/;
const NUMBERS = /[0-9]/;
const DOUBLE_QUOTE = /"/;
const OPEN_BRACKET = /{/;
const CLOSE_BRACKET = /}/;
const SINGLE_QUOTE = /'/;
const COMMA = /,/;
const OPEN_SQ_BRACKET = /\[/;
const CLOSE_SQ_BRACKET = /\]/;
const HASH = /#/;

// I was so hopeful of using this, but yeah, the nested maps
// thing has a lot of cases to be handled and can be huge reason
// bugs that might occur while processing maps
// const KEYS = /:?[a-zA-Z]+/g;

// valid token types
const validTokens = {
    PARENS: "parens",
    SYMBOL: "symbol",
    NUMBER: "number",
    STRING: "string",
    MAP: "map",
    LOCAL_BINDINGS: "local_bindings",
    EXPRESSION: "expression",
    SET: "set",
    BOOLEAN: "boolean",
};

// May not be required since the second-phase of the current parser can be modified
// to also check for the complete-ness of the expression

/**
 * Converts the expression to an object based on it's type
 * @param {string} expr - a valid lisp expression
 * @returns {Object[]} - a list of objects that has details like the value and type of each token
 */
function lispParserStep1(expr) {
    // An effort to not mutate the input directly
    const exprCopy = expr;
    const exprLength = exprCopy.length;

    let cursor = 0;
    let step1Result = [];

    while (cursor < exprLength) {
        // ignore whitespaces & end parentheses
        if (WHITESPACE.test(exprCopy[cursor]) || COMMA.test(exprCopy[cursor])) {
            cursor++;
            continue;
        }

        // check if it is an opening parentheses or closed parentheses
        // it will serve as a marker in the next step of the parser
        if (
            OPEN_PARENS.test(exprCopy[cursor]) ||
            CLOSE_PARENS.test(exprCopy[cursor])
        ) {
            step1Result.push({
                type: validTokens.PARENS,
                value: exprCopy[cursor],
            });

            cursor++;
            continue;
        }

        if (CHARS.test(exprCopy[cursor])) {
            let value = "";

            // add extra condition for the case when only symbols are
            // being entered on the REPL
            while (CHARS.test(exprCopy[cursor]) && cursor !== exprLength) {
                value += exprCopy[cursor++];
            }

            if (value === "true" || value === "false") {
                const val = value === "true" ? true : false;

                step1Result.push({
                    type: validTokens.BOOLEAN,
                    value: val,
                });

                continue;
            }

            step1Result.push({
                type: validTokens.SYMBOL,
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

            while (NUMBERS.test(exprCopy[cursor]) || exprCopy[cursor] === ".") {
                value += exprCopy[cursor];
                cursor++;
            }

            // check if it contains 1 or 0 decimal points
            if (!parserUtils.isValidDecimal(value)) {
                showParserError();
                return;
            }

            let numericalValue = parserUtils.getNumberValue(value);

            if (isNegative) {
                numericalValue *= -1;
            }

            step1Result.push({
                type: validTokens.NUMBER,
                value: numericalValue,
            });

            continue;
        }

        // String tokens
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
                type: validTokens.STRING,
                value,
            });

            continue;
        }

        // Parser method for maps
        if (OPEN_BRACKET.test(exprCopy[cursor])) {
            if (CLOSE_BRACKET.test(exprCopy[cursor])) {
                step1Result.push({
                    type: validTokens.MAP,
                    value: {},
                });

                cursor++;

                continue;
            }

            let mapString = exprCopy[cursor],
                parenCounter = 1;

            cursor++;

            while (parenCounter !== 0) {
                const currentChar = exprCopy[cursor];

                if (currentChar === "{") {
                    parenCounter++;
                }

                mapString += currentChar;

                if (currentChar === "}") {
                    parenCounter--;
                }

                cursor++;
            }

            // Use borkdude's sci for this - feels like cheating
            // but I will build a method of my own to be able to
            // parse all sorts of maps.

            // Eitherways - many thanks @borkdude

            const evalMap = evalString(mapString);

            const jsValue = toJS(evalMap);

            step1Result.push({
                type: validTokens.MAP,
                value: jsValue,
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

            continue;
        }

        // support for parsing let bindings
        if (OPEN_SQ_BRACKET.test(exprCopy[cursor])) {
            let bindingsStr = "";

            // move past the [
            cursor++;

            while (!CLOSE_SQ_BRACKET.test(exprCopy[cursor])) {
                bindingsStr += exprCopy[cursor++];
            }

            const bindingsArr = parserUtils.markBindings(bindingsStr);

            if (!bindingsArr) {
                showParserError();
                return;
            }

            const numberOfBindings = bindingsArr.length;

            if (numberOfBindings % 2) {
                showParserError();
                return;
            }

            let bindingsParsedVals = [];

            bindingsArr.forEach((binding, index) => {
                if (index % 2) {
                    if (
                        binding[0] === "'" ||
                        binding[0] === "(" ||
                        binding[0] === "#" ||
                        binding[0] === "{"
                    ) {
                        // lists or expressions
                        const parserOutput = lispParser(binding);
                        bindingsParsedVals.push({
                            type: "expression",
                            value: parserOutput,
                        });
                    } else {
                        // strings
                        bindingsParsedVals.push({
                            type: "string",
                            value: binding,
                        });
                    }
                } else {
                    // name
                    bindingsParsedVals.push({ type: "name", value: binding });
                }
            });

            // move cursor past ]
            cursor += 2;

            step1Result.push({
                type: validTokens.LOCAL_BINDINGS,
                value: bindingsParsedVals,
            });

            continue;
        }

        if (HASH.test(exprCopy[cursor])) {
            let setContent = "(set ";
            // move cursor past #{
            cursor += 2;

            while (exprCopy[cursor] !== "}") {
                setContent += exprCopy[cursor++];
            }

            setContent += ")";

            // process this similar to a list is processed
            const setValue = lispParserStep1(setContent);

            // move cursor past }
            cursor++;

            // append the result of the parsed set value
            step1Result = [...step1Result, ...setValue];

            continue;
        }
    }

    return step1Result;
}

/**
 * Produces a list of a function with it's arguments
 * which in our case might be other such lists
 * @param {Object[]} flatList - list of tokens
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
                listCopy[pointer].type === validTokens.SYMBOL ||
                listCopy[pointer].type === validTokens.NUMBER ||
                listCopy[pointer].type === validTokens.STRING ||
                listCopy[pointer].type === validTokens.MAP ||
                listCopy[pointer].type === validTokens.LOCAL_BINDINGS ||
                listCopy[pointer].type === validTokens.SET ||
                listCopy[pointer].type === validTokens.BOOLEAN
            ) {
                // using the full data provided from Step 1 parser
                nestedList.push(listCopy[pointer]);
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

    // check if the parentheses are balanced
    if (!parserUtils.checkParentheses(expr)) {
        showParserError();
        return;
    }

    // now, that the parens are balanced, do further parsing

    const flatListOfTokens = lispParserStep1(expr);

    const finalParsedOutput = lispParserStep2(flatListOfTokens);

    // the parsed output returns a list and hence we can return this.
    return finalParsedOutput[0];
}

module.exports = lispParser;
