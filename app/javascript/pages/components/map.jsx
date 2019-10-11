import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, GeolocateControl } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { fromJS } from 'immutable';
import '../../styles/map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder';
import ControlPanel from './control-panel';
import ControlPanelToggleButton from './control-panel-toggle-button';
import AboutButton from './about-button';
import AboutPanel from './about-panel';
import BasemapButton from './basemap-button';
import BasemapPanel from './basemap-panel';
import MAPBOX_LITE from './map/lite.json';
import layers from './map/map-layers';

const defaultMapStyle = fromJS(MAPBOX_LITE);

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapStyle: defaultMapStyle,
      viewport: {
        latitude: 42.3601,
        longitude: -71.0589,
        zoom: 10,
      },
    };
    this.mapRef = React.createRef();
    this.updateStateWith = this.updateStateWith.bind(this);
    this.changeBasemap = this.changeBasemap.bind(this);
  }

  componentDidMount() {
    const mapboxobj = this.mapRef.current.getMap();
    mapboxobj.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'imperial',
    }), 'bottom-right');
  }

  updateStateWith(updatedMapStyle) {
    this.setState({ mapStyle: updatedMapStyle });
  }

  changeBasemap(updatedMapStyle) {
    const layerNames = ['sup_path_overlay', 'bl_path_overlay', 'f_path_overlay', 'proposed_overlay'];
    let newMapStyle = updatedMapStyle;
    this.setState((prevState) => {
      layerNames.forEach((source) => {
        const trailSource = prevState.mapStyle.get('sources').get(source);
        const trailLayers = prevState.mapStyle.get('layers').find(layer => layer.get('source') === source);
        if (trailLayers !== undefined) {
          newMapStyle = newMapStyle
            .setIn(['sources', source], { type: 'geojson' })
            .setIn(['sources', source, 'data'], { type: 'FeatureCollection' })
            .setIn(['sources', source, 'data', 'features'], trailSource.data.features)
            .set('layers', newMapStyle.get('layers').push(layers.get('layers').find(layer => layer.get('source') === source)));
        }
      });
      return { mapStyle: newMapStyle };
    });
  }

  render() {
    const currentState = this.state;
    return (
      <div className="test">
        <ReactMapGL
          ref={this.mapRef}
          width="100vw"
          height="100vh"
          {...currentState.viewport}
          onViewportChange={(viewport) => {
            const { width, height, ...etc } = viewport;
            this.setState({ viewport: etc });
          }}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={currentState.mapStyle}
        >

          <div className="zoom-wrapper">
            <NavigationControl />
          </div>

          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation
            className="control-panel__geolocate"
          />
          <ControlPanelToggleButton />
          <ControlPanel
            mapStyle={currentState.mapStyle}
            layers={currentState.mapStyle.get('layers')}
            updateStateWith={this.updateStateWith}
          />
          <Geocoder
            mapRef={this.mapRef}
            onViewportChange={(viewport) => {
              const { width, height, ...etc } = viewport;
              this.setState({ viewport: etc });
            }}
            mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
            position="top-left"
            placeholder="Search by city or address"
          />
          <BasemapButton />
          <BasemapPanel
            changeBasemap={this.changeBasemap}
          />
          <AboutButton />
          <AboutPanel />
        </ReactMapGL>
      </div>
    );
  }
}
