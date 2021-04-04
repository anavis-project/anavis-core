import './work.scss';
import React from 'react';
import PartStrip from './part-strip';
import DocumentHeader from './document-header';
import PartStripTopControls from './part-strip-top-controls';
import PartStripLeftControls from './part-strip-left-controls';
import PartStripBottomControls from './part-strip-bottom-controls';

export default function Work({ doc, options, dispatch }) {
  return (
    <div
      className="Work"
      data-role="work"
      style={{
        gridTemplateRows: `${options.workVerticalMargin}px 1fr ${options.workVerticalMargin}px`,
        gridTemplateColumns: `${options.workHorizontalMargin}px 1fr ${options.workHorizontalMargin}px`
      }}>
      <div className="Work-topCenter">
        <DocumentHeader doc={doc} dispatch={dispatch} />
      </div>
      <div className="Work-left">
        <PartStripLeftControls doc={doc} dispatch={dispatch} />
      </div>
      <div className="Work-center">
        <PartStripTopControls work={doc.work} />
        <PartStrip work={doc.work} partHeight={options.partHeight} />
        <PartStripBottomControls work={doc.work} />
      </div>
      <div className="Work-right">Rechts</div>
    </div>
  );
}
