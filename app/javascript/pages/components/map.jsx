import React from 'react';
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import {json as requestJson} from 'd3-request';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

const data = fromJS({
    version: 8,
    sources: {
        points: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {type: 'Feature', geometry: {type: 'Point', coordinates: [-71.0589, 42.3601]}}
                ]
            }
        }
    }
});

const layers = fromJS({
  layers: [
      {
          id: 'my-layer',
          type: 'circle',
          source: 'points',
          paint: {
              'circle-color': '#f00',
              'circle-radius': 4
          }
      },
      {
        id: 'trails',
        type: 'line',
        source: 'trailmap',
        paint: {
          'line-color': '#877b59',
          'line-width': 1
        }
      }
  ]
})

const defaultMapStyle = fromJS(MAP_STYLE);
const mapStyleWithData = defaultMapStyle
  // Add geojson source to map
  .setIn(['sources', 'trailmap'], data.getIn(['sources', 'points']))
  // Add point layer to map
  .set('layers', defaultMapStyle.get('layers').push(layers.get('layers').get(1)));

// fetch my GeoJSON
// curl "https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20ST_AsGeoJSON(the_geom)%20as%20the_geom%20FROM%20bike_facilities%20LIMIT%2030"
// display geoJson on top of map.

export default class Map extends Component {

  state = {
    mapStyle: mapStyleWithData,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 42.3601,
      longitude: -71.0589,
      zoom: 10
    }
  };

  componentDidMount() {
    requestJson('https://mapc-admin.carto.com/api/v2/sql?q=SELECT%20ST_AsGeoJSON(the_geom)%20as%20the_geom%20FROM%20bike_facilities%20LIMIT%2030', (error, response) => {
      if (!error) {
        // JSON.parse(response.rows[0].the_geom)
        // debugger;
      }
    });
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
        mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
        mapStyle={this.state.mapStyle}
      />
    );
  }
}


