import React from 'react';
import {Component} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import {json as requestJson} from 'd3-fetch';

const defaultMapStyle = fromJS(MAP_STYLE);

const enumsFromFacTypeValue = {
  'Protected Pathways': [2,5],
  'Separate Lane': [1],
  'Shared Roadway': [9]
}

const colors = {
  1: '#0874b9',
  2: '#7f3193',
  3: '#ADD8E6',
  4: '#0874b9',
  5: '#7f3193',
  7: '#ADD8E6',
  9: '#ADD8E6',
}

const opacity = {
  1: 1,
  2: 0,
  3: 0
}

const controlPanelOptions = [
  { name: 'Protected Pathways',
    description: 'Corridors for walking and/or cycling that are off the road right-of-way physically separated from motor vehicle traffic',
    overlayType: 'facType',
    overlayValues: [2,5],
    children: [
      { name: 'Improved Paths',
        overlayType: 'surfaceType',
        overlayValues: [2,3,4,5,6,7,8,9,10,11],
      },
      { name: 'Unimproved Paths',
        overlayType: 'surfaceType',
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
    overlayType: 'facType',
    overlayValues: [1],
    children: [
      { name: 'Bike Lane',
        overlayType: 'facType',
        overlayValues: [1],
      },
    ]
  },
  { name: 'Shared Roadway',
    description: 'Corridors where cyclists or pedestrians share the roadway space with other users',
    overlayType: 'facType',
    overlayValues: [9],
    children: [
      { name: 'Bike/Ped Priority Roadway',
        overlayType: 'facDetail',
        overlayValues: [7],
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
        id: 'Existing Trails',
        type: 'line',
        source: 'path_overlay',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-opacity': ['get', 'opacity']
        }
      },
      {
        id: 'Proposed Trails',
        type: 'line',
        source: 'proposed_overlay',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-dasharray': [2, 2],
        }
      }]
})

export default class ControlPanel extends Component {
  state = {
    overlay: {
      facStat: [1],
      facType: [],
      surfaceType: [2,3,4,5,6,7,8,9,10,11],
      facDetail: [10,11,12,13,14,20,21,22,23,31,32,41,42,51,52,53,54,61,62,63,71,72,73,74,75,76,81,82,83,91,92,93,94],
    },
  };

  allValuesIn(a, b) {
    return !b.map(value => a.includes(value)).includes(false)
  }

  isProposedVisible() {
    if (this.allValuesIn(this.state.overlay.facStat, [2,3])) {
      return true;
    } else {
      return false;
    }
  }

  requestUrl({facStat, facType, surfaceType, source}) {
    const selectString = "SELECT fac_type, fac_stat, surf_type, fac_detail, public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),'+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '),6) AS the_geom";
    let facStatEnums = facStat ? facStat : this.state.overlay.facStat
    const facTypeEnums = facType ? facType : this.state.overlay.facType
    const surfaceTypeEnums = surfaceType ? surfaceType : this.state.overlay.surfaceType
    let andConditions = [];

    if(source === 'proposed_overlay') {
      facStatEnums = [2,3]
    }

    if (facStatEnums.length !== 0) {
      andConditions.push(`fac_stat IN (${facStatEnums.join(',')})`)
    } else {
      andConditions.push(`fac_stat IN (null)`)
    }
    if (facTypeEnums.length !== 0) {
      andConditions.push(`fac_type IN (${facTypeEnums.join(',')})`)
    } else {
      andConditions.push(`fac_type IN (null)`)
    }
    if (surfaceTypeEnums.length !== 0) {
      if (!surfaceTypeEnums.includes(1)) {
        andConditions.push(`(surf_type IN (${surfaceTypeEnums.join(',')}) OR surf_type IS NULL)`)
      } else {
        andConditions.push(`(surf_type IN (${surfaceTypeEnums.join(',')}) OR surf_type IS NULL)`)
      }
    } else {
      andConditions.push(`surf_type IN (null)`)
    }

    return encodeURI('https://prql.mapc.org/?query= ' + selectString + ' FROM mapc.trans_bike_facilities WHERE ' + andConditions.join(' AND ') + ' &token=e2e3101e16208f04f7415e36052ce59b')
  }

  addLayer(newData, source, mapStyle) {
    let mapStyleWithNewSource = mapStyle.deleteIn(['sources', source])
    if (newData.rows !== null) {
      const geoJson = newData.rows.map(rows => ({type: 'Feature', geometry: JSON.parse(rows.the_geom), properties: { fac_type: rows.fac_type, fac_stat: rows.fac_stat, color: colors[rows.fac_type], opacity: opacity[rows.fac_stat] }}));
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

  withoutPreviousLayer(source) {
    let updatedMapStyle = this.props.mapStyle;
    const layerToDeleteIndex = this.props.mapStyle.get('layers').findIndex(layer => layer.get('source') === source);
    if (layerToDeleteIndex > 0) {
      updatedMapStyle = this.props.mapStyle.deleteIn(['layers', layerToDeleteIndex]);
    }
    return updatedMapStyle;
  }

  updateOverlay(property, values, source, event) {
    let updatedProperty = this.state.overlay[property];

    values.map(value => {
      if(this.state.overlay[property].includes(value)) {
        updatedProperty = updatedProperty.filter(id => id !== value)
      } else {
        updatedProperty = updatedProperty.concat([value])
      }
    })

    this.setState({
      overlay: { ...this.state.overlay, [property]: updatedProperty }
    })

    requestJson(this.requestUrl({ [property]: updatedProperty, source: 'path_overlay' })).then((map) => {
      this.addLayer(map, source, this.withoutPreviousLayer(source));
    });

    if(this.isProposedVisible() && property !== 'facStat') {
      requestJson(this.requestUrl({ [property]: updatedProperty, source: 'proposed_overlay' })).then((map) => {
        this.addLayer(map, 'proposed_overlay', this.withoutPreviousLayer('proposed_overlay'));
      });
    }
  }

  renderProposedControl() {
    return (
      <div className="toggle-switch">
        <span className="toggle-switch__label">Proposed</span>
        <label className="toggle-switch__label">
          <input id="Proposed"
                  key="Proposed"
                  className="toggle-switch__input"
                  type="checkbox"
                  checked={this.isProposedVisible()}
                  onChange={this.updateOverlay.bind(this, 'facStat', [2,3], 'proposed_overlay')}>
          </input>
        </label>
      </div>
    );
  }

  renderParentControl(trailType) {
    let className = 'filter-buttons__overlay';
    if (this.allValuesIn(this.state.overlay['facType'], enumsFromFacTypeValue[trailType.name])) {
      className += ` filter-buttons__overlay--selected-${trailType.name.replace(/\s+/g, '-').toLowerCase()}`;
    }
    const buttonContainerName = `filter-buttons__button-container-${trailType.name.replace(/\s+/g, '-').toLowerCase()}`
    let filterButtonsSliderName = 'filter-buttons__slider';
    if (this.allValuesIn(this.state.overlay['facType'], enumsFromFacTypeValue[trailType.name])) {
      className += ' filter-buttons__slider--selected';
    }

    return (
      <div className="filter-buttons__container" key={trailType.name}>
        <div className={buttonContainerName}>
          <button id={trailType.name}
                  className="filter-buttons__button"
                  type="button"
                  style={{ backgroundImage: `url(${require(`../../../assets/images/${trailType.name.replace(/\s+/g, '-').toLowerCase()}@2x.png`)})` }}
                  onClick={this.updateOverlay.bind(this, trailType.overlayType, trailType.overlayValues, 'path_overlay')}>
            <div className={className}></div>
          </button>
          <label htmlFor={trailType.name} className="filter-buttons__label">
            {trailType.name}
          </label>
          <div className="filter-buttons__slider-container">
            <div className={filterButtonsSliderName}>
            </div>
          </div>
        </div>
        <div className="filter-buttons__description">
          {trailType.description}
          <div className="filter-buttons__children">
            {trailType.children.map(child => this.renderChildControl(child))}
          </div>
        </div>
      </div>
    );
  }

  renderChildControl(child) {
    let className = 'small-filter-button';
    if (this.allValuesIn(this.state.overlay[child.overlayType], child.overlayValues)) {
      className += ' small-filter-button--selected';
    }

    return (
      <button id={child.name}
              key={child.name}
              className={className}
              type="button"
              onClick={this.updateOverlay.bind(this, child.overlayType, child.overlayValues, 'path_overlay')}>
        {child.name}
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
                  X
        </button>
        { this.renderProposedControl() }
        <div className="filter-buttons">
          { controlPanelOptions.map(trailType => this.renderParentControl(trailType)) }
        </div>
      </div>
    );
  }
}
