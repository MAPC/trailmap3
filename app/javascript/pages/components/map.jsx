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
import MAP_STYLE from './light.json';

const defaultMapStyle = fromJS(MAP_STYLE);

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
    this.setState((prevState) => {
      const trailSource = prevState.mapStyle.get('sources').get('path_overlay');
      const trailLayers = prevState.mapStyle.get('layers').find(layer => layer.get('source') === 'path_overlay');

      const proposedTrailSource = prevState.mapStyle.get('sources').get('proposed_overlay');
      const proposedTrailLayers = prevState.mapStyle.get('layers').find(layer => layer.get('source') === 'proposed_overlay');
      let newMapStyle = updatedMapStyle;
      
      if (trailLayers !== undefined) {
        newMapStyle = updatedMapStyle
          .setIn(['sources', 'path_overlay'], { type: 'geojson' })
          .setIn(['sources', 'path_overlay', 'data'], { type: 'FeatureCollection' })
          .setIn(['sources', 'path_overlay', 'data', 'features'], trailSource.data.features)
          .set('layers', updatedMapStyle.get('layers').push(trailLayers));

        if (proposedTrailLayers !== undefined) {
          newMapStyle = newMapStyle
            .setIn(['sources', 'proposed_overlay'], { type: 'geojson' })
            .setIn(['sources', 'proposed_overlay', 'data'], { type: 'FeatureCollection' })
            .setIn(['sources', 'proposed_overlay', 'data', 'features'], proposedTrailSource.data.features)
            .set('layers', newMapStyle.get('layers').push(proposedTrailLayers));
        }
      }
      return { mapStyle: newMapStyle };
    });
  }

  render() {
    const { mapStyle } = this.state;
    return (
      <div className="test">
        <ReactMapGL
          ref={this.mapRef}
          width="100vw"
          height="100vh"
          {...this.state.viewport}
          onViewportChange={(viewport) => {
            const { width, height, ...etc } = viewport;
            this.setState({ viewport: etc });
          }}
          mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
          mapStyle={mapStyle}
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
          <ControlPanel
            mapStyle={mapStyle}
            layers={mapStyle.get('layers')}
            updateStateWith={this.updateStateWith}
            changeBasemap={this.changeBasemap}
          />
          <AboutButton />
          <AboutPanel />
        </ReactMapGL>
      </div>
    );
  }
}
