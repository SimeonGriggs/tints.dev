import React from 'react';

const FormInput = ({ labels, input, tweaks, setTweaks, type }) => {
  function handleChange(event) {
    setTweaks({
      ...tweaks,
      [input]:
        type === 'number' ? parseInt(event.target.value) : event.target.value,
    });
  }

  if (!labels[input]) return null;

  let min,
    max,
    step = null;

  if (type === 'number') {
    step = 1;
    min = 0;
    switch (input) {
      case 's':
        max = 100;
        break;
      case 'h':
        max = 360;
        break;
    }
  }

  return (
    <label htmlFor={input}>
      <span className="label block mb-1">{labels[input]}</span>
      <input
        value={tweaks[input]}
        name={input}
        type={type}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className="input"
      />
    </label>
  );
};

export default FormInput;
