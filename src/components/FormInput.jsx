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

  return (
    <label htmlFor={input}>
      <span className="label block mb-1">{labels[input]}</span>
      <input
        value={tweaks[input]}
        name={input}
        type={type}
        onChange={handleChange}
        className="input"
      />
    </label>
  );
};

export default FormInput;
