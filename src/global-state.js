import testDoc01 from './docs/01.json';
import testDoc02 from './docs/02.json';
import testDoc03 from './docs/03.json';
import { px2Avu, MIN_PART_LENGTH_IN_AVUS } from './avu-helper';
import { MERGE_PARTS, RESIZE_PARTS, SELECT_PART, DESELECT_ALL, SET_MOUSE_INFO, SET_WORKSPACE_INFO, SET_OPTIONS } from './actions';

export const initialState = {
  works: [testDoc01, testDoc02, testDoc03],
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
    workVerticalMargin: 50
  }
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

function modifyWorksOnMousePositionChange(currentAction, works) {
  if (currentAction.type === RESIZE_PARTS) {
    const workId = currentAction.workId;
    return works.map(work => {
      if (work.id === workId) {
        const leftPart = work.parts[currentAction.leftPartIndex];
        const rightPart = work.parts[currentAction.rightPartIndex];
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
          ...work,
          parts: work.parts.map(part => {
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
        } : work;
      } else {
        return work;
      }
    });
  } else {
    return works;
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case MERGE_PARTS:
      return {
        ...state,
        works: state.works.map(work => {
          return work.id === action.workId
            ? mergePartsInWork({ work, leftPartIndex: action.leftPartIndex, rightPartIndex: action.rightPartIndex })
            : work
        }),
        selection: createEmptySelection()
      };
    case RESIZE_PARTS:
      const work = state.works.find(w => w.id === action.workId);
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
            leftPartLength: work.parts[action.leftPartIndex].length,
            rightPartLength: work.parts[action.rightPartIndex].length,
            startX: state.mouseInfo.lastWorkspacePosition.x,
            offsetInAvus: 0
          }
        },
        selection: createEmptySelection()
      };
    case SELECT_PART:
      return {
        ...state,
        selection: createNewSelection({
          works: state.works,
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
      const currentAction = action.info.currentAction ? modifyCurrentActionOnMousePositionChange(action.info.currentAction, action.info, state.workspaceInfo) : null;
      const works = currentAction ? modifyWorksOnMousePositionChange(currentAction, state.works) : state.works;
      return {
        ...state,
        works: works,
        mouseInfo: {
          ...action.info,
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
    default:
      throw new Error(`Action type ${action.type} is not implemented!`);
  }
}
