import React from 'react';
import {Component} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

const defaultMapStyle = fromJS(MAP_STYLE);

const image = {
  'Protected Pathways': 'bike-lane',
  'Walking Trails': 'multi-use',
  'Proposed Trails': 'shared',
}

export default class ControlPanel extends Component {
  hideFilters(event) {
    const controlPanel = document.getElementsByClassName("control-panel")[0];
    controlPanel.className = 'control-panel control-panel--hidden';
  }

  newVisibleStatus(layerVisible, mapStyle, layerIndex) {
    if (layerVisible === 'visible') {
      return this.props.mapStyle.setIn(['layers', layerIndex, 'layout', 'visibility'], 'none')
    } else {
      return this.props.mapStyle.setIn(['layers', layerIndex, 'layout', 'visibility'], 'visible')
    }
  }

  toggleVisibility(layerId, event) {
    const layerVisible = this.props.layers.filter(layer => layer.get('id') === layerId).first().getIn(['layout', 'visibility']);
    const layerIndex = this.props.layers.findIndex(layer => layer.get('id') === layerId)
    const updatedMapStyle = this.newVisibleStatus(layerVisible, this.props.mapStyle, layerIndex);

    this.props.updateStateWith(updatedMapStyle);
  }

  renderLayerControl(name) {
    const visibility = this.props.layers.filter(layer => layer.get('id') === name).first().getIn(['layout', 'visibility']);

    return (
      <button id={name}
              key={name}
              className="filter-button"
              type="button"
              style={{ backgroundImage: `url(${require(`../../../assets/images/${image[name]}.png`)})` }}
              onClick={this.toggleVisibility.bind(this, name)}>
        <div className="filler"></div>
        {name}
        <div className='filter-button__overlay'></div>
      </button>
    );
  }

  render() {
    return (
      <div className="control-panel">
        <h2 className="control-panel__title">Trailmap Filters</h2>
        <button
          className="control-panel__close"
          onClick={this.hideFilters.bind(this)}
          type="button">
                  Close
        </button>
        {  this.props.layers
          .filterNot(layer => defaultMapStyle.get('layers').map(layer => layer.get('id')).includes(layer.get('id')))
          .map(layer => this.renderLayerControl(layer.get('id'))) }
      </div>
    );
  }
}
