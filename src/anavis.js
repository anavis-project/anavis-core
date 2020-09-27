import Workspace from './workspace';
import React, { useReducer } from 'react';
import { initialState, reducer } from './global-state';

export default function Anavis() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <React.StrictMode>
      <div>Anavis Tests</div>
      <div style={{ display: 'grid', margin: '100px auto', width: '90vw', minHeight: '500px', border: '1px solid gray', backgroundColor: '#fff' }}>
        <Workspace works={state.works} selection={state.selection} mouseInfo={state.mouseInfo} dispatch={dispatch} />
      </div>
      <div style={{ margin: '100px auto', width: '90vw', minHeight: '200px', border: '1px solid gray', backgroundColor: '#fff', fontSize: '9px' }}>
        <pre>
          <code>
            {JSON.stringify(state, null, 2)}
          </code>
        </pre>
      </div>
    </React.StrictMode>
  )
}
