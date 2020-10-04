import testDoc01 from './docs/01.json';
import { SELECT_PART, DESELECT_ALL, SET_MOUSE_INFO, SET_WORKSPACE_INFO } from './actions';

export const initialState = {
  works: [testDoc01],
  selection: {
    workId: null,
    partIds: [],
    partIndices: [],
    chunks: []
  },
  mouseInfo: {
    lastWorkspacePosition: {
      x: 0,
      y: 0
    },
    possibleAction : null,
    currentAction: null
  },
  workspaceInfo: {
    avuFactor: 0
  }
};

function createNewSelection({ works, currentSelection, workId, partId, ctrlKey }) {
  const isSelected = currentSelection.partIds.includes(partId);
  const isOneOfMultiple = isSelected && currentSelection.partIds.length > 1;
  const isAddOrSubtract = ctrlKey;
  let newSelectedPartIds;
  if (isAddOrSubtract) {
    newSelectedPartIds = isSelected ? currentSelection.partIds.filter(x => x !== partId) : currentSelection.partIds.concat([partId]);
  } else if (isOneOfMultiple) {
    newSelectedPartIds = [partId];
  } else {
    newSelectedPartIds = isSelected ? [] : [partId];
  }
  const newSelectedWorkId = newSelectedPartIds.length ? workId : null;

  const work = works.find(w => w.id === workId);
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

export function reducer(state, action) {
  switch (action.type) {
    case SELECT_PART:
      return {
        ...state,
        selection: createNewSelection({
          works: state.works,
          currentSelection: state.selection,
          workId: action.workId,
          partId: action.partId,
          ctrlKey: action.ctrlKey
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
      console.log(SET_WORKSPACE_INFO);
      return {
        ...state,
        workspaceInfo: action.info
      }
    case 'debug':
      console.log(SET_WORKSPACE_INFO);
      return {
        ...state,
        debugInfo: action.info
      }
    default:
      throw new Error('HÄ?');
  }
}
