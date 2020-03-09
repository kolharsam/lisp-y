const repl = require("./repl");

const lispParser = require("./parser");
const evaluate = require("./eval");

const replConfig = {
    welcomeMsg: "Welcome to lisp-y!",
    details: "Use Ctrl-c(C-c) or .exit to leave the REPL.",
    name: "lisp-y",
    read: lispParser,
    evaluate,
    exitMsg: "Bye!",
};

repl(replConfig);
