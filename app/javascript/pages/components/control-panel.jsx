import React from 'react';
import { fromJS } from 'immutable';
import { json as requestJson } from 'd3-fetch';
import { BaseControl } from 'react-map-gl';
import FilterButtonContainer from './control-panel/filter-button-container';

const enumsFromFacTypeValue = {
  'Shared Use Paths': [1, 2, 3],
  'Bicycle Lanes': [1, 2],
  Footpaths: [1, 2, 3],
};

const colors = {
  1: '#0874b9', // separate lane
  2: '#00B86F', // protected pathways
  3: '#E89716', // shared roadway
  4: '#0874b9', // separate lane
  5: '#00B86F', // protected pathways
  7: '#E89716', // shared roadway
  9: '#E89716', // shared roadway
};

const opacity = {
  1: 1,
  2: 0,
  3: 0,
};

const controlPanelOptions = [{
  name: 'Shared Use Paths',
  description: 'Corridors for walking and/or cycling that are off the road right-of-way physically separated from motor vehicle traffic',
  overlayType: 'facType',
  overlayValues: [1, 2, 3],
  children: [{
    name: 'Paved Paths',
    overlayType: 'surfaceType',
    overlayValues: [1, 2],
  }, {
    name: 'Unimproved Paths',
    overlayType: 'surfaceType',
    overlayValues: [3],
  }],
}, {
  name: 'Bicycle Lanes',
  description: 'Corridors where cyclists or pedestrians have a designated lane in the roadway, which may be adjacent to motor vehicle travel lanes',
  overlayType: 'facType',
  overlayValues: [1, 2],
  children: [{
    name: 'Protected Bike Lane',
    overlayType: 'facType',
    overlayValues: [2],
  }, {
    name: 'Bike Lane',
    overlayType: 'facType',
    overlayValues: [1],
  }],
}, {
  name: 'Footpaths',
  description: 'Corridors where cyclists or pedestrians share the roadway space with other users',
  overlayType: 'facType',
  overlayValues: [1, 2, 3],
  children: [{
    name: 'Paved Footway',
    overlayType: 'facDetail',
    overlayValues: [1],
  }, {
    name: 'Natural Surface Footway',
    overlayType: 'facType',
    overlayValues: [2, 3],
  }],
}];

const layers = fromJS({
  layers: [{
    id: 'Existing Trails',
    type: 'line',
    source: 'path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Proposed Trails',
    type: 'line',
    source: 'proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }],
});

export default class ControlPanel extends BaseControl {
  constructor(props) {
    super(props);
    this.state = {
      overlay: {
        facStat: [1],
        facType: [],
        surfaceType: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        facDetail: [
          10, 11, 12, 13, 14,
          20, 21, 22, 23,
          31, 32,
          41, 42,
          51, 52, 53, 54,
          61, 62, 63,
          71, 72, 73, 74, 75, 76,
          81, 82, 83,
          91, 92, 93, 94],
      },
    };
    this.updateOverlay = this.updateOverlay.bind(this);
  }

  allValuesIn(a, b) {
    return !b.map(value => a.includes(value)).includes(false);
  }

  isProposedVisible() {
    if (this.allValuesIn(this.state.overlay.facStat, [2, 3])) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line object-curly-newline
  requestUrl({ facStat, facType, surfaceType, source, trailType }) {
    const selectString = "SELECT fac_type, fac_stat, fac_detail, public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),'+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '),6) AS the_geom";
    let facStatEnums = facStat || this.state.overlay.facStat;
    const facTypeEnums = facType || this.state.overlay.facType;
    const surfaceTypeEnums = surfaceType || this.state.overlay.surfaceType;
    const andConditions = [];
    let table = '';

    if (trailType === 'Shared Use Paths') {
      table = 'mapc.trans_shared_use_paths';
    } else if (trailType === 'Bicycle Lanes') {
      table = 'mapc.trans_bike_facilities';
    }
    if (source === 'proposed_overlay') {
      facStatEnums = [2, 3];
    }

    if (facStatEnums.length !== 0) {
      andConditions.push(`fac_stat IN (${facStatEnums.join(',')})`);
    } else {
      andConditions.push('fac_stat IN (null)');
    }

    if (facTypeEnums.length !== 0) {
      andConditions.push(`fac_type IN (${facTypeEnums.join(',')})`);
    } else {
      andConditions.push('fac_type IN (null)');
    }
    if (surfaceTypeEnums.length !== 0) {
      if (!surfaceTypeEnums.includes(1)) {
        andConditions.push(`(surf_type IN (${surfaceTypeEnums.join(',')}) OR surf_type IS NULL)`);
      } else {
        andConditions.push(`(surf_type IN (${surfaceTypeEnums.join(',')}) OR surf_type IS NULL)`);
      }
    } else {
      andConditions.push('surf_type IN (null)');
    }

    return encodeURI(`https://prql.mapc.org/?query=${selectString} FROM ${table} WHERE ${andConditions.join(' AND ')} &token=e2e3101e16208f04f7415e36052ce59b`);
  }

  addLayer(newData, source, mapStyle) {
    let mapStyleWithNewSource = mapStyle.deleteIn(['sources', source]);
    if (newData.rows !== null) {
      const geoJson = newData.rows.map(rows => ({
        type: 'Feature',
        geometry: JSON.parse(rows.the_geom),
        properties: {
          fac_type: rows.fac_type,
          fac_stat: rows.fac_stat,
          color: colors[rows.fac_type],
          opacity: opacity[rows.fac_stat],
        },
      }));
      mapStyleWithNewSource = mapStyle
        .setIn(['sources', source], { type: 'geojson' })
        .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
        .setIn(['sources', source, 'data', 'features'], geoJson)
        .set('layers', mapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)));
    }
    this.props.updateStateWith(mapStyleWithNewSource);
  }

  hideFilters() {
    const controlPanel = document.getElementsByClassName('control-panel')[0];
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

  updateOverlay(trailType, source) {
    this.setState((prevState) => {
      let updatedProperty = prevState.overlay[trailType.overlayType];
      trailType.overlayValues.map((value) => {
        if (prevState.overlay[trailType.overlayType].includes(value)) {
          updatedProperty = updatedProperty.filter(id => id !== value);
        } else {
          updatedProperty = updatedProperty.concat([value]);
        }
        return updatedProperty;
      });

      requestJson(this.requestUrl({ [trailType.overlayType]: updatedProperty, source: 'path_overlay', trailType: trailType.name })).then((map) => {
        this.addLayer(map, source, this.withoutPreviousLayer(source));
      });
      if (this.isProposedVisible() && trailType.overlayType !== 'facStat') {
        requestJson(this.requestUrl({ [trailType.overlayType]: updatedProperty, source: 'proposed_overlay' })).then((map) => {
          this.addLayer(map, 'proposed_overlay', this.withoutPreviousLayer('proposed_overlay'));
        });
      }

      return { overlay: { ...prevState.overlay, [trailType.overlayType]: updatedProperty } };
    });
  }

  renderChildControl(child) {
    let className = `small-filter-button small-filter-button-${child.name.replace(/\s+/g, '-').toLowerCase()}`;
    if (this.allValuesIn(this.state.overlay[child.overlayType], child.overlayValues)) {
      className += ' small-filter-button--selected';
    }

    return (
      <button
        id={child.name}
        key={child.name}
        className={className}
        type="button"
        onClick={this.updateOverlay(this, child, 'path_overlay')}
      >
        {child.name}
      </button>
    );
  }

  componentDidMount(event) {
    document.getElementsByClassName('control-panel')[0].addEventListener('wheel', () => { event.stopPropagation(); });
  }

  render() {
    return (
      <div id="control-panel" className="control-panel">
        <h2 className="control-panel__title">Trailmap Filters</h2>
        <button
          className="control-panel__close"
          onClick={this.hideFilters.bind(this)}
          type="button"
        >
          X
        </button>

        <div className="toggle-switch">
          <label
            className="toggle-switch__label"
          >
            <input
              id="Proposed"
              key="Proposed"
              className="toggle-switch__input"
              type="checkbox"
              checked={this.isProposedVisible()}
              // onChange={this.updateOverlay.bind(this, 'facStat', [2, 3], 'proposed_overlay')}
            />
          </label>
          <span className="toggle-switch__label">Proposed Paths & Trails</span>
        </div>

        <div className="filter-buttons">
          <FilterButtonContainer
            trailType={controlPanelOptions[1]}
            enumsFromFacTypeValue={enumsFromFacTypeValue}
            allValuesIn={this.allValuesIn}
            facType={this.state.overlay.facType}
            updateOverlay={this.updateOverlay}
          />
        </div>
      </div>
    );
  }
}
