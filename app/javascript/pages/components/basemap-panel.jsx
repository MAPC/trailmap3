import React, { Component } from 'react';
import { fromJS } from 'immutable';
import MAP_STYLE from './light.json';
import SECOND_MAP_STYLE from './cali.json';

const mapboxLite = fromJS(MAP_STYLE);
const caliTerrain = fromJS(SECOND_MAP_STYLE);

export default class BasemapPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      basemap: mapboxLite,
    };
    this.el = document.createElement('div');
    this.hideFilters = this.hideFilters.bind(this);
  }

  hideFilters() {
    const basemapPanel = document.getElementsByClassName('basemap-panel')[0];
    basemapPanel.className = 'basemap-panel basemap-panel--hidden';
  }

  render() {
    return (
      <div id="basemap-panel" className="basemap-panel--hidden">
        <h2 className="basemap-panel__title">Basemaps</h2>
        <button
          className="basemap-panel__close"
          type="button"
          onClick={this.hideFilters}
        >
          X
        </button>
        <div className="basemap-panel__options">
          <button
            onClick={this.props.changeBasemap.bind(this, mapboxLite)}
            type="button"
            className="basemap-panel__options-lite"
          />
          <button
            // onClick={this.props.changeBasemap.bind(this, caliTerrain)}
            onClick={() => this.props.changeBasemap(caliTerrain)}
            type="button"
            className="basemap-panel__options-cali"
          />

        </div>
      </div>
    );
  }
}
