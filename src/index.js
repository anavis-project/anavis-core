import './index.scss';
import Anavis from './anavis';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';

const defaultOptions = {
  partHeight: 50,
  workStripHorizontalMargin: 50,
  workStripVerticalMargin: 50
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
        <label>workStripHorizontalMargin: <input name="workStripHorizontalMargin" type="range" min="0" max="100" value={options.workStripHorizontalMargin} onChange={handleValueChange} /></label>
        &nbsp;&nbsp;&nbsp;
        <label>workStripVerticalMargin: <input name="workStripVerticalMargin" type="range" min="0" max="100" value={options.workStripVerticalMargin} onChange={handleValueChange} /></label>
      </div>
      <Anavis options={options} />
    </div>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
