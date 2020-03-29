const assert = require("assert");
const parser = require("../parser");
const eval = require("../eval");
const parserUtils = require("../parser/util");

const statement = "(add 1 2 (multiply 43.12 13))";
const validAST = [
    { type: "symbol", value: "add" },
    { type: "number", value: 1 },
    { type: "number", value: 2 },
    [
        { type: "symbol", value: "multiply" },
        { type: "number", value: 43.12 },
        { type: "number", value: 13 },
    ],
];
const statementResult = 563.56;
const integerNum = "901";
const floatNum = "23.25124";

// Test for Parser for valid AST generation
describe("Parser", function() {
    describe("AST Generation", function() {
        it("should generate the valid AST", function() {
            const parserResult = parser(statement);
            assert.deepEqual(parserResult, validAST);
        });
    });
});

// Test for Evaluate function
describe("Eval", function() {
    describe("Correct evaluation of the AST", function() {
        it("should generate the result as 563.56", function() {
            const evalResult = eval(validAST);
            assert.equal(evalResult, statementResult);
        });
    });
});

// Tests for the utility functions used by the parser

// Test for the parentheses checker
describe("Check Parentheses Utility", function() {
    it("should succeed if parentheses in the expression are balanced", function() {
        const parenthesesCheck = parserUtils.checkParentheses(statement);
        assert.equal(parenthesesCheck, true);
    });
});

// Test for the number value provider
describe("Numerical value for number token", function() {
    it("should succeed if it provides the correct integer or float values", function() {
        const integerValue = parserUtils.getNumberValue(integerNum);
        const floatValue = parserUtils.getNumberValue(floatNum);
        assert.equal(integerValue, 901);
        assert.equal(floatValue, 23.25124);
    });
});

// Test for valid decimal number
describe("The number of decimal points in a number can be at most 1", function() {
    it("should succeed if the number of decimal points are at most 1", function() {
        const isValidNumber = parserUtils.isValidDecimal(floatNum);
        assert.equal(isValidNumber, true);
    });
});
