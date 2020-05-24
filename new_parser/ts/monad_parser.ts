/**
 * HI
 * 
 * We'll be learning about Monadic Parsers or Parser combinators
 * 
 * SO HOW WILL WE GET THERE?
 * 
 * Of course, by making a parser!
 * 
 * We'll be making a lisp parser (Yes! my favorite kinda syntax now)
 * 
 * parse("(add 1 2 (add 1 2 5))");
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

type Parser<T> = (ctx: Context) => Result<T>

type Context = Readonly<{
    text: string,   // input str
    index: number   // position where it is at
}>;

type Result<T> = Success<T> | Failure;

type Success<T> = Readonly<{
    success: true;
    value: T;
    ctx: Context;
}>;

type Failure = Readonly<{
    success: false;
    expected: string;
    ctx: Context;
}>;

function success<T>(ctx: Context, value: T): Success<T> {
    return { success: true, value, ctx };
}

function failure (ctx: Context, expected: string) {
    return { success: false, expected, ctx };
}
