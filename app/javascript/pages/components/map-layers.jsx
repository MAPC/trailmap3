/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Source, Layer } from 'react-map-gl';
import PropTypes from 'prop-types';

const MapLayers = ({ opacity }) => {
  const pavedPaths = {
    id: 'Existing Paved Shared Use Paths',
    type: 'line',
    'source-layer': 'Existing Paved Shared Use Paths',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#214A2D',
      'line-width': 2,
      'line-opacity': opacity.existing['Paved Paths'],
    },
  };
  const unimprovedPaths = {
    id: 'Existing Unimproved Shared Use Paths',
    type: 'line',
    'source-layer': 'Existing Unimproved Shared Use Paths',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#4BAA40',
      'line-width': 2,
      'line-opacity': opacity.existing['Unimproved Paths'],
    },
  };
  const protectedBikeLane = {
    id: 'Existing Protected Bike Lanes',
    type: 'line',
    'source-layer': 'Existing Protected Bike Lanes',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#2166AC',
      'line-width': 2,
      'line-opacity': opacity.existing['Protected Bike Lane'],
    },
  };
  const bikeLane = {
    id: 'Existing Bike Lanes',
    type: 'line',
    'source-layer': 'Existing Bike Lanes',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#92C5DE',
      'line-width': 2,
      'line-opacity': opacity.existing['Bike Lane'],
    },
  };
  const naturalSurfaceFootway = {
    id: 'Natural Surface Footways',
    type: 'line',
    'source-layer': 'Natural Surface Footway',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#A87196',
      'line-width': 2,
      'line-opacity': opacity.existing['Natural Surface Footway'],
    },
  };
  const pavedFootway = {
    id: 'Paved Footway',
    type: 'line',
    'source-layer': 'Paved Footway',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#903366',
      'line-width': 2,
      'line-opacity': opacity.existing['Paved Footway'],
    },
  };
  const pavedPathsProposed = {
    id: 'Proposed Paved Shared Use Paths',
    type: 'line',
    'source-layer': 'Proposed Paved Shared Use Paths',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#214A2D',
      'line-width': 2,
      'line-opacity': opacity.proposed['Paved Paths'],
      'line-dasharray': [2, 2],
    },
  };
  const unimprovedPathsProposed = {
    id: 'Proposed Unimproved Shared Use Paths',
    type: 'line',
    'source-layer': 'Proposed Unimproved Shared Use Paths',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#4BAA40',
      'line-width': 2,
      'line-opacity': opacity.proposed['Unimproved Paths'],
      'line-dasharray': [2, 2],
    },
  };
  const protectedBikeLaneProposed = {
    id: 'Proposed Protected Bike Lanes',
    type: 'line',
    'source-layer': 'Proposed Protected Bike Lanes',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#2166AC',
      'line-width': 2,
      'line-opacity': opacity.proposed['Protected Bike Lane'],
      'line-dasharray': [2, 2],
    },
  };
  const bikeLaneProposed = {
    id: 'Proposed Bike Lanes',
    type: 'line',
    'source-layer': 'Proposed Bike Lanes',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#92C5DE',
      'line-width': 2,
      'line-opacity': opacity.proposed['Bike Lane'],
      'line-dasharray': [2, 2],
    },
  };
  const pavedFootwayProposed = {
    id: 'Proposed Paved Footway',
    type: 'line',
    'source-layer': 'Proposed Paved Footway',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#903366',
      'line-width': 2,
      'line-opacity': opacity.proposed['Paved Footway'],
      'line-dasharray': [2, 2],
    },
  };
  const naturalSurfaceFootwayProposed = {
    id: 'Proposed Natural Surface Footway',
    type: 'line',
    'source-layer': 'Proposed Natural Surface Footway',
    layout: {
      'line-cap': 'butt',
      'line-join': 'miter',
    },
    paint: {
      'line-color': '#A87196',
      'line-width': 2,
      'line-opacity': opacity.proposed['Natural Surface Footway'],
      'line-dasharray': [2, 2],
    },
  };
  return (
    <Source id="MAPC trail vector tiles" type="vector" tiles={['https://tiles.arcgis.com/tiles/c5WwApDsDjRhIVkH/arcgis/rest/services/Walking_trail_vector_tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf']}>
      <Layer {...pavedPaths} />
      <Layer {...unimprovedPaths} />
      <Layer {...protectedBikeLane} />
      <Layer {...bikeLane} />
      <Layer {...pavedFootway} />
      <Layer {...naturalSurfaceFootway} />
      <Layer {...pavedPathsProposed} />
      <Layer {...unimprovedPathsProposed} />
      <Layer {...protectedBikeLaneProposed} />
      <Layer {...bikeLaneProposed} />
      <Layer {...pavedFootwayProposed} />
      <Layer {...naturalSurfaceFootwayProposed} />
    </Source>
  );
};
MapLayers.propTypes = {
  opacity: PropTypes.shape({
    existing: PropTypes.shape({
      'Paved Paths': PropTypes.number,
      'Unimproved Paths': PropTypes.number,
      'Protected Bike Lane': PropTypes.number,
      'Bike Lane': PropTypes.number,
      'Paved Footway': PropTypes.number,
      'Natural Surface Footway': PropTypes.number,
    }),
    proposed: PropTypes.shape({
      'Paved Paths': PropTypes.number,
      'Unimproved Paths': PropTypes.number,
      'Protected Bike Lane': PropTypes.number,
      'Bike Lane': PropTypes.number,
      'Paved Footway': PropTypes.number,
      'Natural Surface Footway': PropTypes.number,
    }),
  }).isRequired,
};
export default MapLayers;
