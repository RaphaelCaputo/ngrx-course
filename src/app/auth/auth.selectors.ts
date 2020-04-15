import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './reducers';

// Feature Selector
// Used for autocompletion and a type safe aproache
export const selectAuthState = createFeatureSelector<AuthState>('auth')

// Create Selector is a mapping function that has memory
// as long as our input state object does not change
// the output is not going to be recalculated
export const isLoggedIn = createSelector(
    // state => state['auth'], Using Mapping functions
    selectAuthState, // Using Feature selectors
    auth => !!auth.user // Projector function that is calculated by the mapping function
)

// Can be used to combine multiple selectors together
export const isLoggedOut = createSelector(
    isLoggedIn, // since it is a mapping function
    loggedIn => !loggedIn
)