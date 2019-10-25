import { fromJS } from 'immutable';

const layers = fromJS({
  layers: [{
    id: 'Paved Paths',
    type: 'line',
    source: 'pp_path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Unimproved Paths',
    type: 'line',
    source: 'up_path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Proposed Paved Paths',
    type: 'line',
    source: 'pp_proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }, {
    id: 'Proposed Unimproved Paths',
    type: 'line',
    source: 'up_proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }, {
    id: 'Protected Bike Lane',
    type: 'line',
    source: 'pbl_path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Bike Lane',
    type: 'line',
    source: 'bl_path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Proposed Protected Bike Lane',
    type: 'line',
    source: 'pbl_proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }, {
    id: 'Proposed Bike Lane',
    type: 'line',
    source: 'bl_proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }, {
    id: 'Paved Footway',
    type: 'line',
    source: 'pf_path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Natural Surface Footway',
    type: 'line',
    source: 'nsf_path_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': ['get', 'opacity'],
    },
  }, {
    id: 'Proposed Paved Footway',
    type: 'line',
    source: 'pf_proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }, {
    id: 'Proposed Natural Surface Footway',
    type: 'line',
    source: 'nsf_proposed_overlay',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 2,
      'line-dasharray': [2, 2],
    },
  }],
});

export default layers;
