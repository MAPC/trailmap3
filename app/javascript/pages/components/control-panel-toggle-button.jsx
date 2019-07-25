import React from 'react';
import {Component} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

const defaultMapStyle = fromJS(MAP_STYLE);

export default class ControlPanelToggleButton extends Component {
  showFilters(event) {
    const controlPanel = document.getElementsByClassName("control-panel")[0];
    controlPanel.className = 'control-panel';
  }

  render() {
    return (
      <div className="control-panel__filter-toggle">
        <button className="control-panel__filter-toggle-button"
                aria-label="Show Filters"
                onClick={this.showFilters.bind(this)} />
      </div>
    );
  }
}
