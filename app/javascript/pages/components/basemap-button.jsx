import React, { Component } from 'react';
import { Portal } from 'react-portal';

function togglePanel() {
  if (document.getElementsByClassName('basemap-panel--hidden')[0]) {
    const basemapPanel = document.getElementsByClassName('basemap-panel--hidden')[0];
    basemapPanel.className = 'basemap-panel';
    if (document.getElementsByClassName('control-panel')[0]) {
      const controlPanel = document.getElementsByClassName('control-panel')[0];
      controlPanel.className = 'control-panel--hidden';
    }
  } else {
    const basemapPanel = document.getElementsByClassName('basemap-panel')[0];
    basemapPanel.className = 'basemap-panel--hidden';
  }
}

export default class BasemapButton extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-left')[0]}>
        <div className="basemap-panel__filter-toggle">
          <button
            className="basemap-panel__filter-toggle-button"
            aria-label="Choose basemap"
            onClick={togglePanel}
            type="button"
          />
        </div>
      </Portal>
    );
  }
}
