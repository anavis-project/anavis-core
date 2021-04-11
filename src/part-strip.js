import './part-strip.scss';
import React, { memo } from 'react';
import { SELECT_PART } from './actions';
import { getContrastColor } from './ui-helper';

export default memo(function PartStrip({ doc, partHeight }) {
  return (
    <div className="PartStrip"
      data-role="part-strip"
      data-doc-id={doc.id}
      >
      <div
        className="PartStrip-parts"
        style={{ height: partHeight, gridTemplateColumns: doc.work.parts.map(part => `${part.length}fr`).join(' ') }}
        >
        {doc.work.parts.map((part, index) => (
          <div
            className="PartStrip-partOuter"
            key={part.id}
            data-parent-doc-id={doc.id}
            data-part-id={part.id}
            data-possible-action={SELECT_PART}
            style={{ gridRow: 1, gridColumn: index + 1, backgroundColor: part.color, color: getContrastColor(part.color) }}
            >
            <div className="PartStrip-partInner">
              <div className="PartStrip-partName">{part.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
