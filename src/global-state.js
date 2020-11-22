import testDoc01 from './docs/01.json';
import testDoc02 from './docs/02.json';
import testDoc03 from './docs/03.json';
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
  const isMerge = !ctrlKey && shiftKey && currentSelection.chunks.length === 1;
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
      console.log('RESIZE_PARTS is not implemented');
      return state;
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
      return {
        ...state,
        mouseInfo: action.info
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
