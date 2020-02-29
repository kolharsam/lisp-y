# lisp-y

```
(apply str (interpose " " (list "My" "attempt" "at" "making" "a" "lisp")))

// Output: "My attempt at making a lisp"
```

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

There's post by *the* [Norvig](http://norvig.com/lispy.html) in which he creates a lisp interpreter using Python. It's only a coincidence that the one I'm building is also known as ***lispy***. But yeah, check the article anyway if you're not interested in this repo.
