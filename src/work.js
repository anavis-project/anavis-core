import './work.scss';
import Media from './media';
import classnames from 'classnames';
import PartStrip from './part-strip';
import { SET_MEDIA_FILE } from './actions';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import DocumentHeader from './document-header';
import PartStripTopControls from './part-strip-top-controls';
import PartStripLeftControls from './part-strip-left-controls';
import PartStripBottomControls from './part-strip-bottom-controls';

export default function Work({ doc, options, dispatch }) {
  const onDrop = useCallback(acceptedFiles => {
    const firstFile = acceptedFiles[0];
    dispatch({ type: SET_MEDIA_FILE, docId: doc.id, file: firstFile });
  }, [doc, dispatch]);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const rootClasses = classnames(
    'Work',
    { 'is-drop-target': isDragActive }
  );

  return (
    <div
      className={rootClasses}
      data-role="work"
      style={{
        gridTemplateRows: `${options.workVerticalMargin}px auto auto auto ${options.workVerticalMargin}px`,
        gridTemplateColumns: `${options.workHorizontalMargin}px 1fr ${options.workHorizontalMargin}px`
      }}
      {...getRootProps()}
      >
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
        {doc.work.media.map((sound, index) => (
          <Media key={index} doc={doc} sound={sound} />
        ))}
      </div>
    </div>
  );
}
