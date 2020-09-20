import PartStrip from './part-strip';
import uiSettings from './ui-settings';
import React, { useState, useRef } from 'react';

export default function Workspace({ initialDocs }) {
  const workspaceRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = event => {
    setMousePosition({ x: event.clientX - workspaceRef.current.offsetLeft, y: event.clientY - workspaceRef.current.offsetTop });
  };

  return (
    <div ref={workspaceRef} className="Workspace" style={{ position: 'relative' }} onMouseMove={handleMouseMove}>
      <div className="Workspace-workLayer" style={{ padding: `${uiSettings.workStripVerticalMargin}px ${uiSettings.workStripHorizontalMargin}px` }}>
        <PartStrip work={initialDocs[0]} />
      </div>
      <div className="Workspace-decoratorLayer" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: mousePosition.x, top: mousePosition.y }}>?</div>
      </div>
    </div>
  );
}
