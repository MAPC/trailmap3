import React from 'react';
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {json as requestJson} from 'd3-request';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import '../../styles/map'

const data = fromJS({
    version: 8,
    sources: {
        trailmap: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {type: 'Feature', geometry: {type: 'MultiLineString', coordinates: [[[-70.9985, 42.4184], [-70.9981, 42.4184]]]}}
                ]
            }
        }
    }
});

const layers = fromJS({
  layers: [{
        id: 'trails',
        type: 'line',
        source: 'trailmap',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#f00',
          'line-width': 4,
        }
      }]
})

const defaultMapStyle = fromJS(MAP_STYLE);
const mapStyleWithData = defaultMapStyle
  // Add geojson source to map
  .setIn(['sources', 'trailmap'], data.getIn(['sources', 'trailmap']))
  // Add point layer to map
  .set('layers', defaultMapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('id') === 'trails')));

export default class Map extends Component {

  state = {
    mapStyle: mapStyleWithData,
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 42.3601,
      longitude: -71.0589,
      zoom: 10
    },
    visibility: {
      trails: true,
    },
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

  componentDidMount() {
    requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20ST_AsGeoJSON(the_geom)%20as%20the_geom%20FROM%20bike_facilities', (error, response) => {
      if (!error) {

        const trails = response.rows.map(rows => ({type: 'Feature', geometry: JSON.parse(rows.the_geom)}));
        const trailLayer = this.state.mapStyle.get('layers').filter(layer => layer.get('id') === 'trails');
        const mapStyleWithTrails = mapStyleWithData.setIn(['sources', 'trailmap', 'data', 'features'], trails)
        // const trailLayerIndex = this.state.mapStyle.get('layers').findIndex(layer => layer.get('id') === 'trails')
        // const mapStyleWithInvisibleTrails = mapStyleWithTrails.setIn(['layers', trailLayerIndex, 'layout', 'visibility'], 'none')

        this.setState({
          mapStyle: mapStyleWithTrails
        })
      }
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
    const displayedLayers = this.state.mapStyle.get('layers')

    return (
      <div className="test">
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={this.state.mapStyle}
        />
        <div className="control-panel">
          { layers.get('layers').map(layer => this.renderLayerControl(layer.get('id'))) }
        </div>
       </div>
    );
  }
}
