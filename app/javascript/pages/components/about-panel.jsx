import React from 'react';
import {Component} from 'react';
import { Portal } from 'react-portal';

export default class AboutPanel extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-right')[0]}>
        <div className="about-panel about-panel--hidden">
          <div className="about-panel__object">
            <div className="about-panel__heading"><div className="about-panel__arrow about-panel__arrow--right"></div>About</div>
            <p className="about-panel__text">
              This map is a comprehensive map of pedestrian and bicycle facilities throughout the MAPC region and beyond. The data on this map tool has been collected from a number of sources including city/town trail data, land trusts, DCR, MassDOT, open street map, and other sources.
            </p>
          </div>
        </div>
      </Portal>
    );
  }
}
