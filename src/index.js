import './index.scss';
import Anavis from './anavis';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import DocumentManager from './document-manager';

const defaultOptions = {
  partHeight: 50,
  workHorizontalMargin: 50,
  workVerticalMargin: 50,
  documentManager: new DocumentManager()
};

function Index() {
  const [options, setOptions] = useState(defaultOptions);

  const handleValueChange = event => {
    setOptions({ ...options, [event.target.name]: Number(event.target.value) });
  };

  return (
    <div>
      <div style={{ padding: '25px', textAlign: 'center' }}>
        <label>partHeight: <input name="partHeight" type="range" min="0" max="100" value={options.partHeight} onChange={handleValueChange} /></label>
        &nbsp;&nbsp;&nbsp;
        <label>workHorizontalMargin: <input name="workHorizontalMargin" type="range" min="0" max="100" value={options.workHorizontalMargin} onChange={handleValueChange} /></label>
        &nbsp;&nbsp;&nbsp;
        <label>workVerticalMargin: <input name="workVerticalMargin" type="range" min="0" max="100" value={options.workVerticalMargin} onChange={handleValueChange} /></label>
      </div>
      <Anavis options={options} />
    </div>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
