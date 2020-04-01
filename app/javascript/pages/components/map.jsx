import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, GeolocateControl, ScaleControl } from 'react-map-gl';
import '../../styles/map.scss';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Geocoder from 'react-map-gl-geocoder';
import ControlPanel from './control-panel';
import ControlPanelToggleButton from './control-panel-toggle-button';
import AboutButton from './about-button';
import AboutPanel from './about-panel';
import BasemapButton from './basemap-button';
import BasemapPanel from './basemap-panel';
import MapLayers from './map-layers';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      viewport: {
        latitude: 42.3601,
        longitude: -71.0589,
        zoom: 10,
      },
      opacity: {
        existing: {
          'Paved Paths': 1,
          'Unimproved Paths': 1,
          'Protected Bike Lane': 1,
          'Bike Lane': 1,
          'Paved Footway': 1,
          'Natural Surface Footway': 1,
        },
        proposed: {
          'Paved Paths': 0,
          'Unimproved Paths': 0,
          'Protected Bike Lane': 0,
          'Bike Lane': 0,
          'Paved Footway': 0,
          'Natural Surface Footway': 0,
        },
      },

    };
    this.mapRef = React.createRef();
    this.updateMapLayers = this.updateMapLayers.bind(this);
    this.changeBasemap = this.changeBasemap.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);
    this.toggleEsriLayer = this.toggleEsriLayer.bind(this);
    this.toggleEsriProposedLayer = this.toggleEsriProposedLayer.bind(this);
    this.toggleLayer = this.toggleLayer.bind(this);
  }

  toggleEsriLayer(trailName) {
    this.setState((prevState) => {
      const updatedOpacity = prevState.opacity;
      const proposedIsToggled = document.querySelector('.toggle-switch__input').checked;
      if (proposedIsToggled) {
        updatedOpacity.existing[trailName] = this.toggleLayer(prevState.opacity.existing[trailName]);
        updatedOpacity.proposed[trailName] = this.toggleLayer(prevState.opacity.proposed[trailName]);
      } else {
        updatedOpacity.existing[trailName] = this.toggleLayer(prevState.opacity.existing[trailName]);
      }
      return { opacity: updatedOpacity };
    });
  }

  toggleEsriProposedLayer() {
    this.setState((prevState) => {
      const updatedOpacities = prevState.opacity;
      const proposedIsToggled = document.querySelector('.toggle-switch__input').checked;
      if (proposedIsToggled) {
        for (const [trail, opacity] of Object.entries(prevState.opacity.existing)) {
          if (opacity === 1) {
            updatedOpacities.proposed[trail] = 1;
          }
        }
      } else {
        for (const [trail, opacity] of Object.entries(prevState.opacity.proposed)) {
          if (opacity === 1) {
            updatedOpacities.proposed[trail] = 0;
          }
        }
      }
      return { opacity: updatedOpacities };
    });
  }

  toggleLayer(prevValue) {
    if (prevValue === 1) {
      return 0;
    }
    return 1;
  }


  updateMapLayers(updatedMapStyle) {
    this.setState({ mapStyle: updatedMapStyle });
  }

  changeBasemap(updatedMapStyle) {
    this.setState({ mapStyle: updatedMapStyle });
  }

  handleViewportChange(viewport) {
    this.setState(prevState => ({ viewport: { ...prevState.viewport, ...viewport } }));
  }

  render() {
    const currentState = this.state;
    return (
      <main>
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
            updateMapLayers={this.updateMapLayers}
            updateLoading={this.updateLoading}
            toggleEsriLayer={this.toggleEsriLayer}
            toggleEsriProposedLayer={this.toggleEsriProposedLayer}
          />
          <Geocoder
            mapRef={this.mapRef}
            mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
            onViewportChange={this.handleViewportChange}
            position="top-left"
            placeholder="Search by city or address"
          />
          <BasemapButton />
          <BasemapPanel
            changeBasemap={this.changeBasemap}
          />
          <MapLayers opacity={currentState.opacity} />
          <div className="mapboxgl-ctrl-bottom-right">
            <ScaleControl maxWidth={100} unit="imperial" />
          </div>
        </ReactMapGL>
        <AboutButton />
        <AboutPanel />
      </main>
    );
  }
}
