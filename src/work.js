import './work.scss';
import React from 'react';
import PartStrip from './part-strip';
import PartStripTopControls from './part-strip-top-controls';

export default function Work({ work, options }) {
  return (
    <div
      className="Work"
      style={{
        gridTemplateRows: `${options.workVerticalMargin}px 1fr ${options.workVerticalMargin}px`,
        gridTemplateColumns: `${options.workHorizontalMargin}px 1fr ${options.workHorizontalMargin}px`
      }}>
      <div className="Work-left">Links</div>
      <div className="Work-center">
        <PartStripTopControls work={work} />
        <PartStrip work={work} partHeight={options.partHeight} />
      </div>
      <div className="Work-right">Rechts</div>
    </div>
  );
}
