# lisp-y

```
(apply str (interpose " " (list "My" "attempt" "at" "making" "a" "lisp")))

// Output: "My attempt at making a lisp"
```

![lisp-y CI](https://github.com/kolharsam/lisp-y/workflows/lisp-y%20CI/badge.svg) [![Run on Repl.it](https://repl.it/badge/github/kolharsam/lisp-y)](https://repl.it/github/kolharsam/lisp-y) [![DeepScan grade](https://deepscan.io/api/teams/8319/projects/10466/branches/145810/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8319&pid=10466&bid=145810)

## Instructions to setup the repo

- Fork this respository
- Clone that forked repository
- Make sure you have `npm` and `node` installed. Install or upgrade v10 Node at the very least.
- Use `npm install` to install dependencies.
- Useful commands are present in the `Makefile` to `run`, `build` and `run-tests`.
- Make a Pull Request!

## Notes

As of now, only some methods have been added which can be evaluated. But yes, over time I hope to keep building on this.

The functions and most of the syntax is going to be based off of `Clojure`.
If you've not encountered it yet, have a look.

Use the [Makefile](https://github.com/kolharsam/lisp-y/blob/feature/eval-functions/Makefile) to run the REPL.

If you'd like then, leave some comments on anything that you feel can be bettered or changed.

#lispsforthewin

## Core Lib Functions

The list of functions that are supported are mentioned [here](https://github.com/kolharsam/lisp-y/blob/ce2c7fc7817037da676d9b7f76b7511c23257844/lib/index.js#L574)

More & more functions will be supported soon! You could also help build some if interested!

## Runtime Env.

```
    On my machine, I'm developing the program using
    Node: v10.16.0
```

#### Footnote

There's post by _the_ [Norvig](http://norvig.com/lispy.html) in which he creates a lisp interpreter using Python. It's only a coincidence that the one I'm building is also known as **_lispy_**. But yeah, check the article anyway if you're not interested in this repo.
