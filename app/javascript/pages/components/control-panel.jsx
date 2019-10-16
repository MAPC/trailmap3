/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { json as requestJson } from 'd3-fetch';
import { BaseControl } from 'react-map-gl';
import FilterButtonContainer from './control-panel/filter-button-container';
import ProposedToggle from './control-panel/propsed-toggle';
import layers from './map/map-layers';
import trailInformation from './map/trail-information';
import colors from './map/colors';

export default class ControlPanel extends BaseControl {
  constructor(props) {
    super(props);
    this.state = {
      overlay: {
        facStat: {
          'Shared Use Paths': [],
          'Proposed Shared Use Paths': [],
          'Bicycle Lane': [],
          'Proposed Bicycle Lane': [],
          Footway: [],
          'Proposed Footway': [],
        },
        facType: {
          'Shared Use Paths': [],
          'Proposed Shared Use Paths': [],
          'Bicycle Lane': [],
          'Proposed Bicycle Lane': [],
          Footway: [],
          'Proposed Footway': [],
        },
      },
      proposedChecked: false,
    };
    this.updateOverlay = this.updateOverlay.bind(this);
    this.updateOverlayChild = this.updateOverlayChild.bind(this);
    this.updateOverlayProposed = this.updateOverlayProposed.bind(this);
    this.changeToggleState = this.changeToggleState.bind(this);
  }

  changeToggleState() {
    this.setState((prevState) => {
      const newToggleState = !prevState.proposedChecked;
      return { proposedChecked: newToggleState };
    });
  }

  allValuesIn(a, b) {
    if (!a || !b) {
      return false;
    }
    return b.map(value => a.includes(value)).includes(true);
  }

  hideFilters() {
    const controlPanel = document.getElementsByClassName('control-panel')[0];
    controlPanel.className = 'control-panel control-panel--hidden';
  }

  requestUrl({ facStat, facType, trailType }) {
    const selectString = "SELECT fac_type, fac_stat, public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),'+proj=lcc +lat_1=42.68333333333333 +lat_2=41.71666666666667 +lat_0=41 +lon_0=-71.5 +x_0=200000 +y_0=750000 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ','+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '),6) AS the_geom";
    const andConditions = [];
    let table = '';

    if (trailType.name.includes('Shared Use Paths')) {
      table = 'mapc.trans_shared_use_paths';
    } else if (trailType.name.includes('Bicycle Lane')) {
      table = 'mapc.trans_bike_facilities';
    } else {
      table = 'mapc.trans_walking_trails';
    }

    if (facStat.length !== 0) {
      andConditions.push(`fac_stat IN (${facStat.join(',')})`);
    } else {
      andConditions.push('fac_stat IN (null)');
    }

    if (facType.length !== 0) {
      andConditions.push(`fac_type IN (${facType.join(',')})`);
    } else {
      andConditions.push('fac_type IN (null)');
    }
    return encodeURI(`https://prql.mapc.org/?query=${selectString} FROM ${table} WHERE ${andConditions.join(' AND ')} &token=e2e3101e16208f04f7415e36052ce59b`);
  }

  updateOverlayChild(facStat, facType, trailType) {
    this.setState((prevState) => {
      const newOverlay = prevState.overlay;
      if (!prevState.proposedChecked) {
        if (this.allValuesIn(newOverlay.facType[trailType.name], facType)) {
          facType.forEach(value => newOverlay.facType[trailType.name] = newOverlay.facType[trailType.name].filter(id => id !== value));
        } else {
          newOverlay.facType[trailType.name] = newOverlay.facType[trailType.name].concat(facType);
        }
        requestJson(this.requestUrl({
          facStat,
          facType: newOverlay.facType[trailType.name],
          trailType,
        })).then((map) => {
          this.addLayer(trailType.name, map, trailType.source, this.withoutPreviousLayer(trailType.source));
        });
      } else {
        const proposedTrailType = trailInformation.find(trail => trail.name === `Proposed ${trailType.name}`);
        if (this.allValuesIn(newOverlay.facType[trailType.name], facType)) {
          facType.forEach((value) => {
            newOverlay.facType[trailType.name] = newOverlay.facType[trailType.name].filter(id => id !== value);
            newOverlay.facType[proposedTrailType.name] = newOverlay.facType[proposedTrailType.name].filter(id => id !== value);
            return newOverlay;
          });
        } else {
          newOverlay.facType[trailType.name] = newOverlay.facType[trailType.name].concat(facType);
          newOverlay.facType[proposedTrailType.name] = newOverlay.facType[proposedTrailType.name].concat(facType);
        }
        requestJson(this.requestUrl({
          facStat,
          facType: newOverlay.facType[trailType.name],
          trailType,
        })).then((map) => {
          this.addLayer(trailType.name, map, trailType.source, this.withoutPreviousLayer(trailType.source));
        });
        requestJson(this.requestUrl({
          facStat: newOverlay.facStat[proposedTrailType.name],
          facType: newOverlay.facType[proposedTrailType.name],
          trailType: proposedTrailType,
        })).then((map) => {
          this.addLayer(proposedTrailType.name, map, proposedTrailType.source, this.withoutPreviousLayer(proposedTrailType.source));
        });
      }
      return { overlay: newOverlay };
    });
  }

  updateOverlay(facStat, facType, trailType) {
    this.setState((prevState) => {
      const newOverlay = prevState.overlay;
      if (!prevState.proposedChecked) {
        if (this.allValuesIn(newOverlay.facType[trailType.name], facType)) {
          newOverlay.facType[trailType.name] = [];
          newOverlay.facStat[trailType.name] = [];
        } else {
          newOverlay.facType[trailType.name] = facType;
          newOverlay.facStat[trailType.name] = facStat;
        }
        if (this.allValuesIn(newOverlay.facType[`Proposed ${trailType.name}`], facType)) {
          newOverlay.facType[`Proposed ${trailType.name}`] = [];
          newOverlay.facStat[`Proposed ${trailType.name}`] = [];
        }
        requestJson(this.requestUrl({
          facStat: newOverlay.facStat[trailType.name],
          facType: newOverlay.facType[trailType.name],
          trailType,
        })).then((map) => {
          this.addLayer(trailType.name, map, trailType.source, this.withoutPreviousLayer(trailType.source));
        });
      } else {
        const proposedTrailType = trailInformation.find(trail => trail.name === `Proposed ${trailType.name}`);
        if (this.allValuesIn(newOverlay.facType[trailType.name], facType)) {
          newOverlay.facType[trailType.name] = [];
          newOverlay.facStat[trailType.name] = [];
          newOverlay.facType[proposedTrailType.name] = [];
          newOverlay.facStat[proposedTrailType.name] = [];
        } else {
          newOverlay.facType[trailType.name] = facType;
          newOverlay.facStat[trailType.name] = facStat;
          newOverlay.facType[proposedTrailType.name] = proposedTrailType.facTypeValues;
          newOverlay.facStat[proposedTrailType.name] = proposedTrailType.facStatValues;
        }
        requestJson(this.requestUrl({
          facStat: newOverlay.facStat[trailType.name],
          facType: newOverlay.facType[trailType.name],
          trailType,
        })).then((map) => {
          this.addLayer(trailType.name, map, trailType.source, this.withoutPreviousLayer(trailType.source));
        });
        requestJson(this.requestUrl({
          facStat: newOverlay.facStat[proposedTrailType.name],
          facType: newOverlay.facType[proposedTrailType.name],
          trailType: proposedTrailType,
        })).then((map) => {
          this.addLayer(proposedTrailType.name, map, proposedTrailType.source, this.withoutPreviousLayer(proposedTrailType.source));
        });
      }
      return { overlay: newOverlay, loading: true };
    });
  }

  updateOverlayProposed(prevOverlay) {
    const visibleLayers = Object.entries(this.state.overlay.facType)
      .filter(item => item[1].length > 0)
      .map(item => item[0])
      .filter(item => !item.includes('Proposed'));
    if (visibleLayers.length === 0) {
      this.props.finishLoading();
    }
    trailInformation.forEach((trailType) => {
      visibleLayers.forEach((layer) => {
        if (trailType.name === `Proposed ${layer}`) {
          this.setState(() => {
            const newOverlay = prevOverlay;
            if (this.allValuesIn(newOverlay.facStat[trailType.name], trailType.facStatValues)) {
              newOverlay.facStat[trailType.name] = [];
              newOverlay.facType[trailType.name] = [];
            } else {
              newOverlay.facStat[trailType.name] = trailType.facStatValues;
              newOverlay.facType[trailType.name] = trailType.facTypeValues;
            }
            requestJson(this.requestUrl({
              facStat: newOverlay.facStat[trailType.name],
              facType: newOverlay.facType[trailType.name],
              trailType,
            })).then((map) => {
              this.addLayer(trailType.name, map, trailType.source, this.withoutPreviousLayer(trailType.source));
            });
            return { overlay: newOverlay };
          });
        }
      });
    });
  }

  addLayer(trailType, newData, source, mapStyle) {
    let mapStyleWithNewSource = mapStyle.deleteIn(['sources', source]);
    if (newData.rows !== null) {
      const geoJson = newData.rows.map(row => ({
        type: 'Feature',
        geometry: JSON.parse(row.the_geom),
        properties: {
          color: colors[trailType][row.fac_type],
        },
      }));
      mapStyleWithNewSource = mapStyle
        .setIn(['sources', source], { type: 'geojson' })
        .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
        .setIn(['sources', source, 'data', 'features'], geoJson)
        .set('layers', mapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)));
    }
    this.props.updateMapLayers(mapStyleWithNewSource);
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
    const sharedUsePaths = trailInformation.find(trail => trail.name === 'Shared Use Paths');
    const bicycleLanes = trailInformation.find(trail => trail.name === 'Bicycle Lane');
    this.updateOverlay(sharedUsePaths.facStatValues, sharedUsePaths.facTypeValues, sharedUsePaths);
    this.updateOverlay(bicycleLanes.facStatValues, bicycleLanes.facTypeValues, bicycleLanes);
  }

  render() {
    const filterButtons = trailInformation.filter(trailType => !trailType.name.includes('Proposed'))
      .map(trailType => (
        <FilterButtonContainer
          key={trailType.name}
          trailType={trailType}
          visibleFacType={this.state.overlay.facType}
          visibleFacStat={this.state.overlay.facStat}
          allValuesIn={this.allValuesIn}
          updateOverlay={this.updateOverlay}
          updateOverlayChild={this.updateOverlayChild}
          startLoading={this.props.startLoading}
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
          &#10005;
        </button>
        <hr className="control-panel__hr" />
        <ProposedToggle
          updateOverlayProposed={this.updateOverlayProposed}
          overlay={this.state.overlay}
          changeToggleState={this.changeToggleState}
          startLoading={this.props.startLoading}
        />
        <div className="filter-buttons">
          { filterButtons }
        </div>
      </div>
    );
  }
}
