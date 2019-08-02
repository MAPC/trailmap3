import React from 'react';
import {Component} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import {json as requestJson} from 'd3-fetch';

const defaultMapStyle = fromJS(MAP_STYLE);

const image = {
  'Protected Pathways': 'protected-pathways',
  'Separate Lane': 'separate-lane',
  'Shared Roadway': 'shared-roadway',
  'Improved Paths': 'improved-paths',
  'Unimproved Paths': 'unimproved-paths'
};

const trailStatus = [
  'Proposed',
  'Existing'
];

const trailTypes = [
  'Protected Pathways',
  'Separate Lane',
  'Shared Roadway',
];

const surfaceTypes = [
  'Improved Paths',
  'Unimproved Paths',
];

const enumsFromFacTypeValue = {
  'Protected Pathways': [2,5],
  'Separate Lane': [1,4],
  'Shared Roadway': [3,7,9]
}

const enumsFromFacStatValue = {
  'Existing': [1],
  'Proposed': [2]
}

const enumsFromSurfTypeValue = {
  'Unimproved Paths': [1],
  'Improved Paths': [2,3,4,5,6,7,8,9,10,11]
}

const layers = fromJS({
  layers: [{
        id: 'Protected Pathways',
        type: 'line',
        source: 'path_overlay',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#0874b9',
          'line-width': 2,
        }
      }]
})

export default class ControlPanel extends Component {
  state = {
    overlay: {
      fac_stat: ['Existing'],
      fac_type: [],
      surface_type: ['Improved Paths'],
    }
  };

  isProposedVisible() {
    if (this.state.overlay.fac_stat.includes('Proposed')) {
      return true;
    } else {
      return false;
    }
  }

  requestUrl(facStat, facType, surfaceType) {
    const selectString = "SELECT fac_type, fac_stat, surf_type, public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),'+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '),6) AS the_geom";
    let conditions = [];

    if (facStat.length !== 0) {
      conditions.push(`fac_stat IN (${facStat.join(',')})`)
    } else {
      conditions.push(`fac_stat IN (null)`)
    }
    if (facType.length !== 0) {
      conditions.push(`fac_type IN (${facType.join(',')})`)
    } else {
      conditions.push(`fac_type IN (null)`)
    }
    if (surfaceType.length !== 0) {
      conditions.push(`surf_type IN (${surfaceType.join(',')})`)
    } else {
      conditions.push(`surf_type IN (null)`)
    }

    return encodeURI('https://prql.mapc.org/?query= ' + selectString + ' FROM mapc.trans_bike_facilities WHERE ' + conditions.join(' AND ') + ' &token=e2e3101e16208f04f7415e36052ce59b')
  }

  addLayer(newData, source, mapStyle) {
    let mapStyleWithNewSource = mapStyle.deleteIn(['sources', source])
    if (newData.rows !== null) {
      const geoJson = newData.rows.map(rows => ({type: 'Feature', geometry: JSON.parse(rows.the_geom), properties: { fac_type: rows.fac_type, fac_stat: rows.fac_stat }}));
      mapStyleWithNewSource = mapStyle.setIn(['sources', source], { type: 'geojson' })
                                      .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
                                      .setIn(['sources', source, 'data', 'features'], geoJson)
                                      .set('layers', mapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)))
    }
    this.props.updateStateWith(mapStyleWithNewSource);
  }

  hideFilters(event) {
    const controlPanel = document.getElementsByClassName("control-panel")[0];
    controlPanel.className = 'control-panel control-panel--hidden';
  }

  withoutPreviousLayer() {
    let updatedMapStyle = this.props.mapStyle;
    const layerToDeleteIndex = this.props.mapStyle.get('layers').findIndex(layer => layer.get('source') === 'path_overlay');
    if (layerToDeleteIndex > 0) {
      updatedMapStyle = this.props.mapStyle.deleteIn(['layers', layerToDeleteIndex]);
    }
    return updatedMapStyle;
  }

  updateFacStat(layerId, event) {
    let updatedFacStat = [];

    if(this.state.overlay['fac_stat'].includes(layerId)) {
      updatedFacStat = this.state.overlay['fac_stat'].filter(id => id !== layerId)
    } else {
      updatedFacStat = this.state.overlay['fac_stat'].concat([layerId])
    }

    this.setState({
      overlay: { ...this.state.overlay, fac_stat: updatedFacStat }
    })

    requestJson(this.requestUrl(updatedFacStat.map(value => enumsFromFacStatValue[value]),
                                this.state.overlay.fac_type.map(value => enumsFromFacTypeValue[value]),
                                this.state.overlay.surface_type.map(value => enumsFromSurfTypeValue[value]))).then((map) => {
      this.addLayer(map, 'path_overlay', this.withoutPreviousLayer());
    });
  }

  updateFacType(layerId, event) {
    let updatedFacType = [];

    if(this.state.overlay['fac_type'].includes(layerId)) {
      updatedFacType = this.state.overlay['fac_type'].filter(id => id !== layerId)
    } else {
      updatedFacType = this.state.overlay['fac_type'].concat([layerId])
    }

    this.setState({
      overlay: { ...this.state.overlay, fac_type: updatedFacType }
    })

    requestJson(this.requestUrl(this.state.overlay.fac_stat.map(value => enumsFromFacStatValue[value]),
                                updatedFacType.map(value => enumsFromFacTypeValue[value]),
                                this.state.overlay.surface_type.map(value => enumsFromSurfTypeValue[value]))).then((map) => {
      this.addLayer(map, 'path_overlay', this.withoutPreviousLayer());
    });
  }

  updateSurfaceType(layerId, event) {
    let updatedSurfType = [];

    if(this.state.overlay['surface_type'].includes(layerId)) {
      updatedSurfType = this.state.overlay['surface_type'].filter(id => id !== layerId)
    } else {
      updatedSurfType = this.state.overlay['surface_type'].concat([layerId])
    }

    this.setState({
      overlay: { ...this.state.overlay, surface_type: updatedSurfType }
    })

    requestJson(this.requestUrl(this.state.overlay.fac_stat.map(value => enumsFromFacStatValue[value]),
                                this.state.overlay.fac_type.map(value => enumsFromFacTypeValue[value]),
                                updatedSurfType.map(value => enumsFromSurfTypeValue[value]))).then((map) => {
      this.addLayer(map, 'path_overlay', this.withoutPreviousLayer());
    });
  }

  renderFacTypeControl(name) {
    return (
      <button id={name}
              key={name}
              className="filter-button"
              type="button"
              style={{ backgroundImage: `url(${require(`../../../assets/images/${image[name]}@2x.png`)})` }}
              onClick={this.updateFacType.bind(this, name)}>
        <div className="filler"></div>
        {name}
        <div className='filter-button__overlay'></div>
      </button>
    );
  }

  renderFacStatControl() {
    return (
      <div className="toggle-switch">
        <label className="toggle-switch__label">
          <input id="Proposed"
                  key="Proposed"
                  className="toggle-switch__input"
                  type="checkbox"
                  checked={this.isProposedVisible()}
                  onChange={this.updateFacStat.bind(this, "Proposed")}>
          </input>
          <span className="toggle-switch__slider"></span>
        </label>
        <span className="toggle-switch__label">Proposed</span>
      </div>
    );
  }

  renderSurfaceTypeControl(name) {
    return (
      <button id={name}
              key={name}
              className="sub-filter-button"
              type="button"
              onClick={this.updateSurfaceType.bind(this, name)}>
        <div className="sub-filter-button__image"
             style={{ backgroundImage: `url(${require(`../../../assets/images/${image[name]}@2x.png`)})` }}>
        </div>
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
        { this.renderFacStatControl() }
        { trailTypes.map(trailType => this.renderFacTypeControl(trailType)) }
        { surfaceTypes.map(surfaceType => this.renderSurfaceTypeControl(surfaceType)) }
      </div>
    );
  }
}
