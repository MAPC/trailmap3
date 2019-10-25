import React from 'react';
import PropTypes from 'prop-types';

function FilterButtonContainer({
  trailType, visibleFacType, allValuesIn, updateOverlay, startLoading,
}) {
  let buttonContainerName = 'filter';
  let filterButtonsSliderName = 'filter__slider';
  if (allValuesIn(visibleFacType[trailType.name], trailType.facTypeValues)) {
    filterButtonsSliderName += ' filter__slider--selected';
    buttonContainerName += ` filter__${trailType.name.replace(/\s+/g, '-').toLowerCase()}--selected`;
  }
  const variableName = `filter__button filter__button-${trailType.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={buttonContainerName} key={trailType.name}>
      <button
        id={trailType.name}
        className={variableName}
        type="button"
        onClick={() => {
          updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType);
          startLoading();
        }}
      />
      <label
        htmlFor={trailType.name}
        className="filter__label"
      >
        {trailType.name}
      </label>
      <div className="filter__slider-container">
        <div
          className={filterButtonsSliderName}
          onClick={() => {
            updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType);
            startLoading();
          }}
          onKeyPress={() => {
            updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType);
            startLoading();
          }}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
}

FilterButtonContainer.propTypes = {
  allValuesIn: PropTypes.func.isRequired,
  visibleFacType: PropTypes.shape({
    'Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Proposed Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    Footpaths: PropTypes.arrayOf(PropTypes.number),
    'Proposed Footpaths': PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  trailType: PropTypes.shape({
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
  updateOverlay: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired,
};

export default FilterButtonContainer;
