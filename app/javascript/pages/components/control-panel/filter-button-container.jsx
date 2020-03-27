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
    <div className={`filter filter__${trailType.replace(/\s+/g, '-').toLowerCase()}`} key={trailType}>
      <button
        id={trailType}
        className={buttonClasses}
        type="button"
        onClick={() => {
          toggleEsriLayer(trailType);
          toggleCSS(trailType);
        }}
      />
      <span className="filter__label">
        {trailType}
      </span>
      <div className="filter__slider-container">
        <div
          className="filter__slider"
          onClick={() => {
            toggleEsriLayer(trailType);
            toggleCSS(trailType);
          }}
          onKeyPress={() => {
            toggleEsriLayer(trailType);
            toggleCSS(trailType);
          }}
          role="button"
          tabIndex={0}
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
