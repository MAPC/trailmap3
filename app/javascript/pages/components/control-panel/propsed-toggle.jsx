import React from 'react';
import PropTypes from 'prop-types';

function ProposedToggle({ allValuesIn, facStat }) {
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
          // onChange={this.updateOverlay.bind(this, 'facStat', [2, 3], 'proposed_overlay')}
        />
      </label>
      <span className="toggle-switch__label">Proposed Paths & Trails</span>
    </div>
  );
}

ProposedToggle.propTypes = {
  allValuesIn: PropTypes.func.isRequired,
  facStat: PropTypes.shape({
    'Proposed Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Proposed Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    'Proposed Footpaths': PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};
export default ProposedToggle;
