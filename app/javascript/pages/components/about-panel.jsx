import React from 'react';
import {Component} from 'react';
import { Portal } from 'react-portal';


export default class AboutButton extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-right')[0]}>
        <div className="about-panel">
          <div className="about-panel__object">
            <h1 className="about-panel__heading">About</h1>
            <p className="about-panel__text">
              This map is a comprehensive map of pedestrian and bicycle facilities throughout the MAPC region and beyond. The data on this map tool has been collected from a number of sources including city/town trail data, land trusts, DCR, MassDOT, open street map, and other sources.
            </p>
          </div>
        </div>
      </Portal>
    );
  }
}
