import React, { Component } from 'react';
import { Portal } from 'react-portal';

function toggleFilters() {
  if (document.getElementsByClassName('control-panel--hidden')[0]) {
    const controlPanel = document.getElementsByClassName('control-panel--hidden')[0];
    controlPanel.className = 'control-panel';
    if (document.getElementsByClassName('basemap-panel')[0]) {
      const controlPanel = document.getElementsByClassName('basemap-panel')[0];
      controlPanel.className = 'basemap-panel--hidden';
    }
  } else {
    const controlPanel = document.getElementsByClassName('control-panel')[0];
    controlPanel.className = 'control-panel--hidden';
  }
}

export default class ControlPanelToggleButton extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-left')[0]}>
        <div className="control-panel__filter-toggle">
          <button
            className="control-panel__filter-toggle-button"
            aria-label="Show Filters"
            onClick={toggleFilters}
            type="button"
          />
        </div>
      </Portal>
    );
  }
}
