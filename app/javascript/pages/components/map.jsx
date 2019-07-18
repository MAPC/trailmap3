import React from 'react';
import {Component} from 'react';
import ReactMapGL, {GeolocateControl} from 'react-map-gl';
import {json as requestJson} from 'd3-fetch';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import '../../styles/map'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import Geocoder from 'react-map-gl-geocoder'

const layers = fromJS({
  layers: [{
        id: 'Bicycle Trails',
        type: 'line',
        source: 'bike_facilities',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#0874b9',
          'line-width': 2,
        }
      },
      {
        id: 'Walking Trails',
        type: 'line',
        source: 'walking_trails',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'none'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
        }
      },
      {
        id: 'Proposed Trails',
        type: 'line',
        source: 'proposed_trails',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'none'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      }]
})

const colors = {
  'bike_facilities': {
    1: "#0874b9",
    2: "#7f3193",
    3: "#0874b9",
    4: '#ffa500',
    5: "#275f68",
    7: "#0874b9",
    9: "#82C5EC",
  },
  'walking_trails': {
    1: "#db813f",
    2: "#db813f",
    5: "#275f68",
  },
  'proposed_trails': {
    1: "#0874b9",
    2: "#7f3193",
    3: "#0874b9",
    4: '#ffa500',
    5: "#275f68",
    7: "#0874b9",
    9: "#82C5EC",
  },
}

const defaultMapStyle = fromJS(MAP_STYLE);

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  state = {
    mapStyle: defaultMapStyle,
    viewport: {
      latitude: 42.3601,
      longitude: -71.0589,
      zoom: 10
    }
  };

  isVisible(visibility) {
    if(visibility === 'none') {
      return false;
    } else {
      return true;
    }
  }

  newVisibleStatus(layerVisible, mapStyle, layerIndex) {
    if (layerVisible === 'visible') {
      return mapStyle.setIn(['layers', layerIndex, 'layout', 'visibility'], 'none')
    } else {
      return mapStyle.setIn(['layers', layerIndex, 'layout', 'visibility'], 'visible')
    }
  }

  toggleVisibility(layerId, event) {
    const mapStyle = this.state.mapStyle;
    const layerVisible = mapStyle.get('layers').filter(layer => layer.get('id') === layerId).first().getIn(['layout', 'visibility']);
    const layerIndex = mapStyle.get('layers').findIndex(layer => layer.get('id') === layerId)
    const updatedMapStyle = this.newVisibleStatus(layerVisible, mapStyle, layerIndex);

    this.setState({
      mapStyle: updatedMapStyle
    })
  }

  addLayer(newData, source) {
    const geoJson = newData.rows.map(rows => ({type: 'Feature', geometry: JSON.parse(rows.the_geom), properties: { fac_type: rows.fac_type, fac_stat: rows.fac_stat, color: colors[source][rows.fac_type] }}));
    const mapStyleWithNewSource = this.state.mapStyle.setIn(['sources', source], { type: 'geojson' })
                                                     .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
                                                     .setIn(['sources', source, 'data', 'features'], geoJson)
                                                     .set('layers', this.state.mapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)))
    this.setState({
      mapStyle: mapStyleWithNewSource
    })
  }

  componentDidMount() {
    Promise.all([
        requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_stat,fac_type,ST_AsGeoJSON(the_geom,6)%20as%20the_geom%20FROM%20bike_facilities%20WHERE%20fac_stat%3D1'),
        requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_type,fac_stat,ST_AsGeoJSON(the_geom,6)%20as%20the_geom%20FROM%20walking_trails'),
        // requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_stat,ST_AsGeoJSON(the_geom,6)%20as%20the_geom%20FROM%20landline_regional_greenways'),
        requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_stat,fac_type,ST_AsGeoJSON(the_geom,6)%20as%20the_geom%20FROM%20bike_facilities%20WHERE%20fac_stat%20IN%20(2,3)')
      ]).then((map) => {
        this.addLayer(map[0], 'bike_facilities');
        this.addLayer(map[1], 'walking_trails');
        this.addLayer(map[2], 'proposed_trails');
    });
  }

  renderLayerControl(name) {
    const visibility = this.state.mapStyle.get('layers').filter(layer => layer.get('id') === name).first().getIn(['layout', 'visibility']);

    return (
      <div key={name} className="input">
        <label>{name}</label>
        <input
          type="checkbox"
          checked={this.isVisible(visibility)}
          onChange={this.toggleVisibility.bind(this, name)}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="test">
        <ReactMapGL
          ref={this.mapRef}
          width='100vw'
          height='100vh'
          {...this.state.viewport}
          onViewportChange={(viewport) => { const {width, height, ...etc} = viewport
                                            this.setState({viewport: etc}); }}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.state.mapStyle}>
          <GeolocateControl
            positionOptions={{enableHighAccuracy: true}}
            trackUserLocation={true}
            className="control-panel__geolocate"
            />
            <Geocoder
              mapRef={this.mapRef}
              onViewportChange={(viewport) => { const {width, height, ...etc} = viewport
                                                this.setState({viewport: etc}); }}
              mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
              position="top-left"
            />
            <div className="control-panel">
              <h2>Trailmap</h2>
              { this.state.mapStyle.get('layers')
                                   .filterNot(layer => defaultMapStyle.get('layers').map(layer => layer.get('id')).includes(layer.get('id')))
                                   .map(layer => this.renderLayerControl(layer.get('id'))) }
            </div>
          </ReactMapGL>

       </div>
    );
  }
}
