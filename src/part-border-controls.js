import React, { memo } from 'react';
import './part-border-controls.scss';
import { SPLIT_PART } from './actions';

export default memo(function PartBorderControls({ doc, width, height, children }) {
  return (
    <div
      className="PartBorderControls"
      data-doc-id={doc.id}
      style={{ height: height, gridTemplateColumns: doc.work.parts.map(part => `${part.length}fr`).join(' ') }}
      >
      {doc.work.parts.map((part, index) => index !== doc.work.parts.length - 1 && (
        <div
          className="PartBorderControls-control"
          key={part.id}
          style={{ gridRow: 1, gridColumn: index + 1 }}
          >
          <div style={{ display: 'grid', justifyItems: 'center', alignItems: 'center', width: width, marginRight: -(width / 2) }}>
            {children({
              leftIndex: index,
              rightIndex: index + 1,
              leftPart: doc.work.parts[index],
              rightPart: doc.work.parts[index + 1]
            })}
          </div>
        </div>
      ))}
      {doc.work.parts.map((part, index) => (
        <div
          key={part.id}
          data-doc-id={doc.id}
          data-part-id={part.id}
          data-part-index={index}
          data-possible-action={SPLIT_PART}
          className="PartBorderControls-splitArea"
          style={{ gridRow: 1, gridColumn: index + 1 }} />
      ))}
    </div>
  );
});
