import React from 'react';
import './part-selection-adorner.scss';

export default function PartSelectionAdorner({ top, left, width, height }) {
  return (
    <div className="PartSelectionAdorner" style={{ top, left, width, height }} />
  );
}
