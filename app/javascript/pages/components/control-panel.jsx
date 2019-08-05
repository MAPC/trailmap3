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

const enumsFromSurfaceTypeValue = {
  'Unimproved Paths': [1],
  'Improved Paths': [2,3,4,5,6,7,8,9,10,11]
}

const controlPanelOptions = [
  { name: 'Protected Pathways',
    description: 'Corridors for walking and/or cycling that are off the road right-of-way physically separated from motor vehicle traffic',
    defaultState: {
      facStat: [1],
      facType: [2,5],
      surfaceType: [1,2,3,4,5,6,7,8,9,10,11],
      facDetail: [10,11,12,13,14,20,21,22,23,31,32,41,42,51,52,53,54,61,62,63,71,72,73,74,75,76,81,82,83,91,92,93,94]
    },
    children: [
      { name: 'Improved Paths',
        overlayType: 'surfType',
        overlayValues: [2,3,4,5,6,7,8,9,10,11],
      },
      { name: 'Unimproved Paths',
        overlayType: 'surfType',
        overlayValues: [1]
        },
      { name: 'Protected Bike Lane',
        overlayType: 'facType',
        overlayValues: [2]
        },
    ]
  },
  { name: 'Separate Lane',
    description: 'Corridors where cyclists or pedestrians have a designated lane in the roadway, which may be adjacent to motor vehicle travel lanes',
    defaultState: {
      facStat: [1],
      facType: [1,4],
      surfaceType: [1,2,3,4,5,6,7,8,9,10,11],
      facDetail: [10,11,12,13,14,20,21,22,23,31,32,41,42,51,52,53,54,61,62,63,71,72,73,74,75,76,81,82,83,91,92,93,94]
    },
    children: [
      { name: 'Bike Lane',
        overlayType: 'facType',
        overlayValues: [2],
      },
    ]
  },
  { name: 'Shared Roadway',
    description: 'Corridors where cyclists or pedestrians share the roadway space with other users',
    defaultState: {
      facStat: [1],
      facType: [3,7,9],
      surfaceType: [1,2,3,4,5,6,7,8,9,10,11],
      facDetail: [10,11,12,13,14,20,21,22,23,31,32,41,42,51,52,53,54,61,62,63,71,72,73,74,75,76,81,82,83,91,92,93,94]
    },
    children: [
      { name: 'Advisory Shoulders',
        overlayType: 'facDetail',
        overlayValues: [14],
      },
      { name: 'Shared Lane Marking',
        overlayType: 'facType',
        overlayValues: [9],
      },
    ]
  }
]

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
      facStat: [1],
      facType: [],
      surfaceType: [1,2,3,4,5,6,7,8,9,10,11],
      facDetail: [10,11,12,13,14,20,21,22,23,31,32,41,42,51,52,53,54,61,62,63,71,72,73,74,75,76,81,82,83,91,92,93,94],
    }
  };

  isProposedVisible() {
    if (this.state.overlay.facStat.includes('Proposed')) {
      return true;
    } else {
      return false;
    }
  }

  requestUrl({facStat, facType, surfaceType}) {
    const selectString = "SELECT fac_type, fac_stat, surf_type, fac_detail, public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),'+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '),6) AS the_geom";
    const facStatEnums = facStat ? facStat : this.state.overlay.facStat
    const facTypeEnums = facType ? facType : this.state.overlay.facType
    const surfaceTypeEnums = surfaceType ? surfaceType : this.state.overlay.surfaceType
    let conditions = [];

    if (facStatEnums.length !== 0) {
      conditions.push(`fac_stat IN (${facStatEnums.join(',')})`)
    } else {
      conditions.push(`fac_stat IN (null)`)
    }
    if (facTypeEnums.length !== 0) {
      conditions.push(`fac_type IN (${facTypeEnums.join(',')})`)
    } else {
      conditions.push(`fac_type IN (null)`)
    }
    if (surfaceTypeEnums.length !== 0) {
      conditions.push(`surf_type IN (${surfaceTypeEnums.join(',')})`)
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

  updateOverlay(property, values, event) {
    let updatedProperty = this.state.overlay[property];

    values.map(value => {
      if(this.state.overlay[property].includes(value)) {
        updatedProperty = updatedProperty.filter(id => id !== value)
        console.log('Removed value:', value)
        console.log('Updated property with removed value:', updatedProperty)
      } else {
        updatedProperty = updatedProperty.concat([value])
      }
    })

    this.setState({
      overlay: { ...this.state.overlay, [property]: updatedProperty }
    })

    requestJson(this.requestUrl({ [property]: updatedProperty })).then((map) => {
      this.addLayer(map, 'path_overlay', this.withoutPreviousLayer());
    });
  }

  renderProposedControl() {
    return (
      <div className="toggle-switch">
        <label className="toggle-switch__label">
          <input id="Proposed"
                  key="Proposed"
                  className="toggle-switch__input"
                  type="checkbox"
                  checked={this.isProposedVisible()}
                  onChange={this.updateOverlay.bind(this, 'facStat', [2,3])}>
          </input>
          <span className="toggle-switch__slider"></span>
        </label>
        <span className="toggle-switch__label">Proposed</span>
      </div>
    );
  }

  renderParentControl(name, overlayType) {
    let className = 'filter-button__overlay';
    if (this.allValuesIn(this.state.overlay[overlayType], enumsFromFacTypeValue[name])) {
      className += ' filter-button__overlay--selected';
    }

    return (
      <button id={name}
              key={name}
              className="filter-button"
              type="button"
              style={{ backgroundImage: `url(${require(`../../../assets/images/${image[name]}@2x.png`)})` }}
              onClick={this.updateOverlay.bind(this, 'facType', enumsFromFacTypeValue[name])}>
        <div className="filler"></div>
        {name}
        <div className={className}></div>
      </button>
    );
  }

  allValuesIn(a, b) {
    const booleans = b.map(value => a.includes(value))
    return !booleans.includes(false)
  }

  renderChildControl(name, overlayType) {
    let className = 'filter-button__overlay';
    if (this.allValuesIn(this.state.overlay[overlayType], enumsFromSurfaceTypeValue[name])) {
      className += ' filter-button__overlay--selected';
    }

    return (
      <button id={name}
              key={name}
              className="sub-filter-button"
              type="button"
              onClick={this.updateOverlay.bind(this, 'surfaceType', enumsFromSurfaceTypeValue[name])}>
        <div className="sub-filter-button__image"
             style={{ backgroundImage: `url(${require(`../../../assets/images/${image[name]}@2x.png`)})` }}>
        </div>
        {name}
        <div className={className}></div>
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
        { this.renderProposedControl() }
        { controlPanelOptions.map(trailType => this.renderParentControl(trailType.name, 'facType')) }
        { surfaceTypes.map(surfaceType => this.renderChildControl(surfaceType, 'surfaceType')) }
      </div>
    );
  }
}
