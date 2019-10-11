import React from 'react';
import PropTypes from 'prop-types';
import SmallFilterButton from './small-filter-button';
import SharedUsePath from '../../../../assets/images/shared-use-paths@2x.png'
// `../../../../assets/images/${trailType.name.replace(/\s+/g, '-').toLowerCase()}@2x.png`

// eslint-disable-next-line object-curly-newline, max-len
function FilterButtonContainer({ trailType, visibleFacType, allValuesIn, updateOverlay, updateOverlayChild }) {
  let buttonContainerName = 'filter-buttons__button-container';
  let filterButtonsSliderName = 'filter-buttons__slider';
  if (allValuesIn(visibleFacType[trailType.name], trailType.facTypeValues)) {
    filterButtonsSliderName += ' filter-buttons__slider--selected';
    buttonContainerName += ' filter-buttons__button-container--selected';
  }
  const variableName = `filter-buttons__button filter-buttons__button-${trailType.name.replace(/\s+/g, '-').toLowerCase()}`

  const smallFilterButtons = trailType.children.map(childType => (
    <SmallFilterButton
      key={childType.name}
      parentTrailType={trailType}
      childTrailType={childType}
      allValuesIn={allValuesIn}
      visibleFacType={visibleFacType}
      updateOverlay={updateOverlay}
      updateOverlayChild={updateOverlayChild}
    />
  ));
  return (
    <div>
      <div className="filter-buttons__container" key={trailType.name}>
        <div className={buttonContainerName}>
          <button
            id={trailType.name}
            className={variableName}
            type="button"
            // style={{ backgroundImage: `url(${require(`../../../../assets/images/${trailType.name.replace(/\s+/g, '-').toLowerCase()}@2x.png`)})` }}
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
              onKeyPress={() => { updateOverlay(trailType.facStatValues, trailType.facTypeValues, trailType); }}
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
            { smallFilterButtons }
          </div>
        </div>
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
  updateOverlayChild: PropTypes.func.isRequired,
};

export default FilterButtonContainer;
