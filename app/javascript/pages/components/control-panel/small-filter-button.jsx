import React from 'react';
import PropTypes from 'prop-types';

function SmallFilterButton({
  childTrailType,
  //allValuesIn,
  // updateOverlay,
}) {
  let className = `small-filter-button small-filter-button-${childTrailType.name.replace(/\s+/g, '-').toLowerCase()}`;
  // if (allValuesIn(this.state.overlay[child.overlayType], childTrailType.overlayValues)) {
  //   className += ' small-filter-button--selected';
  // }

  return (
    <button
      id={childTrailType.name}
      key={childTrailType.name}
      className={className}
      type="button"
      // onClick={this.updateOverlay(this, child, 'path_overlay')}
    >
      {childTrailType.name}
    </button>
  );
}

SmallFilterButton.propTypes = {
  // allValuesIn: PropTypes.func.isRequired,
  childTrailType: PropTypes.shape({
    name: PropTypes.string,
    overlayType: PropTypes.string,
    overlayValues: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  // updateOverlay: PropTypes.func.isRequired,
};

export default SmallFilterButton;
