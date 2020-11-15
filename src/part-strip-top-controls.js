import React, { memo } from 'react';
import { MERGE_PARTS } from './actions';
import './part-strip-top-controls.scss';
import PartBorderControls from './part-border-controls';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BUTTON_WIDTH = 18;

export default memo(function PartStripTopControls({ work }) {
  return (
    <div className="PartStripTopControls">
      <PartBorderControls work={work} width={BUTTON_WIDTH} height={BUTTON_WIDTH}>
        {({ leftPart, rightPart, leftIndex, rightIndex }) => (
          <div
            data-work-id={work.id}
            data-left-part-id={leftPart.id}
            data-right-part-id={rightPart.id}
            data-left-part-index={leftIndex}
            data-right-part-index={rightIndex}
            data-possible-action={MERGE_PARTS}
            style={{ display: 'grid', alignItems: 'center', justifyItems: 'center' }}
            >
            <FontAwesomeIcon icon={faTimes} size="xs" className="PartStripTopControls-mergeIcon" />
          </div>
        )}
      </PartBorderControls>
    </div>
  );
});
