import React from 'react';
import PropTypes from 'prop-types';
import SmallFilterButton from './small-filter-button';

// eslint-disable-next-line object-curly-newline, max-len
function FilterButtonContainer({ trailType, enumsFromFacTypeValue, allValuesIn, facType, updateOverlay }) {
  let buttonContainerName = 'filter-buttons__button-container';
  let filterButtonsSliderName = 'filter-buttons__slider';
  if (allValuesIn(facType, enumsFromFacTypeValue[trailType.name])) {
    filterButtonsSliderName += ' filter-buttons__slider--selected';
    buttonContainerName += ' filter-buttons__button-container--selected';
  }


  const smallFilterButtons = trailType.children.map(childType => (
    <SmallFilterButton
      key={childType.name}
      childTrailType={childType}
    />
  ));
  return (
    <div>
      <div className="filter-buttons__container" key={trailType.name}>
        <div className={buttonContainerName}>
          <button
            id={trailType.name}
            className="filter-buttons__button"
            type="button"
            style={{ backgroundImage: `url(${require(`../../../../assets/images/${trailType.name.replace(/\s+/g, '-').toLowerCase()}@2x.png`)})` }}
            onClick={() => { updateOverlay(trailType, 'path_overlay'); }}
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
              onClick={() => { updateOverlay(trailType, 'path_overlay'); }}
            />
          </div>
        </div>
        <div className="filter-buttons__child-container">
          <div className="filter-buttons__description">
            {trailType.description}
          </div>
          <div className="filter-buttons__children">
            { smallFilterButtons }
          </div>
        </div>
      </div>
    </div>
  );
}

FilterButtonContainer.propTypes = {
  allValuesIn: PropTypes.func.isRequired,
  facType: PropTypes.arrayOf(PropTypes.number).isRequired,
  enumsFromFacTypeValue: PropTypes.shape({
    'Shared Use Paths': PropTypes.arrayOf(PropTypes.number),
    'Bicycle Lanes': PropTypes.arrayOf(PropTypes.number),
    Footpaths: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  trailType: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
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
