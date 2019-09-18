import React from 'react';
import {Component} from 'react';
import { Portal } from 'react-portal';


export default class ControlPanelToggleButton extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  toggleFilters(event) {
    if (!!document.getElementsByClassName('control-panel--hidden')[0]) {
      const controlPanel = document.getElementsByClassName('control-panel--hidden')[0];
      controlPanel.className = 'control-panel';
    } else {
      const controlPanel = document.getElementsByClassName('control-panel')[0];
      controlPanel.className = 'control-panel--hidden';
    }
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-left')[0]}>
        <div className="control-panel__filter-toggle">
          <button className="control-panel__filter-toggle-button"
                  aria-label="Show Filters"
                  onClick={this.toggleFilters.bind(this)} />
        </div>
      </Portal>
    );
  }
}
