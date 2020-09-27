import React, { memo } from 'react';
import uiSettings from './ui-settings';
import { SELECT_PART } from './actions';
import { getContrastColor } from './ui-helper';

export default memo(function Work({ work }) {
  return (
    <div className="Work" data-work-id={work.id} style={{ height: uiSettings.partHeight, display: 'grid', gridTemplateColumns: work.parts.map(part => `${part.length}fr`).join(' ') }}>
      {work.parts.map((part, index) => (
        <div className="Work-partOuter" key={part.id} data-parent-work-id={work.id} data-part-id={part.id} data-possible-action={SELECT_PART} style={{ display: 'grid', border: '1px solid black', gridRow: 1, gridColumn: index + 1, backgroundColor: part.color, color: getContrastColor(part.color) }}>
          <div className="Work-partInner" style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.2) 100%)' }}>
            <div className="Work-partName" style={{ width: '100%', padding: '0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{part.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
});
