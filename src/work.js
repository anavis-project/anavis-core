import './work.scss';
import React from 'react';
import Sound from './sound';
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
        gridTemplateRows: `${options.workVerticalMargin}px auto auto auto ${options.workVerticalMargin}px`,
        gridTemplateColumns: `${options.workHorizontalMargin}px 1fr ${options.workHorizontalMargin}px`
      }}>
      <div style={{ gridRow: 2, gridColumn: 2 }} className="Work-cell">
        <DocumentHeader doc={doc} dispatch={dispatch} />
      </div>
      <div style={{ gridRow: 3, gridColumn: 1 }} className="Work-cell">
        <PartStripLeftControls doc={doc} dispatch={dispatch} />
      </div>
      <div style={{ gridRow: 3, gridColumn: 2 }} className="Work-cell">
        <PartStripTopControls doc={doc} />
        <PartStrip doc={doc} partHeight={options.partHeight} />
        <PartStripBottomControls doc={doc} />
      </div>
      <div style={{ gridRow: 4, gridColumn: 2 }} className="Work-cell">
        {doc.work.sounds.map((sound, index) => (
          <Sound key={index} doc={doc} sound={sound} />
        ))}
      </div>
    </div>
  );
}
