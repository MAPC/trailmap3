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
      'line-opacity': ['get', 'opacity'],
    },
  }],
});
  // }, {
  //   id: 'Bicycle Lanes: Existing Trails',
  //   type: 'line',
  //   source: 'bl_path_overlay',
  //   layout: {
  //     'line-join': 'round',
  //     'line-cap': 'round',
  //     visibility: 'visible',
  //   },
  //   paint: {
  //     'line-color': ['get', 'color'],
  //     'line-width': 2,
  //     'line-opacity': ['get', 'opacity'],
  //   },
  // }, {
  //   id: 'Footpaths: Existing Trails',
  //   type: 'line',
  //   source: 'f_path_overlay',
  //   layout: {
  //     'line-join': 'round',
  //     'line-cap': 'round',
  //     visibility: 'visible',
  //   },
  //   paint: {
  //     'line-color': ['get', 'color'],
  //     'line-width': 2,
  //     'line-opacity': ['get', 'opacity'],
  //   },
  // }, {

export default layers;
