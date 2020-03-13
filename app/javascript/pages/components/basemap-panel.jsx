import React, { Component } from 'react';
import { fromJS } from 'immutable';
import MAPBOX_LITE from './map/lite.json';
import CALI_TERRAIN from './map/cali.json';
import SATELLITE from './map/satellite.json';
import OPENSTREETMAP from './map/openstreetmap.json';

const mapboxLite = fromJS(MAPBOX_LITE);
const caliTerrain = fromJS(CALI_TERRAIN);
const satellite = fromJS(SATELLITE);
const osm = fromJS(OPENSTREETMAP);

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
           &#10005;
        </button>
        <div className="basemap-panel__options">
          <button
            onClick={this.props.changeBasemap.bind(this, mapboxLite)}
            type="button"
            className="basemap-panel__options-lite"
          />
          <button
            onClick={() => this.props.changeBasemap(caliTerrain)}
            type="button"
            className="basemap-panel__options-cali"
          />
          <button
            onClick={() => this.props.changeBasemap(satellite)}
            type="button"
            className="basemap-panel__options-satellite"
          />
          <button
            onClick={() => this.props.changeBasemap(osm)}
            type="button"
            className="basemap-panel__options-openstreetmap"
          />
        </div>
      </div>
    );
  }
}
