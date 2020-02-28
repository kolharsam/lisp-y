.DEFAULT_GOAL=help

# run `help` to see all commands that are supported by this Makefile
help: ## display help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "     \033[36m%-10s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

check-node:     ## check if node is present, if errored then install node.
	node --version

run:         	## run the lisp-y REPL
	node index

run-prettier:   ## runs prettier across all js files within the repo
	./node_modules/.bin/prettier --write ./**/*.js
