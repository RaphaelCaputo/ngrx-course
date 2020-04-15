import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { routerReducer } from '@ngrx/router-store';

export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
    router: routerReducer
};

// Takes as Input Argument the reducers that need to be invoked
// after the metaReducer (reducer: ActionReducer<any>)
// This metaReducer is triggered before every regular reducer
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
    return (state, action) => {
        // Current state of the store
        console.log('state before: ', state);

        // Current action that was just dispatched
        console.log('action', action);

        // return the output the regular reducers of our app,
        // passing the return to the next reducer in the chain
        return reducer(state, action);
    }
}

// The order of the array matters
export const metaReducers: MetaReducer<AppState>[] = 
    !environment.production ? [logger] : [];
