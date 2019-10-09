const controlPanelOptions = [{
  name: 'Shared Use Paths',
  description: 'Corridors for walking and/or cycling that are off the road right-of-way physically separated from motor vehicle traffic',
  existingPathName: 'sup_path_overlay',
  proposedPathName: 'sup_proposed_overlay',
  overlayType: 'facType',
  overlayValues: [1, 2, 3],
  children: [{
    name: 'Paved Paths',
    overlayType: 'surfaceType',
    overlayValues: [1, 2],
  }, {
    name: 'Unimproved Paths',
    overlayType: 'surfaceType',
    overlayValues: [3],
  }],
}, {
  name: 'Bicycle Lanes',
  description: 'Corridors where cyclists or pedestrians have a designated lane in the roadway, which may be adjacent to motor vehicle travel lanes',
  existingPathName: 'bl_path_overlay',
  proposedPathName: 'bl_proposed_overlay',
  overlayType: 'facType',
  overlayValues: [1, 2],
  children: [{
    name: 'Protected Bike Lane',
    overlayType: 'facType',
    overlayValues: [2],
  }, {
    name: 'Bike Lane',
    overlayType: 'facType',
    overlayValues: [1],
  }],
}, {
  name: 'Footpaths',
  description: 'Corridors where cyclists or pedestrians share the roadway space with other users',
  existingPathName: 'f_path_overlay',
  proposedPathName: 'f_proposed_overlay',
  overlayType: 'facType',
  overlayValues: [1, 2, 3],
  children: [{
    name: 'Paved Footway',
    overlayType: 'facDetail',
    overlayValues: [1],
  }, {
    name: 'Natural Surface Footway',
    overlayType: 'facType',
    overlayValues: [2, 3],
  }],
}, {
  name: 'Proposed Shared Use Paths',
  proposedPathName: 'sup_proposed_overlay',
  overlayType: 'facStat',
  overlayValues: [3],
}];

export default controlPanelOptions;
