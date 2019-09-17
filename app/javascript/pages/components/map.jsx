import React from 'react';
import {Component} from 'react';
import ReactMapGL, {GeolocateControl} from 'react-map-gl';
import {json as requestJson} from 'd3-fetch';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import '../../styles/map'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import Geocoder from 'react-map-gl-geocoder'
import ControlPanel from './control-panel'
import ControlPanelToggleButton from './control-panel-toggle-button'
import AboutButton from './about-button'
import AboutPanel from './about-panel'

const defaultMapStyle = fromJS(MAP_STYLE);

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.updateStateWith = this.updateStateWith.bind(this);
  }

  state = {
    mapStyle: defaultMapStyle,
    viewport: {
      latitude: 42.3601,
      longitude: -71.0589,
      zoom: 10
    }
  };

  updateStateWith(updatedMapStyle) {
    this.setState({
        mapStyle: updatedMapStyle,
    });
  }

  addLayer(newData, source) {
    const geoJson = newData.rows.map(rows => ({type: 'Feature', geometry: JSON.parse(rows.the_geom), properties: { fac_type: rows.fac_type, fac_stat: rows.fac_stat }}));
    const mapStyleWithNewSource = this.state.mapStyle.setIn(['sources', source], { type: 'geojson' })
                                                     .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
                                                     .setIn(['sources', source, 'data', 'features'], geoJson)
                                                     .set('layers', this.state.mapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)))
    this.setState({
      mapStyle: mapStyleWithNewSource
    })
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
          <ControlPanelToggleButton />
          <Geocoder
            mapRef={this.mapRef}
            onViewportChange={(viewport) => { const {width, height, ...etc} = viewport
                                              this.setState({viewport: etc}); }}
            mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
            position="top-left"
            placeholder="Search by city or address"
          />
          <ControlPanel
            mapStyle={this.state.mapStyle}
            layers={this.state.mapStyle.get('layers')}
            updateStateWith={this.updateStateWith}
          />
          <AboutButton />
          <AboutPanel />
        </ReactMapGL>
      </div>
    );
  }
}
