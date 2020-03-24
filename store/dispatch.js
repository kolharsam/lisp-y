// All stuff related to the dispatch

// NOTE: A Global Variable in the context of the REPL
// are def bindings.

const GLOBAL_VAR_UPDATE = "GLOBAL_VAR_UPDATE";
const GLOBAL_VAR_DELETE = "GLOBAL_VAR_DELETE";

const actions = {
    GLOBAL_VAR_UPDATE,
    GLOBAL_VAR_DELETE,
};

// let bindings will be dealt with in upcoming commits

/**
 * Action Creator for updating a global variable.
 * The idea is to update the value if it is already present and create
 * the variable if it isn't.
 * @param {string} name - name of the variable
 * @param {(string|number|Object)} value - value provided/evaluated
 * @returns {Object} - the composed dispatch object
 */
function updateGlobalVar(name, value) {
    return {
        data: {
            name,
            value,
        },
        type: GLOBAL_VAR_UPDATE,
    };
}

/**
 * Action Creator for deleting a global variable
 * @param {string} name
 * @returns {Object}
 */
function deleteGlobalVar(name) {
    return {
        data: {
            name,
        },
        type: GLOBAL_VAR_DELETE,
    };
}

exports.actions = actions;
exports.actionCreators = {
    updateGlobalVar,
    deleteGlobalVar,
};
