// This file contains the main reducers that will be used
// for performing updates on the store.

// The main "dispatch" actions are being fetched from a different file

const globalActions = require("./dispatch").actions;

/**
 * The main reducer being used for the store
 * @param {Object} state
 * @param {string} action
 * @returns {Object} - The updated state or the current state
 */
const storeReducer = (state = {}, action) => {
    let name, value;

    // Handled for the initial call to dispatch
    if (!action.data) {
        return state;
    }

    // Check if a name is provided
    if (action.data.name) {
        name = action.data.name;
    }

    // Check if a value is provided
    if (action.data.value) {
        value = action.data.value;
    }

    // If only a name is provided, then it is a delete operation
    // If both a name and value are provided through action.data
    // then it can be either creation of the variable, or if it
    // is already present then it is an update operation

    switch (action.type) {
        case globalActions.VAR_UPDATE:
            return { ...state, [name]: value };
        case globalActions.VAR_DELETE:
            return Object.keys(state).reduce((updatedState, currentKey) => {
                if (currentKey === name) {
                    return updatedState;
                }

                return { ...updatedState, [currentKey]: state[currentKey] };
            }, {});
        default:
            return state;
    }
};

module.exports = storeReducer;
