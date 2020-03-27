import React from 'react';
import PropTypes from 'prop-types';

const mapboxLite = 'mapbox://styles/mapbox/light-v10';
const caliTerrain = 'mapbox://styles/ihill/ck0zc5g2v17c31cpd3c5jg1ye';
const satellite = 'mapbox://sprites/mapbox/satellite-v9';
const osm = 'mapbox://styles/mapbox/streets-v11';
const hideFilters = () => {
  const basemapPanel = document.getElementsByClassName('basemap-panel')[0];
  basemapPanel.className = 'basemap-panel basemap-panel--hidden';
};
const BasemapPanel = ({ changeBasemap }) => (
  <div id="basemap-panel" className="basemap-panel--hidden">
    <h2 className="basemap-panel__title">Basemaps</h2>
    <button
      className="basemap-panel__close"
      type="button"
      onClick={hideFilters}
    >
&#10005;
    </button>
    <div className="basemap-panel__options">
      <button
        onClick={() => changeBasemap(mapboxLite)}
        type="button"
        className="basemap-panel__options-lite"
      />
      <button
        onClick={() => changeBasemap(caliTerrain)}
        type="button"
        className="basemap-panel__options-cali"
      />
      <button
        onClick={() => changeBasemap(satellite)}
        type="button"
        className="basemap-panel__options-satellite"
      />
      <button
        onClick={() => changeBasemap(osm)}
        type="button"
        className="basemap-panel__options-openstreetmap"
      />
    </div>
  </div>
);
BasemapPanel.propTypes = {
  changeBasemap: PropTypes.func.isRequired,
};
export default BasemapPanel;
