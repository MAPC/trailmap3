import React from 'react';
import PropTypes from 'prop-types';

function FilterButtonContainer({
  trailType, toggleEsriLayer,
}) {
  const toggleCSS = (trail) => {
    const selectedTrail = document.querySelector(`.filter__${trail.replace(/\s+/g, '-').toLowerCase()}`);
    selectedTrail.classList.toggle(`filter__${trail.replace(/\s+/g, '-').toLowerCase()}--selected`);
    selectedTrail.querySelector('.filter__label').classList.toggle('filter__label--selected');
    selectedTrail.querySelector('.filter__slider').classList.toggle('filter__slider--selected');
  };

  const buttonClasses = `filter__button filter__button-${trailType.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div
      className={`filter filter__${trailType.replace(/\s+/g, '-').toLowerCase()} filter__${trailType.replace(/\s+/g, '-').toLowerCase()}--selected`}
      key={trailType}
      role="button"
      tabIndex={0}
      onClick={() => {
        toggleEsriLayer(trailType);
        toggleCSS(trailType);
      }}
      onKeyPress={() => {
        toggleEsriLayer(trailType);
        toggleCSS(trailType);
      }}
    >
      <button
        id={trailType}
        className={buttonClasses}
        type="button"
      />
      <span className="filter__label filter__label--selected">
        {trailType}
      </span>
      <div className="filter__slider-container">
        <div
          className="filter__slider filter__slider--selected"
        />
      </div>
    </div>
  );
}

FilterButtonContainer.propTypes = {
  trailType: PropTypes.string.isRequired,
  toggleEsriLayer: PropTypes.func.isRequired,
};

export default FilterButtonContainer;
