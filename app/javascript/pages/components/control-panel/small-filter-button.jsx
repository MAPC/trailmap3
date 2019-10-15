import React from 'react';
import PropTypes from 'prop-types';

function SmallFilterButton({
  childTrailType,
  parentTrailType,
  allValuesIn,
  updateOverlayChild,
  visibleFacType,
  startLoading,
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
      onClick={() => {
        updateOverlayChild(childTrailType.facStatValues, childTrailType.facTypeValues, parentTrailType);
        startLoading();
      }}
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
  parentTrailType: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    source: PropTypes.string,
    facStatValues: PropTypes.arrayOf(PropTypes.number),
    facTypeValues: PropTypes.arrayOf(PropTypes.number),
    children: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      ofacStatValues: PropTypes.arrayOf(PropTypes.number),
      facTypeValues: PropTypes.arrayOf(PropTypes.number),
    })),
  }).isRequired,
  updateOverlayChild: PropTypes.func.isRequired,
  visibleFacType: PropTypes.shape({
    'Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Proposed Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    'Proposed Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    Footpaths: PropTypes.arrayOf(PropTypes.number),
    'Proposed Footpaths': PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  startLoading: PropTypes.func.isRequired,
};

export default SmallFilterButton;
