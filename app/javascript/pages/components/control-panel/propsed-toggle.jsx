import React from 'react';
import PropTypes from 'prop-types';

function ProposedToggle({ updateOverlayProposed, overlay, changeToggleState, startLoading }) {
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
            startLoading();
            updateOverlayProposed(overlay);
          }}
        />
      </label>
      <span className="toggle-switch__label">Proposed Paths & Lanes</span>
    </div>
  );
}

ProposedToggle.propTypes = {
  updateOverlayProposed: PropTypes.func.isRequired,
  changeToggleState: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
};
export default ProposedToggle;
