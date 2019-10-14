import { fromJS } from 'immutable';

const layers = fromJS({
  layers: [{
    id: 'Shared Use Paths',
    type: 'line',
    source: 'sup_path_overlay',
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
    id: 'Proposed Shared Use Paths',
    type: 'line',
    source: 'sup_proposed_overlay',
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
    id: 'Bicycle Lane',
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
    id: 'Proposed Bicycle Lane',
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
    id: 'Footway',
    type: 'line',
    source: 'f_path_overlay',
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
    id: 'Proposed Footway',
    type: 'line',
    source: 'f_proposed_overlay',
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
