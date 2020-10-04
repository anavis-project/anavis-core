import Workspace from './workspace';
import React, { useReducer } from 'react';
import { initialState, reducer } from './global-state';

export default function Anavis() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <React.StrictMode>
      <div style={{ display: 'grid', margin: '100px auto', width: '90vw', height: '90vh', gridTemplateRows: '1fr', gridTemplateColumns: '400px 50px 1fr' }}>
        <div style={{ display: 'grid', gridRow: 1, gridColumn: 1, border: '1px solid gray', backgroundColor: '#fff', fontSize: '9px' }}>
          <pre>
            <code>
              {JSON.stringify(state, null, 2)}
            </code>
          </pre>
        </div>
        <div style={{ display: 'grid', gridRow: 1, gridColumn: 3, border: '1px solid gray', backgroundColor: '#fff' }}>
          <Workspace works={state.works} selection={state.selection} mouseInfo={state.mouseInfo} dispatch={dispatch} />
        </div>
      </div>
    </React.StrictMode>
  )
}
