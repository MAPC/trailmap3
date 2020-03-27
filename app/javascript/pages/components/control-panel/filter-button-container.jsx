import React from 'react';
import PropTypes from 'prop-types';

function FilterButtonContainer({
  trailType, toggleEsriLayer,
}) {
  let filterButtonsSliderName = 'filter__slider';
  let labelClasses = 'filter__label';
  const toggleCSS = (trail) => {
    const selectedTrail = document.querySelector(`.filter__${trail.replace(/\s+/g, '-').toLowerCase()}`);
    selectedTrail.classList.toggle(`filter__${trail.replace(/\s+/g, '-').toLowerCase()}--selected`);
    selectedTrail.querySelector('.filter__label').classList.toggle('filter__label--selected');
    selectedTrail.querySelector('.filter__slider').classList.toggle('filter__slider--selected');
    };
    
  const buttonClasses = `filter__button filter__button-${trailType.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`filter filter__${trailType.name.replace(/\s+/g, '-').toLowerCase()}`} key={trailType.name}>
      <button
        id={trailType.name}
        className={buttonClasses}
        type="button"
        onClick={() => {
          toggleEsriLayer(trailType.name);
          toggleCSS(trailType.name);
        }}
      />
      <label
        htmlFor={trailType.name}
        className={labelClasses}
      >
        {trailType.name}
      </label>
      <div className="filter__slider-container">
        <div
          className={filterButtonsSliderName}
          onClick={() => {
            toggleEsriLayer(trailType.name);
            toggleCSS(trailType.name);
          }}
          onKeyPress={() => {
            toggleEsriLayer(trailType.name);
            toggleCSS(trailType.name);
          }}
          role="button"
          tabIndex={0}
        />
      </div>
    </div>
  );
}

FilterButtonContainer.propTypes = {
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
  toggleEsriLayer: PropTypes.func.isRequired,
};

export default FilterButtonContainer;
