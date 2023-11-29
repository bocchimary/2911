import React, { useState } from 'react';

function ToggleSwitch() {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleToggle = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <div className="form-check form-switch">
      <input
        type="checkbox"
        className="form-check-input"
        id="toggleSwitch"
        checked={isSwitchOn}
        onChange={handleToggle}
      />
      <label className="form-check-label" htmlFor="toggleSwitch">
        Toggle Switch
      </label>
    </div>
  );
}

export default ToggleSwitch;
