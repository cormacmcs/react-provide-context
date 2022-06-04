# react-provide-context
Simple lightweight context based react state management with typescript support

**CreateContext:**

Use CreateContext to get a provider and reducer/state hooks

CreateContext requires initialState and a reducer as props.

```  
import CreateContext from 'react-provide-context';

type State = { shiny: boolean; dark: boolean };

const initialState: State = { shiny: false, dark: false };

function styleReducer(state: State, action): State {
  switch (action.type) {
    case 'toggleShiny': {
      return { ...state, shiny: !state.shiny };
    }
    case 'toggleDark': {
      return { ...state, dark: !state.dark };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

const Context = CreateContext(initialState, styleReducer);

export const StyleProvider = Context.ContextProvider;
export const useStyleState = Context.useContextState;
export const useStyleDispatch = Context.useContextDispatch;
export const useStyle = Context.useContextReducer;

``` 
The returned context has properties:

* **ContextProvider**: Provider that will wrap the components context  hooks will be usable in
* **useContextState**: Current state of the provided context
* **useContextDispatch**: Function used to dispatch updates
* **useContextReducer**: Both dispatch and state in tuple form like useReducer

CreateContext can also be provided an actions object

``` 
import CreateContext from 'react-provide-context';

type State = { pageA: number; pageB: string };

const initialState: State = { pageA: 0, pageB: '0' };

function pageReducer(state: State, action): State {
  switch (action.type) {
    case 'setPageA': {
      return { ...state, pageA: action.value };
    }
    case 'setPageB': {
      return { ...state, pageB: action.value };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

const actions = (dispatch) => ({
  setA: (value: number) => dispatch({ type: 'setPageA', value }),
  setB: (value: string) => dispatch({ type: 'setPageB', value }),
});

const Context = CreateContext(initialState, pageReducer, actions);


export const usePageActions = Context.useContextActions;
export const usePage = Context.useContext;
``` 

When actions are provided the returned context has additional properties:

* **useContextActions**: An object of predefined functions used to update the context state
* **useContext**:  Current state of the provided context plus actions above in tuple form

useContext example using usePage hook created above

``` 
  const [{ pageB }, { setPageB }] = usePage();
``` 

**useMetaReducer:**

useMetaReducer can be used to add MetaReducers to all reducer used by CreateContext
useMetaReducer takes CreateContext and an array of MetaReducers and returns a new CreateContext function

``` 
import CreateContext, { useMetaReducers } from '@app/react-provide-context';

const logger = (reducer) => {
  return (state, action) => {
    const nextState = reducer(state, action);
    console.group(action.type);
    console.log(`%c prev state`, `color: #DD4533; font-weight: bold`, state);
    console.log(`%c action`, `color: #9D457A; font-weight: bold`, action);
    console.log(`%c next state`, `color: #5BBC34; font-weight: bold`, nextState);
    console.groupEnd();
    return nextState;
  };
};

export default useMetaReducers(CreateContext, [logger]);
``` 
