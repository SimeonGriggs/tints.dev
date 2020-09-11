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
    max = null;

  if (type === 'number') {
    switch (input) {
      case 's':
        min = -100;
        max = 100;
        break;
      case 'h':
        min = -360;
        max = 360;
        break;
      case 'lMax':
        max = 100;
        break;
      case 'lMin':
        min = 0;
        break;
    }
  }

  return (
    <label htmlFor={input} className="w-full">
      <span className="label block mb-1">{labels[input]}</span>
      <input
        value={tweaks[input]}
        name={input}
        type={type}
        min={min}
        max={max}
        onChange={handleChange}
        className="input"
      />
    </label>
  );
};

export default FormInput;
