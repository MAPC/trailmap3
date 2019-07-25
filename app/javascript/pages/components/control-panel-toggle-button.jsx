import React from 'react';
import {Component} from 'react';
import { Portal } from 'react-portal';


export default class ControlPanelToggleButton extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  showFilters(event) {
    const controlPanel = document.getElementsByClassName('control-panel')[0];
    controlPanel.className = 'control-panel';
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-left')[0]}>
        <div className="control-panel__filter-toggle">
          <button className="control-panel__filter-toggle-button"
                  aria-label="Show Filters"
                  onClick={this.showFilters.bind(this)} />
        </div>
      </Portal>
    );
  }
}
