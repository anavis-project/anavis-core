import { v4 } from 'uuid';
import testDoc01 from './docs/01.json';
import testDoc02 from './docs/02.json';
import testDoc03 from './docs/03.json';
import { px2Avu, MIN_PART_LENGTH_IN_AVUS } from './avu-helper';
import {
  MERGE_PARTS,
  RESIZE_PARTS,
  SELECT_PART,
  DESELECT_ALL,
  SET_MOUSE_INFO,
  SET_WORKSPACE_INFO,
  SET_OPTIONS,
  SPLIT_PART,
  OPEN_DOCUMENTS,
  START_OPEN_DOCUMENTS,
  END_OPEN_DOCUMENTS,
  SAVE_DOCUMENT,
  START_SAVE_DOCUMENT,
  END_SAVE_DOCUMENT
} from './actions';

export const initialState = {
  selection: createEmptySelection(),
  mouseInfo: {
    lastWorkspacePosition: {
      x: 0,
      y: 0
    },
    possibleAction : null,
    currentAction: null
  },
  workspaceInfo: {
    workspaceWidth: 0,
    avuFactor: 0
  },
  options: {
    partHeight: 50,
    workHorizontalMargin: 50,
    workVerticalMargin: 50,
    documentManager: null
  },
  documents: [
    testDoc01,
    testDoc02,
    testDoc03
  ].map(work => ({
    name: '',
    handle: null,
    work: work,
    files: []
  }))
};

function createEmptySelection() {
  return {
    workId: null,
    partIds: [],
    partIndices: [],
    chunks: []
  };
}

function createNewSelection({ works, currentSelection, workId, partId, ctrlKey, shiftKey }) {
  const work = works.find(w => w.id === workId);

  // If the currently selected parts come from the same work, we keep them, otherwise, we start with an empty list:
  const alreadySelectedPartIds = (currentSelection.workId === workId) ? currentSelection.partIds : [];
  const isSelected = alreadySelectedPartIds.includes(partId);
  const isOneOfMultiple = isSelected && alreadySelectedPartIds.length > 1;
  const isAddOrSubtract = ctrlKey;
  const isMerge = !ctrlKey && shiftKey && !isOneOfMultiple && alreadySelectedPartIds.length && currentSelection.chunks.length === 1;
  let newSelectedPartIds;
  if (isAddOrSubtract) {
    newSelectedPartIds = isSelected ? alreadySelectedPartIds.filter(x => x !== partId) : alreadySelectedPartIds.concat([partId]);
  } else if (isOneOfMultiple) {
    newSelectedPartIds = [partId];
  } else if (isMerge) {
    newSelectedPartIds = Array.from(work.parts.reduce((obj, part) => {
      if (alreadySelectedPartIds.includes(part.id)) {
        obj.chunkProcessed = true;
        obj.ids.add(part.id);
      } else if (part.id === partId) {
        obj.partProcessed = true;
        obj.ids.add(part.id);
      } else if (obj.chunkProcessed !== obj.partProcessed) {
        obj.ids.add(part.id)
      }
      return obj;
    }, { ids: new Set(), chunkProcessed: false, partProcessed: false }).ids);
  } else {
    newSelectedPartIds = isSelected ? [] : [partId];
  }
  const newSelectedWorkId = newSelectedPartIds.length ? workId : null;

  const partIndices = work.parts.reduce((indices, part, index) => {
    if (newSelectedPartIds.includes(part.id)) {
      indices.push(index);
    }
    return indices;
  }, []);

  let chunks = partIndices.length ? [{ fromPartIndex: partIndices[0], toPartIndex: partIndices[0] }] : [];
  for (let i = 1; i < partIndices.length; i += 1) {
    const lastChunk = chunks[chunks.length - 1];
    const currentIndex = partIndices[i];
    if (currentIndex - lastChunk.toPartIndex === 1) {
      lastChunk.toPartIndex = currentIndex;
    } else {
      chunks.push({ fromPartIndex: currentIndex, toPartIndex: currentIndex });
    }
  }

  let currentAvu = 0;
  for (let i = 0; i < work.parts.length; i += 1) {
    const part = work.parts[i];
    const startAvu = currentAvu;
    const endAvu = startAvu + part.length;

    for (let chunk of chunks) {
      if (chunk.fromPartIndex === i) {
        chunk.fromAvu = startAvu;
      }

      if (chunk.toPartIndex === i) {
        chunk.toAvu = endAvu;
        chunk.widthInAvus = chunk.toAvu - chunk.fromAvu;
      }
    }

    currentAvu = endAvu;
  }

  return {
    workId: newSelectedWorkId,
    partIds: newSelectedPartIds,
    partIndices: partIndices,
    chunks: chunks
  };
}

function mergePartsInWork({ work, leftPartIndex, rightPartIndex }) {
  return {
    ...work,
    parts: work.parts.reduce((all, part, index) => {
      if (index <= leftPartIndex || index > rightPartIndex) {
        all.push(part);
      } else {
        const last = all[all.length - 1];
        all[all.length - 1] = { ...last, length: last.length + part.length };
      }
      return all;
    }, [])
  }
}

function splitPart(part, atOffset) {
  const oldLength = part.length;

  const leftPart = {
    ...part,
    length: atOffset
  };

  const rightPart = {
    id: v4(),
    name: leftPart.name,
    color: leftPart.color,
    length: oldLength - leftPart.length
  }

  return [leftPart, rightPart];
}

function splitPartInWork({ work, partIndex, offsetInAvus }) {
  return {
    ...work,
    parts: work.parts.reduce((all, part, index) => {
      if (index === partIndex) {
        const lengthOfPrecedingParts = all.reduce((accu, p) => accu + p.length, 0);
        const [leftPart, rightPart] = splitPart(part, offsetInAvus - lengthOfPrecedingParts);
        return [...all, leftPart, rightPart];
      } else {
        return [...all, part];
      }
    }, [])
  }
}

function modifyPossibleActionOnMousePositionChange(possibleAction, mouseInfo, workspaceInfo, options) {
  if (possibleAction.action === SPLIT_PART) {
    return {
      ...possibleAction,
      workspaceX: mouseInfo.lastWorkspacePosition.x,
      offsetInAvus: px2Avu(mouseInfo.lastWorkspacePosition.x - options.workHorizontalMargin, workspaceInfo.avuFactor)
    }
  } else {
    return possibleAction;
  }
}

function modifyCurrentActionOnMousePositionChange(currentAction, mouseInfo, workspaceInfo) {
  if (currentAction.type === RESIZE_PARTS) {
    return {
      ...currentAction,
      offsetInAvus: Math.round(px2Avu(mouseInfo.lastWorkspacePosition.x - currentAction.startX, workspaceInfo.avuFactor))
    }
  } else {
    return currentAction;
  }
}

function modifyDocumentsOnMousePositionChange(currentAction, documents) {
  if (currentAction.type === RESIZE_PARTS) {
    const workId = currentAction.workId;
    return documents.map(doc => {
      if (doc.work.id === workId) {
        const leftPart = doc.work.parts[currentAction.leftPartIndex];
        const rightPart = doc.work.parts[currentAction.rightPartIndex];
        const offsetInAvus = currentAction.offsetInAvus;
        let newLeftPartLength;
        let newRightPartLength;
        if (offsetInAvus < 0) {
          const avusToSubtract = Math.min(currentAction.leftPartLength - MIN_PART_LENGTH_IN_AVUS, Math.abs(offsetInAvus));
          newLeftPartLength = currentAction.leftPartLength - avusToSubtract;
          newRightPartLength = currentAction.rightPartLength + avusToSubtract;
        } else if (offsetInAvus > 0) {
          const avusToSubtract = Math.min(currentAction.rightPartLength - MIN_PART_LENGTH_IN_AVUS, Math.abs(offsetInAvus));
          newLeftPartLength = currentAction.leftPartLength + avusToSubtract;
          newRightPartLength = currentAction.rightPartLength - avusToSubtract;
        } else {
          newLeftPartLength = currentAction.leftPartLength;
          newRightPartLength = currentAction.rightPartLength;
        }

        return (newLeftPartLength !== leftPart.length) ? {
          ...doc,
          work: {
            ...doc.work,
            parts: doc.work.parts.map(part => {
              if (part.id === leftPart.id) {
                return {
                  ...part,
                  length: newLeftPartLength
                };
              } else if (part.id === rightPart.id) {
                return {
                  ...part,
                  length: newRightPartLength
                };
              } else {
                return part;
              }
            })
          }
        } : doc;
      } else {
        return doc;
      }
    });
  } else {
    return documents;
  }
}

export function reducer(state, action) {
  const actionDocument = action.workId ? state.documents.find(doc => doc.work.id === action.workId) : undefined;
  const actionWork = actionDocument?.work;

  switch (action.type) {
    case MERGE_PARTS:
      return {
        ...state,
        documents: state.documents.map(doc => {
          return doc === actionDocument
            ? { ...doc, work: mergePartsInWork({ work: doc.work, leftPartIndex: action.leftPartIndex, rightPartIndex: action.rightPartIndex })}
            : doc
        }),
        selection: createEmptySelection()
      };
    case RESIZE_PARTS:
      return {
        ...state,
        mouseInfo: {
          ...state.mouseInfo,
          currentAction: {
            type: RESIZE_PARTS,
            workId: action.workId,
            leftPartId: action.leftPartId,
            rightPartId: action.rightPartId,
            leftPartIndex: action.leftPartIndex,
            rightPartIndex: action.rightPartIndex,
            leftPartLength: actionWork.parts[action.leftPartIndex].length,
            rightPartLength: actionWork.parts[action.rightPartIndex].length,
            startX: state.mouseInfo.lastWorkspacePosition.x,
            offsetInAvus: 0
          }
        },
        selection: createEmptySelection()
      };
    case SPLIT_PART:
      return {
        ...state,
        documents: state.documents.map(doc => {
          return doc === actionDocument
            ? { ...doc, work: splitPartInWork({ work: doc.work, partIndex: action.partIndex, offsetInAvus: action.offsetInAvus }) }
            : doc
        }),
        selection: createEmptySelection()
      };
    case SELECT_PART:
      return {
        ...state,
        selection: createNewSelection({
          works: state.documents.map(doc => doc.work),
          currentSelection: state.selection,
          workId: action.workId,
          partId: action.partId,
          ctrlKey: action.ctrlKey,
          shiftKey: action.shiftKey,
        })
      };
    case DESELECT_ALL:
      return {
        ...state,
        selection: {
          workId: null,
          partIds: [],
          partIndices: [],
          chunks: []
        }
      };
    case SET_MOUSE_INFO:
      const possibleAction = action.info.possibleAction ? modifyPossibleActionOnMousePositionChange(action.info.possibleAction, action.info, state.workspaceInfo, state.options) : null;
      const currentAction = action.info.currentAction ? modifyCurrentActionOnMousePositionChange(action.info.currentAction, action.info, state.workspaceInfo) : null;
      const documents = currentAction ? modifyDocumentsOnMousePositionChange(currentAction, state.documents) : state.documents;
      return {
        ...state,
        documents: documents,
        mouseInfo: {
          ...action.info,
          possibleAction: possibleAction,
          currentAction: currentAction
        }
      }
    case SET_WORKSPACE_INFO:
      return {
        ...state,
        workspaceInfo: action.info
      }
    case SET_OPTIONS:
      return {
        ...state,
        options: {
          ...state.options,
          ...action.options
        }
      }
    case START_OPEN_DOCUMENTS:
      return {
        ...state
      }
    case END_OPEN_DOCUMENTS:
      return {
        ...state,
        documents: [
          ...state.documents,
          ...action.documents
        ]
      }
    case START_SAVE_DOCUMENT:
      return {
        ...state
      }
    case END_SAVE_DOCUMENT:
      return {
        ...state
      }
    default:
      throw new Error(`Action type ${action.type} is not implemented!`);
  }
}

export const asyncActionHandlers = {
  [OPEN_DOCUMENTS]: ({ dispatch, getState }) => async (action) => {
    dispatch({ type: START_OPEN_DOCUMENTS });
    const state = getState();
    const documents = await state.options.documentManager.openDocuments();
    dispatch({ type: END_OPEN_DOCUMENTS, documents: documents });
  },
  [SAVE_DOCUMENT]: ({ dispatch, getState }) => async (action) => {
    dispatch({ type: START_SAVE_DOCUMENT, doc: action.doc });
    const state = getState();
    await state.options.documentManager.saveDocument(action.doc);
    dispatch({ type: END_SAVE_DOCUMENT, doc: action.doc });
  }
}
