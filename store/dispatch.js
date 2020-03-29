// All stuff related to the dispatch

// NOTE: A Global Variable in the context of the REPL
// are def bindings.

const VAR_UPDATE = "VAR_UPDATE";
const VAR_DELETE = "VAR_DELETE";

const actions = {
    VAR_UPDATE,
    VAR_DELETE,
};

/**
 * Action Creator for updating a variable.
 * The idea is to update the value if it is already present and create
 * the variable if it isn't.
 * @param {string} name - name of the variable
 * @param {(string|number|Object)} value - value provided/evaluated
 * @returns {Object} - the composed dispatch object
 */
function updateVar(name, value) {
    return {
        data: {
            name,
            value,
        },
        type: VAR_UPDATE,
    };
}

/**
 * Action Creator for deleting a variable
 * @param {string} name
 * @returns {Object}
 */
function deleteVar(name) {
    return {
        data: {
            name,
        },
        type: VAR_DELETE,
    };
}

exports.actions = actions;
exports.actionCreators = {
    updateVar,
    deleteVar,
};
