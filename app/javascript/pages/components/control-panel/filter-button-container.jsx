import React from 'react';
import PropTypes from 'prop-types';
import SmallFilterButton from './small-filter-button';

// eslint-disable-next-line object-curly-newline, max-len
function FilterButtonContainer({ trailType, facType, allValuesIn, updateOverlay }) {
  let buttonContainerName = 'filter-buttons__button-container';
  let filterButtonsSliderName = 'filter-buttons__slider';
  // if (allValuesIn(facType[trailType.name], trailType.overlayValues)) {
  //   filterButtonsSliderName += ' filter-buttons__slider--selected';
  //   buttonContainerName += ' filter-buttons__button-container--selected';
  // }

  // const smallFilterButtons = trailType.children.map(childType => (
  //   <SmallFilterButton
  //     key={childType.name}
  //     childTrailType={childType}
  //     // allValuesIn={allValuesIn}
  //   />
  // ));
  return (
    <div>
      <div className="filter-buttons__container" key={trailType.name}>
        <div className={buttonContainerName}>
          <button
            id={trailType.name}
            className="filter-buttons__button"
            type="button"
            style={{ backgroundImage: `url(${require(`../../../../assets/images/${trailType.name.replace(/\s+/g, '-').toLowerCase()}@2x.png`)})` }}
            onClick={() => { updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType); }}
          />
          <label
            htmlFor={trailType.name}
            className="filter-buttons__label"
          >
            {trailType.name}
          </label>
          <div className="filter-buttons__slider-container">
            <div
              className={filterButtonsSliderName}
              onClick={() => { updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType); }}
              // onKeyPress={() => { updateOverlay(trailType, trailType.existingPathName); }}
              role="button"
              tabIndex={0}
            />
          </div>
        </div>
        <div className="filter-buttons__child-container">
          <div className="filter-buttons__description">
            {trailType.description}
          </div>
          <div className="filter-buttons__children">
            {/* { smallFilterButtons } */}
          </div>
        </div>
      </div>
    </div>
  );
}

FilterButtonContainer.propTypes = {
  allValuesIn: PropTypes.func.isRequired,
  facType: PropTypes.shape({
    'Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    Footpaths: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  trailType: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    existingPathName: PropTypes.string,
    proposedPathName: PropTypes.string,
    overlayType: PropTypes.string,
    overlayValues: PropTypes.arrayOf(PropTypes.number),
    children: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      overlayType: PropTypes.string,
      overlayValues: PropTypes.arrayOf(PropTypes.number),
    })),
  }).isRequired,
  updateOverlay: PropTypes.func.isRequired,
};

export default FilterButtonContainer;
