"use strict";
/**
 * HI
 *
 * We'll be learning about Monadic Parsers or Parser combinators
 *
 * SO HOW WILL WE GET THERE?
 *
 * Of course, by making a parser!
 *
 
 *
 * should yield:
 *
//   "target": "add",
//   "args": [
       1,
       2
//     {
//       "target": "Bar",
//       "args": [
//         1,
//         2,
//         3
//       ]
//     }
//   ]
// }

The concept that these kind of parsers use is known Recursive descent.
Meaning it will have backtracking and contexts out of the box and all of that
without having to explicitly manage a stack!

I am also skipping the lexer part. Not necessary at the moment
 */
var __assign =
    (this && this.__assign) ||
    function() {
        __assign =
            Object.assign ||
            function(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                        if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                }
                return t;
            };
        return __assign.apply(this, arguments);
    };
var __spreadArrays =
    (this && this.__spreadArrays) ||
    function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
function success(ctx, value) {
    return { success: true, value: value, ctx: ctx };
}
function failure(ctx, expected) {
    return { success: false, expected: expected, ctx: ctx };
}
// match an exact string or fail
function str(match) {
    return function(ctx) {
        var endIdx = ctx.index + match.length;
        if (ctx.text.substring(ctx.index, endIdx) === match) {
            return success(
                __assign(__assign({}, ctx), { index: endIdx }),
                match
            );
        } else {
            return failure(ctx, match);
        }
    };
}
// match a regexp or fail
function regex(re, expected) {
    return function(ctx) {
        re.lastIndex = ctx.index;
        var res = re.exec(ctx.text);
        if (res && res.index === ctx.index) {
            return success(
                __assign(__assign({}, ctx), {
                    index: ctx.index + res[0].length,
                }),
                res[0]
            );
        } else {
            return failure(ctx, expected);
        }
    };
}
// try each matcher in order, starting from the same point in the input. return the first one that succeeds.
// or return the failure that got furthest in the input string.
// which failure to return is a matter of taste, we prefer the furthest failure because.
// it tends be the most useful / complete error message.
function any(parsers) {
    return function(ctx) {
        var furthestRes = null;
        for (var _i = 0, parsers_1 = parsers; _i < parsers_1.length; _i++) {
            var parser = parsers_1[_i];
            var res = parser(ctx);
            if (res.success) return res;
            if (!furthestRes || furthestRes.ctx.index < res.ctx.index)
                furthestRes = res;
        }
        return furthestRes;
    };
}
// match a parser, or succeed with null
function optional(parser) {
    return any([
        parser,
        function(ctx) {
            return success(ctx, null);
        },
    ]);
}
// look for 0 or more of something, until we can't parse any more. note that this function never fails, it will instead succeed with an empty array.
function many(parser) {
    return function(ctx) {
        var values = [];
        var nextCtx = ctx;
        while (true) {
            var res = parser(nextCtx);
            if (!res.success) break;
            values.push(res.value);
            nextCtx = res.ctx;
        }
        return success(nextCtx, values);
    };
}
// look for an exact sequence of parsers, or fail
function sequence(parsers) {
    return function(ctx) {
        var values = [];
        var nextCtx = ctx;
        for (var _i = 0, parsers_2 = parsers; _i < parsers_2.length; _i++) {
            var parser = parsers_2[_i];
            var res = parser(nextCtx);
            if (!res.success) return res;
            values.push(res.value);
            nextCtx = res.ctx;
        }
        return success(nextCtx, values);
    };
}
// a convenience method that will map a Success to callback, to let us do common things like build AST nodes from input strings.
function map(parser, fn) {
    return function(ctx) {
        var res = parser(ctx);
        return res.success ? success(res.ctx, fn(res.value)) : res;
    };
}
// our top level parsing function that takes care of creating a `Ctx`, and unboxing the final AST (or throwing)
function parse(text) {
    var res = expr({ text: text, index: 0 });
    if (res.success) return res.value;
    throw "Parse error, expected " + res.expected + " at char " + res.ctx.index;
}
// expr = call | numberLiteral
function expr(ctx) {
    return any([call, numberLiteral])(ctx);
}
// our regexp to match identifiers
var ident = regex(/[a-zA-Z][a-zA-Z0-9]*/g, "identifier");
// a regexp parser to match a number string
var numberLiteral = map(
    regex(/[+\-]?[0-9]+(\.[0-9]*)?/g, "number"),
    // which we map to javascript's built in `parseFloat` method
    parseFloat
);
// trailingArg = ',' arg
var trailingArg = map(
    sequence([str(","), expr]),
    // we map to this function that throws away the leading comma, returning only the argument expression
    function(_a) {
        var _comma = _a[0],
            argExpr = _a[1];
        return argExpr;
    }
);
// args = expr ( trailingArg ) *
var args = map(
    sequence([expr, many(trailingArg)]),
    // we combine the first argument and the trailing arguments into a single array
    function(_a) {
        var arg1 = _a[0],
            rest = _a[1];
        return __spreadArrays([arg1], rest);
    }
);
// call = ident "(" args ")"
var call = map(
    sequence([ident, str("("), optional(args), str(")")]),
    // we throw away the lparen and rparen, and use the function name and arguments to build a Call AST node.
    function(_a) {
        var fnName = _a[0],
            _lparen = _a[1],
            argList = _a[2],
            _rparen = _a[3];
        return {
            target: fnName,
            args: argList || [],
        };
    }
);
function example(code) {
    console.log(JSON.stringify(parse(code), null, 2));
}
example("1");
example("Foo()");
example("Foo(Bar())");
example("Foo(Bar(1,2,3))");
