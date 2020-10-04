import testDoc01 from './docs/01.json';
import { SELECT_PART, DESELECT_ALL, SET_MOUSE_INFO } from './actions';

export const initialState = {
  works: [testDoc01],
  selection: {
    workId: null,
    partIds: []
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

export function reducer(state, action) {
  switch (action.type) {
    case SELECT_PART:
      const isSelected = state.selection.partIds.includes(action.partId);
      const newSelectedParts = isSelected ? [] : [action.partId];
      return {
        ...state,
        selection: {
          workId: newSelectedParts.length ? action.workId : null,
          partIds: newSelectedParts
        }
      };
    case DESELECT_ALL:
      return {
        ...state,
        selection: {
          workId: null,
          partIds: []
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
