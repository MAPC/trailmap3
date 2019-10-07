import React from 'react';

function FilterButtonContainer(props) {
  let buttonContainerName = 'filter-buttons__button-container';
  let filterButtonsSliderName = 'filter-buttons__slider';
  if (props.allValuesIn(props.facType, props.enumsFromFacTypeValue[props.trailType.name])) {
    filterButtonsSliderName += ' filter-buttons__slider--selected';
    buttonContainerName += ' filter-buttons__button-container--selected';
  }
  return (
    <div>
    <div>{props.trailType.name}</div>
    <div className="filter-buttons__container" key={props.trailType.name}>
      <div className={buttonContainerName}>
        <button
          id={props.trailType.name}
          className="filter-buttons__button"
          type="button"
          style={{ backgroundImage: `url(${require(`../../../../assets/images/${props.trailType.name.replace(/\s+/g, '-').toLowerCase()}@2x.png`)})` }}
          //onClick={updateOverlay(this, trailType, 'path_overlay')}
        />
        <label htmlFor={props.trailType.name} className="filter-buttons__label">
          {props.trailType.name}
        </label>
        <div className="filter-buttons__slider-container">
          <div
            className={filterButtonsSliderName}
            // onClick={this.updateOverlay(this, trailType,'path_overlay')}
          />
        </div>
      </div>
      <div className="filter-buttons__child-container">
        <div className="filter-buttons__description">
          {props.trailType.description}
        </div>
        <div className="filter-buttons__children">
          {/* {trailType.children.map(child => this.renderChildControl(child))} */}
        </div>
      </div>
    </div>
    </div>
);
}

export default FilterButtonContainer;
