import Work from './work';
import classnames from 'classnames';
import uiSettings from './ui-settings';
import Dimensions from 'react-dimensions';
import findupAttribute from 'findup-attribute';
import React, { useRef, useEffect } from 'react';
import { getAvuFactorFromWorkspaceWidth, avu2Px } from './avu-helper';
import { SELECT_PART, DESELECT_ALL, SET_MOUSE_INFO, SET_WORKSPACE_INFO } from './actions';

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
    case DESELECT_ALL:
      return {
        action: DESELECT_ALL
      };
    default:
      return null;
  }
}

export default Dimensions()(function Workspace({ works, selection, mouseInfo, workspaceInfo, dispatch, containerWidth, containerHeight }) {
  const workspaceRef = useRef();
  console.log(containerWidth);

  useEffect(() => {
    dispatch({
      type: SET_WORKSPACE_INFO,
      info: {
        avuFactor: getAvuFactorFromWorkspaceWidth(containerWidth, uiSettings.workStripHorizontalMargin, uiSettings.workspaceSideBarWidth)
      }
    });
  }, [dispatch, containerWidth]);

  const handleMouseEnterOrMove = event => {
    dispatch({
      type: SET_MOUSE_INFO,
      info: {
        ...mouseInfo,
        lastWorkspacePosition: {
          x: event.clientX - workspaceRef.current.left,
          y: event.clientY - workspaceRef.current.top
        },
        possibleAction: mouseInfo.currentAction ? null : findPossibleAction(event)
      }
    });
  };

  const handleMouseLeave = event => {
    dispatch({
      type: SET_MOUSE_INFO,
      info: {
        ...mouseInfo,
        lastWorkspacePosition: {
          x: event.clientX - workspaceRef.current.left,
          y: event.clientY - workspaceRef.current.top
        },
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
        dispatch({ type: SELECT_PART, workId: mouseInfo.possibleAction.workId, partId: mouseInfo.possibleAction.partId, ctrlKey: event.ctrlKey });
        break;
      case DESELECT_ALL:
        dispatch({ type: DESELECT_ALL });
        break;
      default:
        throw new Error('HÄ?');
    }
  };

  const classes = classnames(['Workspace', mouseInfo.possibleAction ? `u-${mouseInfo.possibleAction.action}` : null]);

  const selectionRects = [];
  if (selection.chunks.length) {
    const workElement = workspaceRef.current.querySelector(`[data-work-id="${selection.workId}"]`);
    const workTop = workElement.offsetTop;
    const workLeft = workElement.offsetLeft;
    const workHeight = workElement.offsetHeight;
    for (let chunk of selection.chunks) {
      const left = avu2Px(chunk.fromAvu, workspaceInfo.avuFactor);
      const width = avu2Px(chunk.widthInAvus, workspaceInfo.avuFactor);
      selectionRects.push({
        top: workTop - uiSettings.selectionRectanglePadding,
        left: (workLeft + left) - uiSettings.selectionRectanglePadding,
        width: width + (2 * uiSettings.selectionRectanglePadding),
        height: workHeight + (2 * uiSettings.selectionRectanglePadding)
      });
    }
  }

  return (
    <div ref={workspaceRef} className={classes} style={{ position: 'relative', width: '100%', height: '100%' }} data-possible-action={DESELECT_ALL} onMouseEnter={handleMouseEnterOrMove} onMouseMove={handleMouseEnterOrMove} onMouseLeave={handleMouseLeave} onMouseDown={handleMouseDown}>
      <div className="Workspace-workLayer" style={{ padding: `${uiSettings.workStripVerticalMargin}px ${uiSettings.workStripHorizontalMargin}px` }}>
        <Work work={works[0]} />
      </div>
      <div className="Workspace-decoratorLayer" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
        {selectionRects.map((rect, index) => (
          <div key={index} style={{ position: 'absolute', border: '1px solid #fa8c16', backgroundColor: '#ffa940', opacity: '0.4', ...rect }} />
        ))}
      </div>
    </div>
  );
});
