import React from 'react';
import './part-strip-left-controls.scss'
import { SAVE_DOCUMENT } from './actions';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PartStripLeftControls({ doc, dispatch }) {
  return (
    <div className="PartStripLeftControls">
      <FontAwesomeIcon
        icon={faSave}
        size="1x"
        style={{ color: 'blue', cursor: 'pointer' }}
        className="PartStripLeftControls-saveIcon"
        onClick={() => dispatch({ type: SAVE_DOCUMENT, doc: doc })}
        />
    </div>
  );
}
