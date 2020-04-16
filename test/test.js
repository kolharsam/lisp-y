const assert = require("assert");
const parser = require("../parser");
const eval = require("../eval");
const parserUtils = require("../parser/util");
const {
    statement,
    statementResult,
    validAST,
    integerNum,
    floatNum,
} = require("./input");

// Test for Parser for valid AST generation
describe("Parser", function() {
    describe("#parser", function() {
        it("should generate the valid AST", function() {
            const parserResult = parser(statement);
            assert.deepEqual(parserResult, validAST);
        });
    });
});

// Test for Evaluate function
describe("Evalute", function() {
    describe("#eval", function() {
        it("should generate the result as 563.56", function() {
            const evalResult = eval(validAST);
            assert.equal(evalResult, statementResult);
        });
    });
});

// Tests for the utility functions used by the parser

describe("Parser Utilities", function() {
    // Test for the parentheses checker
    describe("#checkParentheses", function() {
        it("should succeed if parentheses in the expression are balanced", function() {
            const parenthesesCheck = parserUtils.checkParentheses(statement);
            assert.equal(parenthesesCheck, true);
        });
    });

    // Test for the number value provider
    describe("#getNumberValue", function() {
        it("should succeed if it provides the correct integer or float values", function() {
            const integerValue = parserUtils.getNumberValue(integerNum);
            const floatValue = parserUtils.getNumberValue(floatNum);
            assert.equal(integerValue, 901);
            assert.equal(floatValue, 23.25124);
        });
    });

    // Test for valid decimal number
    describe("#isValidDecimal", function() {
        it("should succeed if the number of decimal points are at most 1", function() {
            const isValidNumber = parserUtils.isValidDecimal(floatNum);
            assert.equal(isValidNumber, true);
        });
    });
});
