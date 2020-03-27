/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { BaseControl } from 'react-map-gl';
import FilterButtonContainer from './control-panel/filter-button-container';
import ProposedToggle from './control-panel/propsed-toggle';

export default class ControlPanel extends BaseControl {
  constructor(props) {
    super(props);
    this.state = {
      proposedChecked: false,
      origScreenWidth: 0,
    };
    this.changeToggleState = this.changeToggleState.bind(this);
  }

  changeToggleState() {
    this.setState((prevState) => {
      const newToggleState = !prevState.proposedChecked;
      return { proposedChecked: newToggleState };
    });
  }

  hideFilters() {
    const controlPanel = document.getElementsByClassName('control-panel')[0];
    controlPanel.className = 'control-panel control-panel--hidden';
  }

  componentDidMount() {
    document.querySelector('.filter__button-paved-paths').click();
    document.querySelector('.filter__button-unimproved-paths').click();
    document.querySelector('.filter__button-protected-bike-lane').click();
    document.querySelector('.filter__button-bike-lane').click();
    this.setState({ origScreenWidth: window.screen.availWidth });
  }

  render() {
    let controlPanelClass;
    if (this.state.origScreenWidth < 426) {
      controlPanelClass = 'control-panel--hidden';
    } else {
      controlPanelClass = 'control-panel';
    }
    const trailTypes = [
      'Paved Paths',
      'Unimproved Paths',
      'Protected Bike Lane',
      'Bike Lane',
      'Paved Footway',
      'Natural Surface Footway',
    ];
    const filterButtons = trailTypes.map(trailType => (
      <FilterButtonContainer
        key={trailType}
        trailType={trailType}
        toggleEsriLayer={this.props.toggleEsriLayer}
      />
    ));

    return (
      <div id="control-panel" className={controlPanelClass}>
        <h2 className="control-panel__title">Trailmap Filters</h2>
        <button
          className="control-panel__close"
          onClick={this.hideFilters.bind(this)}
          type="button"
        >
          &#10005;
        </button>
        <hr className="control-panel__hr" />
        <ProposedToggle
          changeToggleState={this.changeToggleState}
          toggleEsriProposedLayer={this.props.toggleEsriProposedLayer}
        />
        <div className="filter__container">
          { filterButtons }
        </div>
      </div>
    );
  }
}
