import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Workspace from './workspace';
import testDoc01 from './docs/01.json';


ReactDOM.render(
  <React.StrictMode>
    <div>Anavis Tests</div>
    <div style={{ display: 'grid', margin: '100px auto', width: '90vw', minHeight: '500px', border: '1px solid gray', backgroundColor: '#fff' }}>
      <Workspace initialDocs={[testDoc01]} />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
