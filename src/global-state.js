import testDoc01 from './docs/01.json';
import { SELECT_PART, DESELECT_ALL, SET_MOUSE_INFO } from './actions';

export const initialState = {
  works: [testDoc01],
  selection: {
    workId: null,
    partIds: [],
    partIndices: [],
    partIndexChunks: []
  },
  mouseInfo: {
    lastWorkspacePosition: {
      x: 0,
      y: 0
    },
    avuFactor: 0,
    possibleAction : null,
    currentAction: null
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

  let chunks = partIndices.length ? [{ from: partIndices[0], to: partIndices[0] }] : [];
  for (let i = 1; i < partIndices.length; i += 1) {
    const lastChunk = chunks[chunks.length - 1];
    const currentIndex = partIndices[i];
    if (currentIndex - lastChunk.to === 1) {
      lastChunk.to = currentIndex;
    } else {
      chunks.push({ from: currentIndex, to: currentIndex });
    }
  }

  return {
    workId: newSelectedWorkId,
    partIds: newSelectedPartIds,
    partIndices: partIndices,
    partIndexChunks: chunks
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
          partIndexChunks: []
        }
      };
    case SET_MOUSE_INFO:
      return {
        ...state,
        mouseInfo: action.info
      }
    default:
      throw new Error('HÄ?');
  }
}
