import './work.scss';
import React, { memo } from 'react';
import { SELECT_PART } from './actions';
import { getContrastColor } from './ui-helper';

export default memo(function Work({ work, partHeight }) {
  return (
    <div className="Work">
      <div className="Work-parts" data-work-id={work.id} style={{ height: partHeight, gridTemplateColumns: work.parts.map(part => `${part.length}fr`).join(' ') }}>
        {work.parts.map((part, index) => (
          <div className="Work-partOuter" key={part.id} data-parent-work-id={work.id} data-part-id={part.id} data-possible-action={SELECT_PART} style={{ gridRow: 1, gridColumn: index + 1, backgroundColor: part.color, color: getContrastColor(part.color) }}>
            <div className="Work-partInner">
              <div className="Work-partName">{part.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
