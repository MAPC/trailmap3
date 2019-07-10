import React from 'react';
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {json as requestJson} from 'd3-fetch';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import '../../styles/map'

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
          'line-color': '#f00',
          'line-width': 4,
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
          'line-color': '#0000ff',
          'line-width': 4,
        }
      }]
})

const defaultMapStyle = fromJS(MAP_STYLE);

export default class Map extends Component {

  state = {
    mapStyle: defaultMapStyle,
    viewport: {
      width: "100vw",
      height: "100vh",
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
    const geoJson = newData.rows.map(rows => ({type: 'Feature', geometry: JSON.parse(rows.the_geom), properties: { fac_type: rows.fac_type, fac_stat: rows.fac_stat }}));
    const mapStyleWithNewSource = this.state.mapStyle.setIn(['sources', source], { type: 'geojson' })
                                                     .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
                                                     .setIn(['sources', source, 'data', 'features'], geoJson)
    const mapStyleWithNewLayer = mapStyleWithNewSource.set('layers', this.state.mapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)))

    this.setState({
      mapStyle: mapStyleWithNewLayer
    })
  }

  componentDidMount() {
    Promise.all([
        requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_type,fac_stat,ST_AsGeoJSON(the_geom)%20as%20the_geom%20FROM%20bike_facilities'),
        requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_type,fac_stat,ST_AsGeoJSON(the_geom)%20as%20the_geom%20FROM%20walking_trails'),
        requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20fac_stat,ST_AsGeoJSON(the_geom)%20as%20the_geom%20FROM%20landline_regional_greenways')
      ]).then((map) => {
        this.addLayer(map[0], 'bike_facilities');
        this.addLayer(map[1], 'walking_trails');
        // SELECT * FROM bike_facilities WHERE fac_type=2 AND fac_stat IN (2,3)
        // SELECT * FROM bike_facilities WHERE fac_type=9 AND fac_stat IN (2,3)
        // SELECT * FROM bike_facilities WHERE fac_type=1 AND fac_stat IN (2,3)
        // SELECT * FROM walking_trails WHERE fac_stat IN (2,3)
        // SELECT * FROM bike_facilities WHERE fac_type=5 AND fac_stat IN (2,3)
        // select * from landline_regional_greenways WHERE fac_stat IN (2,3)
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
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.state.mapStyle}
        />
        <div className="control-panel">
          { this.state.mapStyle.get('layers')
                               .filterNot(layer => defaultMapStyle.get('layers').map(layer => layer.get('id')).includes(layer.get('id')))
                               .map(layer => this.renderLayerControl(layer.get('id'))) }
        </div>
       </div>
    );
  }
}
