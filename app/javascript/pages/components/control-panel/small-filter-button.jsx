import React from 'react';
import PropTypes from 'prop-types';

function SmallFilterButton({
  childTrailType,
  parentTrailType,
  allValuesIn,
  updateOverlay,
  updateOverlayChild,
  visibleFacType
}) {
  let className = `small-filter-button small-filter-button-${childTrailType.name.replace(/\s+/g, '-').toLowerCase()}`;
  if (allValuesIn(visibleFacType[parentTrailType.name], childTrailType.facTypeValues)) {
    className += ' small-filter-button--selected';
  }

  return (
    <button
      id={childTrailType.name}
      key={childTrailType.name}
      className={className}
      type="button"
      onClick={() => { updateOverlayChild(childTrailType.facStatValues, childTrailType.facTypeValues, parentTrailType); }}
      // onClick={() => { updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType); }}
      // updateOverlay(facStat, facType, trailType = 'proposed') {
    >
      {childTrailType.name}
    </button>
  );
}

SmallFilterButton.propTypes = {
  allValuesIn: PropTypes.func.isRequired,
  childTrailType: PropTypes.shape({
    name: PropTypes.string,
    overlayType: PropTypes.string,
    overlayValues: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  updateOverlay: PropTypes.func.isRequired,
  visibleFacType: PropTypes.shape({
    'Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Proposed Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    // 'Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    // Footpaths: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default SmallFilterButton;
