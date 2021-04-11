import React, { memo } from 'react';
import { RESIZE_PARTS } from './actions';
import './part-strip-bottom-controls.scss';
import PartBorderControls from './part-border-controls';
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BUTTON_WIDTH = 18;

export default memo(function PartStripBottomControls({ doc }) {
  return (
    <div className="PartStripBottomControls">
      <PartBorderControls doc={doc} width={BUTTON_WIDTH} height={BUTTON_WIDTH}>
        {({ leftPart, rightPart, leftIndex, rightIndex }) => (
          <div
            className="PartStripBottomControls-iconContainer"
            data-doc-id={doc.id}
            data-left-part-id={leftPart.id}
            data-right-part-id={rightPart.id}
            data-left-part-index={leftIndex}
            data-right-part-index={rightIndex}
            data-possible-action={RESIZE_PARTS}
            >
            <FontAwesomeIcon icon={faArrowsAltH} size="xs" className="PartStripBottomControls-resizeIcon" />
          </div>
        )}
      </PartBorderControls>
    </div>
  );
});
