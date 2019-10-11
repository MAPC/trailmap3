import React from 'react';
import PropTypes from 'prop-types';

function SmallFilterButton({
  childTrailType,
  allValuesIn,
  updateOverlay,
  visibleFacType,
}) {
  let className = `small-filter-button small-filter-button-${childTrailType.name.replace(/\s+/g, '-').toLowerCase()}`;
  if (allValuesIn(visibleFacType[childTrailType.group], childTrailType.facTypeValues)) {
    className += ' small-filter-button--selected';
  }
  return (
    <button
      id={childTrailType.name}
      key={childTrailType.name}
      className={className}
      type="button"
      onClick={() => { updateOverlay(childTrailType.facStatValues, childTrailType.facTypeValues, childTrailType); }}
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
    facStatValues: PropTypes.arrayOf(PropTypes.number),
    facTypeValues: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  updateOverlay: PropTypes.func.isRequired,
  visibleFacType: PropTypes.shape({
    'Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Proposed Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    'Proposed Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    Footpaths: PropTypes.arrayOf(PropTypes.number),
    'Proposed Footpaths': PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default SmallFilterButton;
