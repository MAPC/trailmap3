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

const surfaceType = [
  'Improved Paths',
  'Unimproved Paths',
];

const enumFromFacTypeValue = {
  'Protected Pathways': 2,
  'Separate Lane': 1,
  'Shared Roadway': 9
}

const enumFromFacStatValue = {
  'Existing': 1,
  'Proposed': 2
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
      surface_type: [1,2,3,4,5,6,7,8,9,10,11],
    }
  };

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

  updateFacStat(layerId, event) {
    let updatedMapStyle = this.props.mapStyle
    let updatedFacStat = [];
    const layerToDeleteIndex = this.props.mapStyle.get('layers').findIndex(layer => layer.get('source') === 'path_overlay');
    if (layerToDeleteIndex > 0) {
      updatedMapStyle = this.props.mapStyle.deleteIn(['layers', layerToDeleteIndex]);
    }

    if(this.state.overlay['fac_stat'].includes(layerId)) {
      updatedFacStat = this.state.overlay['fac_stat'].filter(id => id !== layerId)
    } else {
      updatedFacStat = this.state.overlay['fac_stat'].concat([layerId])
    }

    this.setState({
      overlay: { ...this.state.overlay, fac_stat: updatedFacStat }
    })

    requestJson(this.requestUrl(updatedFacStat.map(value => enumFromFacStatValue[value]),
                                this.state.overlay.fac_type.map(value => enumFromFacTypeValue[value]),
                                this.state.overlay.surface_type)).then((map) => {
      this.addLayer(map, 'path_overlay', updatedMapStyle);
    });
  }

  updateFacType(layerId, event) {
    let updatedMapStyle = this.props.mapStyle
    let updatedFacType = [];
    const layerToDeleteIndex = this.props.mapStyle.get('layers').findIndex(layer => layer.get('source') === 'path_overlay');
    if (layerToDeleteIndex > 0) {
      updatedMapStyle = this.props.mapStyle.deleteIn(['layers', layerToDeleteIndex]);
    }

    if(this.state.overlay['fac_type'].includes(layerId)) {
      updatedFacType = this.state.overlay['fac_type'].filter(id => id !== layerId)
    } else {
      updatedFacType = this.state.overlay['fac_type'].concat([layerId])
    }

    this.setState({
      overlay: { ...this.state.overlay, fac_type: updatedFacType }
    })

    requestJson(this.requestUrl(this.state.overlay.fac_stat.map(value => enumFromFacStatValue[value]),
                                updatedFacType.map(value => enumFromFacTypeValue[value]),
                                this.state.overlay.surface_type)).then((map) => {
      this.addLayer(map, 'path_overlay', updatedMapStyle);
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

  renderFacStatControl(name) {
    return (
      <button id={name}
              key={name}
              className="filter-button"
              type="button"
              onClick={this.updateFacStat.bind(this, name)}>
        {name}
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
        { trailTypes.map(trailType => this.renderFacTypeControl(trailType)) }
        { trailStatus.map(trailStatus => this.renderFacStatControl(trailStatus)) }
      </div>
    );
  }
}
