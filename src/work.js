import './work.scss';
import memoize from 'memoizee';
import PartStrip from './part-strip';
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import DocumentHeader from './document-header';
import PartStripTopControls from './part-strip-top-controls';
import PartStripLeftControls from './part-strip-left-controls';
import PartStripBottomControls from './part-strip-bottom-controls';

const getEmbeddedSoundUrl = memoize((doc, fileName) => {
  return URL.createObjectURL(doc.files[fileName]);
}, {
  normalizer: ([doc, fileName]) => `${doc.id}|${fileName}`
});

export default function Work({ doc, options, dispatch }) {
  const playerRef = useRef();
  const soundUrl = doc.work.sounds.length ? getEmbeddedSoundUrl(doc, doc.work.sounds[0].fileName) : null;
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
        <ReactPlayer
          ref={playerRef}
          className="Video-mainPlayerInner"
          url={soundUrl}
          width="100%"
          height="100%"
          controls
          progressInterval={100}
          playing={true}
          />
      </div>
    </div>
  );
}
