import './workspace.scss';
import Work from './work';
import classnames from 'classnames';
import uiSettings from './ui-settings';
import React, { useEffect } from 'react';
import findupAttribute from 'findup-attribute';
import { getContrastColor } from './ui-helper';
import useDimensions from 'react-cool-dimensions';
import PartSelectionAdorner from './part-selection-adorner';
import { getAvuFactorFromWorkspaceWidth, avu2Px } from './avu-helper';
import { MERGE_PARTS, RESIZE_PARTS, SELECT_PART, DESELECT_ALL, SET_MOUSE_INFO, SET_WORKSPACE_INFO, SPLIT_PART, OPEN_DOCUMENTS } from './actions';

function findPossibleAction(event) {
  const element = findupAttribute(event.target, 'data-possible-action') || null;
  const action = element ? element.getAttribute('data-possible-action') : null;
  switch (action) {
    case MERGE_PARTS:
      return {
        action: MERGE_PARTS,
        docId: element.getAttribute('data-doc-id'),
        leftPartId: element.getAttribute('data-left-part-id'),
        rightPartId: element.getAttribute('data-right-part-id'),
        leftPartIndex: Number(element.getAttribute('data-left-part-index')),
        rightPartIndex: Number(element.getAttribute('data-right-part-index'))
      };
    case RESIZE_PARTS:
      return {
        action: RESIZE_PARTS,
        docId: element.getAttribute('data-doc-id'),
        leftPartId: element.getAttribute('data-left-part-id'),
        rightPartId: element.getAttribute('data-right-part-id'),
        leftPartIndex: Number(element.getAttribute('data-left-part-index')),
        rightPartIndex: Number(element.getAttribute('data-right-part-index'))
      };
    case SPLIT_PART:
      return {
        action: SPLIT_PART,
        docId: element.getAttribute('data-doc-id'),
        partId: element.getAttribute('data-part-id'),
        partIndex: Number(element.getAttribute('data-part-index'))
      };
    case SELECT_PART:
      return {
        action: SELECT_PART,
        docId: element.getAttribute('data-parent-doc-id'),
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

export default function Workspace({ documents, selection, mouseInfo, workspaceInfo, options, dispatch }) {
  const { ref: workspaceRef, width: workspaceWidth } = useDimensions({ useBorderBoxSize: true });

  useEffect(() => {
    dispatch({
      type: SET_WORKSPACE_INFO,
      info: {
        workspaceWidth: workspaceWidth,
        avuFactor: getAvuFactorFromWorkspaceWidth(workspaceWidth, options.workHorizontalMargin, uiSettings.workspaceSideBarWidth),
      }
    });
  }, [dispatch, workspaceWidth, options]);

  const handleMouseEnterOrMove = event => {
    const clientRect = workspaceRef.current.getBoundingClientRect();
    dispatch({
      type: SET_MOUSE_INFO,
      info: {
        ...mouseInfo,
        lastWorkspacePosition: {
          x: event.clientX - clientRect.left,
          y: event.clientY - clientRect.top
        },
        possibleAction: mouseInfo.currentAction ? null : findPossibleAction(event)
      }
    });
  };

  const handleMouseLeaveOrUp = event => {
    const clientRect = workspaceRef.current.getBoundingClientRect();
    dispatch({
      type: SET_MOUSE_INFO,
      info: {
        ...mouseInfo,
        lastWorkspacePosition: {
          x: event.clientX - clientRect.left,
          y: event.clientY - clientRect.top
        },
        possibleAction: null,
        currentAction: null
      }
    });
  };

  const handleMouseDown = event => {
    if (!mouseInfo.possibleAction || event.button !== 0) {
      return;
    }

    switch (mouseInfo.possibleAction.action) {
      case MERGE_PARTS:
        dispatch({
          type: MERGE_PARTS,
          docId: mouseInfo.possibleAction.docId,
          leftPartId: mouseInfo.possibleAction.leftPartId,
          rightPartId: mouseInfo.possibleAction.rightPartId,
          leftPartIndex: mouseInfo.possibleAction.leftPartIndex,
          rightPartIndex: mouseInfo.possibleAction.rightPartIndex
        });
        break;
      case RESIZE_PARTS:
        dispatch({
          type: RESIZE_PARTS,
          docId: mouseInfo.possibleAction.docId,
          leftPartId: mouseInfo.possibleAction.leftPartId,
          rightPartId: mouseInfo.possibleAction.rightPartId,
          leftPartIndex: mouseInfo.possibleAction.leftPartIndex,
          rightPartIndex: mouseInfo.possibleAction.rightPartIndex
        });
        break;
      case SPLIT_PART:
        dispatch({
          type: SPLIT_PART,
          docId: mouseInfo.possibleAction.docId,
          partId: mouseInfo.possibleAction.partId,
          partIndex: mouseInfo.possibleAction.partIndex,
          workspaceX: mouseInfo.possibleAction.workspaceX,
          offsetInAvus: mouseInfo.possibleAction.offsetInAvus
        });
        break;
      case SELECT_PART:
        dispatch({
          type: SELECT_PART,
          docId: mouseInfo.possibleAction.docId,
          partId: mouseInfo.possibleAction.partId,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey
        });
        break;
      case DESELECT_ALL:
        dispatch({ type: DESELECT_ALL });
        break;
      default:
        throw new Error('HÄ?');
    }
  };

  const action = mouseInfo.currentAction?.type || mouseInfo.possibleAction?.action || null;
  const classes = classnames(['Workspace', action ? `u-${action}` : null]);

  const selectionRects = [];
  if (selection.chunks.length) {
    const workElement = workspaceRef.current.querySelector(`[data-role="part-strip"][data-doc-id="${selection.docId}"]`);
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

  let splitIndicator = null;
  if (mouseInfo.possibleAction?.action === SPLIT_PART) {
    const doc = documents.find(d => d.id === mouseInfo.possibleAction.docId);
    const part = doc.work.parts[mouseInfo.possibleAction.partIndex];
    const workElement = workspaceRef.current.querySelector(`[data-role="part-strip"][data-doc-id="${mouseInfo.possibleAction.docId}"]`);
    const workTop = workElement.offsetTop;
    const workHeight = workElement.offsetHeight;
    splitIndicator = {
      left: mouseInfo.possibleAction.workspaceX,
      top: workTop,
      height: workHeight,
      color: getContrastColor(part.color, 0.6)
    };
  }

  const handleOpenDocumentClick = () => {
    dispatch({
      type: OPEN_DOCUMENTS
    });
  };

  return (
    <div
      ref={workspaceRef}
      className={classes}
      data-possible-action={DESELECT_ALL}
      onMouseEnter={handleMouseEnterOrMove}
      onMouseMove={handleMouseEnterOrMove}
      onMouseLeave={handleMouseLeaveOrUp}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseLeaveOrUp}
      >
      <div className="Workspace-layer Workspace-layer--works">
        {documents.map(doc => <Work key={doc.id} doc={doc} options={options} dispatch={dispatch} />)}
        <button onClick={handleOpenDocumentClick}>Open Document</button>
      </div>
      <div className="Workspace-layer Workspace-layer--adorners">
        {selectionRects.map((rect, index) => <PartSelectionAdorner key={index} {...rect} />)}
        {splitIndicator && <div style={{
          position: 'absolute',
          width: 6,
          borderLeft: `2px dotted ${splitIndicator.color}`,
          left: splitIndicator.left,
          top: splitIndicator.top,
          height: splitIndicator.height
        }}
        />}
      </div>
    </div>
  );
}
