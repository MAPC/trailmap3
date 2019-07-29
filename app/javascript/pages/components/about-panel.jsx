import React from 'react';
import {Component} from 'react';
import { Portal } from 'react-portal';

export default class AboutPanel extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  toggleText(event) {
    if (event.target.nextSibling.className === 'about-panel__text about-panel__text--hidden') {
      event.target.nextSibling.className = 'about-panel__text';
      event.target.querySelector('.about-panel__arrow--right').className = 'about-panel__arrow about-panel__arrow--down';
    } else {
      event.target.nextSibling.className = 'about-panel__text about-panel__text--hidden';
      event.target.querySelector('.about-panel__arrow--down').className = 'about-panel__arrow about-panel__arrow--right';
    }
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-right')[0]}>
        <div className="about-panel about-panel--hidden">
          <div className="about-panel__object">
            <button onClick={this.toggleText.bind(this)}
                    className="about-panel__heading about-panel__heading--first"
                    type="button">
                <div className="about-panel__arrow about-panel__arrow--right"></div>About
              </button>
            <p className="about-panel__text about-panel__text--hidden">
              This map is a comprehensive map of pedestrian and bicycle facilities throughout the MAPC region and beyond. The data on this map tool has been collected from a number of sources including city/town trail data, land trusts, DCR, MassDOT, open street map, and other sources.
            </p>
          </div>
          <div className="about-panel__object">
            <button onClick={this.toggleText.bind(this)}
                    className="about-panel__heading"
                    type="button">
                <div className="about-panel__arrow about-panel__arrow--right"></div>Glossary
              </button>
            <p className="about-panel__text about-panel__text--hidden">
              <b>Foot Trails</b> through parks and other open spaces, paths through campuses, and generally all areas accessible by foot that are not along a roadway<br />
              <b>Bicycle Facilities</b> on roadways including protected bike lanes, bike lanes and shared lane markings<br />
              <b>Multi-use paths</b> that accommodate foot, bike, and other non motorized uses. Includes rail trails, river path systems and other similar trails<br />
              <b>LandLine Network</b>: The LandLine vision is an overlay or network of connected trails, bike facilities and roadways.For further information on LandLine, MAPC’s plan to develop Metro Boston’s greenway network can be found mapc.org/landline
            </p>
          </div>
        </div>
      </Portal>
    );
  }
}
