import Work from './work';
import classnames from 'classnames';
import React, { useRef } from 'react';
import uiSettings from './ui-settings';
import { SELECT_PART } from './actions';
import findupAttribute from 'findup-attribute';
import { getAvuFactorFromWorkspaceWidth } from './avu-helper';

function findPossibleAction(event) {
  const element = findupAttribute(event.target, 'data-possible-action') || null;
  const action = element ? element.getAttribute('data-possible-action') : null;
  switch (action) {
    case SELECT_PART:
      return {
        action: SELECT_PART,
        workId: element.getAttribute('data-parent-work-id'),
        partId: element.getAttribute('data-part-id')
      };
    default:
      return null;
  }
}

export default function Workspace({ works, selection, mouseInfo, dispatch }) {
  const workspaceRef = useRef(null);

  const handleMouseEnterOrMove = event => {
    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    dispatch({
      type: 'set-mouse-info',
      info: {
        ...mouseInfo,
        lastWorkspacePosition: {
          x: event.clientX - workspaceRect.left,
          y: event.clientY - workspaceRect.top
        },
        avuFactor: getAvuFactorFromWorkspaceWidth(workspaceRect.width, uiSettings.workStripHorizontalMargin, uiSettings.workspaceSideBarWidth),
        possibleAction: mouseInfo.currentAction ? null : findPossibleAction(event)
      }
    });
  };

  const handleMouseLeave = event => {
    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    dispatch({
      type: 'set-mouse-info',
      info: {
        ...mouseInfo,
        lastWorkspacePosition: {
          x: event.clientX - workspaceRect.left,
          y: event.clientY - workspaceRect.top
        },
        avuFactor: getAvuFactorFromWorkspaceWidth(workspaceRect.width, uiSettings.workStripHorizontalMargin, uiSettings.workspaceSideBarWidth),
        possibleAction: null,
        currentAction: null
      }
    });
  };

  const handleMouseDown = event => {
    if (!mouseInfo.possibleAction) {
      return;
    }

    switch (mouseInfo.possibleAction.action) {
      case SELECT_PART:
        dispatch({ type: 'select-part', workId: mouseInfo.possibleAction.workId, partId: mouseInfo.possibleAction.partId });
        break;
      default:
        throw new Error('HÄ?');
    }
  };

  const classes = classnames(['Workspace', mouseInfo.possibleAction ? `u-${mouseInfo.possibleAction.action}` : null]);

  let selectionRect;
  if (selection.partIds.length) {
    const partElement = workspaceRef.current.querySelector(`[data-part-id="${selection.partIds[0]}"]`); // TODO MULTI-SELECT!
    selectionRect = {
      top: partElement.offsetTop - uiSettings.selectionRectanglePadding,
      left: partElement.offsetLeft - uiSettings.selectionRectanglePadding,
      width: partElement.offsetWidth + (2 * uiSettings.selectionRectanglePadding),
      height: partElement.offsetHeight + (2 * uiSettings.selectionRectanglePadding)
    }
  } else {
    selectionRect = null;
  }

  return (
    <div ref={workspaceRef} className={classes} style={{ position: 'relative' }} onMouseEnter={handleMouseEnterOrMove} onMouseMove={handleMouseEnterOrMove} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown}>
      <div className="Workspace-workLayer" style={{ padding: `${uiSettings.workStripVerticalMargin}px ${uiSettings.workStripHorizontalMargin}px` }}>
        <Work work={works[0]} />
      </div>
      <div className="Workspace-decoratorLayer" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
        {selectionRect && <div style={{ position: 'absolute', border: '1px solid #fa8c16', backgroundColor: '#ffa940', opacity: '0.4', ...selectionRect }} />}
      </div>
    </div>
  );
}
