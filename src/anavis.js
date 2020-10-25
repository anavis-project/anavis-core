import './anavis.scss';
import Workspace from './workspace';
import { SET_OPTIONS } from './actions';
import React, { useReducer, useEffect } from 'react';
import { initialState, reducer } from './global-state';

export default function Anavis({ options }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: SET_OPTIONS, options: options });
  }, [options, dispatch]);

  return (
    <React.StrictMode>
      <div className="Anavis">
        <div className="Anavis-debugArea">
          <pre>
            <code>
              {JSON.stringify(state, null, 2)}
            </code>
          </pre>
        </div>
        <div className="Anavis-workspaceArea">
          <Workspace
            works={state.works}
            selection={state.selection}
            mouseInfo={state.mouseInfo}
            workspaceInfo={state.workspaceInfo}
            options={state.options}
            dispatch={dispatch}
            />
        </div>
      </div>
    </React.StrictMode>
  )
}
