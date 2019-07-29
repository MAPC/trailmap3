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

const layers = fromJS({
  layers: [{
        id: 'Protected Pathways',
        type: 'line',
        source: 'protected_pathways',
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
  'protected_pathways': {
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
        requestJson('https://prql.mapc.org/?query=SELECT%20fac_stat,%20fac_type,%20public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),%27%2Bproj%3Dlcc%20%2Blat_1%3D42.68333333333333%20%2Blat_2%3D41.71666666666667%20%2Blat_0%3D41%20%2Blon_0%3D-71.5%20%2Bx_0%3D200000%20%2By_0%3D750000%20%2Bellps%3DGRS80%20%2Bdatum%3DNAD83%20%2Bunits%3Dm%20%2Bno_defs%20%27,%27%2Bproj%3Dlonglat%20%2Bellps%3DWGS84%20%2Bdatum%3DWGS84%20%2Bno_defs%20%27),6)%20AS%20the_geom%20FROM%20mapc.trans_bike_facilities%20WHERE%20fac_stat%3D1%20AND%20fac_type%20IN%20(2,5)%3B&token=e2e3101e16208f04f7415e36052ce59b'),
        // requestJson('https://prql.mapc.org/?query=SELECT%20fac_stat,%20fac_type,%20public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),%27%2Bproj%3Dlcc%20%2Blat_1%3D42.68333333333333%20%2Blat_2%3D41.71666666666667%20%2Blat_0%3D41%20%2Blon_0%3D-71.5%20%2Bx_0%3D200000%20%2By_0%3D750000%20%2Bellps%3DGRS80%20%2Bdatum%3DNAD83%20%2Bunits%3Dm%20%2Bno_defs%20%27,%27%2Bproj%3Dlonglat%20%2Bellps%3DWGS84%20%2Bdatum%3DWGS84%20%2Bno_defs%20%27),6)%20AS%20the_geom%20FROM%20mapc.trans_walking_trails%3B&token=e2e3101e16208f04f7415e36052ce59b'),
        requestJson('https://prql.mapc.org/?query=SELECT%20fac_stat,%20fac_type,%20public.st_asgeojson(ST_Transform(public.st_GeomFromWKB(sde.ST_AsBinary(shape)),%27%2Bproj%3Dlcc%20%2Blat_1%3D42.68333333333333%20%2Blat_2%3D41.71666666666667%20%2Blat_0%3D41%20%2Blon_0%3D-71.5%20%2Bx_0%3D200000%20%2By_0%3D750000%20%2Bellps%3DGRS80%20%2Bdatum%3DNAD83%20%2Bunits%3Dm%20%2Bno_defs%20%27,%27%2Bproj%3Dlonglat%20%2Bellps%3DWGS84%20%2Bdatum%3DWGS84%20%2Bno_defs%20%27),6)%20AS%20the_geom%20FROM%20mapc.trans_bike_facilities%20WHERE%20fac_stat%20IN%20(2,3)%3B&token=e2e3101e16208f04f7415e36052ce59b')
      ]).then((map) => {
        this.addLayer(map[0], 'protected_pathways');
        this.addLayer(map[1], 'proposed_trails');
        // this.addLayer(map[2], 'walking_trails');
    });
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
