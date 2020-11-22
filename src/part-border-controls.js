import React, { memo } from 'react';
import './part-border-controls.scss';

export default memo(function PartBorderControls({ work, width, height, children }) {
  return (
    <div
      className="PartBorderControls"
      data-work-id={work.id}
      style={{ height: height, gridTemplateColumns: work.parts.map(part => `${part.length}fr`).join(' ') }}
      >
      {work.parts.map((part, index) => index !== work.parts.length - 1 && (
        <div
          className="PartBorderControls-control"
          key={part.id}
          style={{ gridRow: 1, gridColumn: index + 1 }}
          >
          <div style={{ display: 'grid', justifyItems: 'center', alignItems: 'center', width: width, marginRight: -(width / 2) }}>
            {children({
              leftIndex: index,
              rightIndex: index + 1,
              leftPart: work.parts[index],
              rightPart: work.parts[index + 1]
            })}
          </div>
        </div>
      ))}
    </div>
  );
});
