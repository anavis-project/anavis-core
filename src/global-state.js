import testDoc01 from './docs/01.json';

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
    case 'select-part':
      return {
        ...state,
        selection: {
          workId: action.workId,
          partIds: [action.partId]
        }
      };
    case 'set-mouse-info':
      return {
        ...state,
        mouseInfo: action.info
      }
    default:
      throw new Error('HÄ?');
  }
}
