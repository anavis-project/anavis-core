import './anavis.scss';
import Workspace from './workspace';
import { SET_OPTIONS } from './actions';
import React, { useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async';
import { initialState, reducer, asyncActionHandlers } from './global-state';

export default function Anavis({ options }) {
  const [state, dispatch] = useReducerAsync(reducer, initialState, asyncActionHandlers);

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
            documents={state.documents}
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
