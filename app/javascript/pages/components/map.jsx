import React, { Component } from 'react';
import ReactMapGL, { NavigationControl, GeolocateControl, ScaleControl } from 'react-map-gl';
import { fromJS } from 'immutable';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
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
import MAPBOX_LITE from './map/lite.json';
import layers from './map/map-layers';
import trailInformation from './map/trail-information';

const defaultMapStyle = fromJS(MAPBOX_LITE);
const override = css`
    display: block;
    margin: 0 auto;
    border-width: 5px;
`;

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
      // loading: true,
      opacity: {
        existing: {
          'Paved Paths': 0,
          'Unimproved Paths': 0,
          'Protected Bike Lane': 0,
          'Bike Lane': 0,
          'Paved Footway': 0,
          'Natural Surface Footway': 0,
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
    this.startLoading = this.startLoading.bind(this);
    this.finishLoading = this.finishLoading.bind(this);
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
    this.finishLoading();
  }

  startLoading() {
    if (document.getElementsByClassName('cliploader__wrapper-hidden')[0]) {
      document.getElementsByClassName('cliploader__wrapper-hidden')[0].className = 'cliploader__wrapper';
    }
    this.setState({ loading: true });
  }

  finishLoading() {
    if (document.getElementsByClassName('cliploader__wrapper')[0]) {
      document.getElementsByClassName('cliploader__wrapper')[0].className = 'cliploader__wrapper-hidden';
    }
    this.setState({ loading: false });
  }

  changeBasemap(updatedMapStyle) {
    const layerNames = Object.entries(trailInformation).map(item => item[1].source);
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

  handleViewportChange(viewport) {
    this.setState(prevState => ({ viewport: { ...prevState.viewport, ...viewport } }));
  }

  render() {
    const currentState = this.state;
    return (
      <main>
        {/* <div className="cliploader__wrapper">
          <ClipLoader
            css={override}
            size={100}
            color="rgb(0, 112, 205)"
            loading={currentState.loading}
            className="cliploader__load"
          />
        </div> */}
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
            updateMapLayers={this.updateMapLayers}
            updateLoading={this.updateLoading}
            startLoading={this.startLoading}
            finishLoading={this.finishLoading}
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
