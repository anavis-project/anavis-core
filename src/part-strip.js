import './part-strip.scss';
import React, { memo } from 'react';
import { SELECT_PART } from './actions';
import { getContrastColor } from './ui-helper';

export default memo(function PartStrip({ work, partHeight }) {
  return (
    <div className="PartStrip"
      data-role="part-strip"
      data-work-id={work.id}
      >
      <div
        className="PartStrip-parts"
        style={{ height: partHeight, gridTemplateColumns: work.parts.map(part => `${part.length}fr`).join(' ') }}
        >
        {work.parts.map((part, index) => (
          <div
            className="PartStrip-partOuter"
            key={part.id}
            data-parent-work-id={work.id}
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
