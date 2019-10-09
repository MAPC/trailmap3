import React from 'react';
import { json as requestJson } from 'd3-fetch';
import { BaseControl } from 'react-map-gl';
import FilterButtonContainer from './control-panel/filter-button-container';
import ProposedToggle from './control-panel/propsed-toggle';
import layers from './map-layers';
import existingTrailOptions from './control-panel/existing-trail-options';
import proposedTrailOptions from './control-panel/proposed-trail-options';

const colors = {
  'Shared Use Paths': {
    1: '#214A2D', // Paved Paths
    2: '#214A2D', // Paved Paths
    3: '#4BAA40', // Unimproved Roads
  },
  // 'Bicycle Lanes': {
  //   2: '#92C5DE', // Protected bike lane
  //   1: '#2166AC', // Bike Lane
  // },
  // Footpaths: {
  //   1: '#903366', // Paved Footway
  //   2: '#A87196', // Natural Surface Footway
  //   3: '#A87196', // Natural Surface Footway
  // },
};

const opacity = {
  1: 1,
  2: 0,
  3: 0,
};

export default class ControlPanel extends BaseControl {
  constructor(props) {
    super(props);
    this.state = {
      overlay: {
        facStat: {
          'Proposed Shared Use Paths': [],
        },
        facType: {
          'Shared Use Paths': [],
          // 'Bicycle Lanes': [],
          // Footpaths: [],
        },
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

  hideFilters() {
    const controlPanel = document.getElementsByClassName('control-panel')[0];
    controlPanel.className = 'control-panel control-panel--hidden';
  }

  updateOverlay(facStat, facType, trailType='proposed') {
    this.setState((prevState) => {
      const newOverlay = prevState.overlay;
      if (trailType !== 'proposed') {
        facType.map((value) => {
          if (newOverlay.facType[trailType.name].includes(value)) {
            newOverlay.facType[trailType.name] = newOverlay.facType[trailType.name].filter(id => id !== value);
          } else {
            newOverlay.facType[trailType.name] = newOverlay.facType[trailType.name].concat(value);
          }
          return newOverlay;
        });
        requestJson(this.requestUrl({ facStat, facType, source: trailType.name, trailType })).then((map) => {
          this.addLayer(trailType.name, map, trailType.source, this.withoutPreviousLayer(trailType.source));
        });
      }
      return { overlay: newOverlay };
    });
  // this.setState((prevState) => {
    // const newOverlay = prevState.overlay[trailType.overlayType];
    // trailType.overlayValues.map((value) => {
    //   if (prevState.overlay[trailType.overlayType][trailType.name].includes(value)) {
    //     newOverlay[trailType.name] = newOverlay[trailType.name].filter(id => id !== value);
    //   } else {
    //     newOverlay[trailType.name] = newOverlay[trailType.name].concat(value);
    //   }
    //   return newOverlay;
    // });

    // requestJson(this.requestUrl({ [trailType.overlayType]: newOverlay, source, trailType })).then((map) => {
    //   this.addLayer(trailType.name, map, source, this.withoutPreviousLayer(source));
    // });
    // if (this.isProposedVisible() && trailType.overlayType !== 'facStat') {
    //   requestJson(this.requestUrl({ [trailType.overlayType]: newOverlay, source: 'proposed_overlay' })).then((map) => {
    //     this.addLayer(map, 'proposed_overlay', this.withoutPreviousLayer('proposed_overlay'));
    //   });
    // }
    // return { overlay: { ...prevState.overlay, facType: newOverlay } };
  // });
  }

  // eslint-disable-next-line object-curly-newline
  requestUrl({ facStat, facType, surfaceType, source, trailType }) {
    const selectString = "SELECT fac_type, fac_stat, public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),'+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '),6) AS the_geom";
    let facStatEnums = facStat || this.state.overlay.facStat;
    const facTypeEnums = facType || this.state.overlay.facType;
    const surfaceTypeEnums = surfaceType || this.state.overlay.surfaceType;
    const andConditions = [];
    let table = '';

    console.log(facStatEnums)
    console.log(facTypeEnums)


    if (trailType.name === 'Shared Use Paths') {
      table = 'mapc.trans_shared_use_paths';
    } else if (trailType.name === 'Bicycle Lanes') {
      table = 'mapc.trans_bike_facilities';
    } else {
      table = 'mapc.trans_walking_trails';
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
    if (table === 'mapc.trans_bike_facilities') {
      if (surfaceTypeEnums.length !== 0) {
        if (!surfaceTypeEnums.includes(1)) {
          andConditions.push(`(surf_type IN (${surfaceTypeEnums.join(',')}) OR surf_type IS NULL)`);
        } else {
          andConditions.push(`(surf_type IN (${surfaceTypeEnums.join(',')}) OR surf_type IS NULL)`);
        }
      } else {
        andConditions.push('surf_type IN (null)');
      }
    }
    console.log(`https://prql.mapc.org/?query=${selectString} FROM ${table} WHERE ${andConditions.join(' AND ')} &token=e2e3101e16208f04f7415e36052ce59b`)
    return encodeURI(`https://prql.mapc.org/?query=${selectString} FROM ${table} WHERE ${andConditions.join(' AND ')} &token=e2e3101e16208f04f7415e36052ce59b`);
  }

  addLayer(trailType, newData, source, mapStyle) {
    let mapStyleWithNewSource = mapStyle.deleteIn(['sources', source]);
    if (newData.rows !== null) {
      const geoJson = newData.rows.map(row => ({
        type: 'Feature',
        geometry: JSON.parse(row.the_geom),
        properties: {
          fac_type: row.fac_type,
          fac_stat: row.fac_stat,
          color: colors[trailType][row.fac_type],
          opacity: opacity[row.fac_stat],
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

  withoutPreviousLayer(source) {
    let updatedMapStyle = this.props.mapStyle;
    const layerToDeleteIndex = this.props.mapStyle.get('layers').findIndex(layer => layer.get('source') === source);
    if (layerToDeleteIndex > 0) {
      updatedMapStyle = this.props.mapStyle.deleteIn(['layers', layerToDeleteIndex]);
    }
    return updatedMapStyle;
  }

  componentDidMount(event) {
    document.getElementsByClassName('control-panel')[0].addEventListener('wheel', () => { event.stopPropagation(); });
  }

  render() {
    const filterButtons = existingTrailOptions.map(trailType => (
      <FilterButtonContainer
        key={trailType.name}
        trailType={trailType}
        visibleFacType={this.state.overlay.facType}
        visibleFacStat={this.state.overlay.facStat}
        allValuesIn={this.allValuesIn}
        updateOverlay={this.updateOverlay}
      />
    ));
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
        <ProposedToggle
          allValuesIn={this.allValuesIn}
          facStat={this.state.overlay.facStat}
        />
        <div className="filter-buttons">
          { filterButtons }
        </div>
      </div>
    );
  }
}
