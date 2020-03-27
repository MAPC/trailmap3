import React from 'react';
import PropTypes from 'prop-types';

function ProposedToggle({ changeToggleState, toggleEsriProposedLayer }) {
  return (
    <div className="toggle-switch">
      <label
        className="toggle-switch__label"
        htmlFor="Proposed"
      >
        <input
          id="Proposed"
          key="Proposed"
          className="toggle-switch__input"
          type="checkbox"
          onChange={() => {
            changeToggleState();
            toggleEsriProposedLayer();
          }}
        />
      </label>
      <span className="toggle-switch__label">Proposed Paths & Lanes</span>
    </div>
  );
}

ProposedToggle.propTypes = {
  changeToggleState: PropTypes.func.isRequired,
  toggleEsriProposedLayer: PropTypes.func.isRequired,
};
export default ProposedToggle;
