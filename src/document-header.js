import React from 'react';
import './document-header.scss';

export default function DocumentHeader({ doc }) {
  return (
    <div className="DocumentHeader">{doc.name || 'Neues Dokument'}</div>
  );
}
