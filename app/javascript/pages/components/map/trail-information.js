const trailInformation = [{
  name: 'Shared Use Paths',
  description: 'Trails for walking and cycling, separated from roadways.',
  source: 'sup_path_overlay',
  facStatValues: [1, 2],
  facTypeValues: [1, 2, 3],
  children: [{
    name: 'Paved Paths',
    facTypeValues: [1, 2],
    facStatValues: [1, 2],
  }, {
    name: 'Unimproved Paths',
    facTypeValues: [3],
    facStatValues: [1, 2],
  }],
}, {
  name: 'Proposed Shared Use Paths',
  source: 'sup_proposed_overlay',
  facStatValues: [3],
  facTypeValues: [1, 2, 3],
}, {
  name: 'Bicycle Lane',
  description: 'Designated exclusive lane for bicycles in the roadway right-of-way.',
  source: 'bl_path_overlay',
  facStatValues: [1, 2],
  facTypeValues: [1, 2],
  children: [{
    name: 'Protected Bike Lane',
    facStatValues: [1, 2],
    facTypeValues: [2],
  }, {
    name: 'Bike Lane',
    facStatValues: [1, 2],
    facTypeValues: [1],
  }],
}, {
  name: 'Proposed Bicycle Lane',
  source: 'bl_proposed_overlay',
  facStatValues: [3],
  facTypeValues: [1, 2],
}, {
  name: 'Footway',
  description: 'Corridors designed for foot traffic as the primary user.  Other users may also be present.',
  source: 'f_path_overlay',
  facStatValues: [1, 2, 3],
  facTypeValues: [1, 2],
  children: [{
    name: 'Paved Footway',
    facStatValues: [1, 2],
    facTypeValues: [1],
  }, {
    name: 'Natural Surface Footway',
    facStatValues: [1, 2],
    facTypeValues: [2, 3],
  }],
}, {
  name: 'Proposed Footway',
  source: 'f_proposed_overlay',
  facStatValues: [3],
  facTypeValues: [1, 2, 3],
}];
export default trailInformation;
