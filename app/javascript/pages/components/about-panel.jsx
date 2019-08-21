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
              This map is a comprehensive map of pedestrian and bicycle facilities throughout the MAPC region and beyond. The data on this map tool has been collected from a number of sources including city/town trail data, land trusts, DCR, MassDOT, and other sources.
            </p>
          </div>
          <div className="about-panel__object">
            <button onClick={this.toggleText.bind(this)}
                    className="about-panel__heading"
                    type="button">
                <div className="about-panel__arrow about-panel__arrow--right"></div>Glossary
              </button>
            <p className="about-panel__text about-panel__text--hidden">
              <b>Protected Pathways</b> - Corridors for walking and/ or cycling that are off the road right-of-way physically separated from motor vehicle traffic<br />
              <b>Separate Lane</b> - Corridors where cyclists or pedestrians have a designated lane in the roadway, which may be adjacent to motor vehicle travel lanes<br />
              <b>Shared Roadway</b> - Corridors where cyclists or pedestrians share the roadway space with other users.
            </p>
          </div>
          <div className="about-panel__object">
            <button onClick={this.toggleText.bind(this)}
                    className="about-panel__heading"
                    type="button">
                <div className="about-panel__arrow about-panel__arrow--right"></div>Disclaimer
              </button>
            <p className="about-panel__text about-panel__text--hidden">
              The data herein is provided for informational purposes only. MAPC makes no warranties, either expressed or implied, and assumes no responsibility for its completeness or accuracy. Users assume all responsibility and risk associated with use of the map and agree to indemnify and hold harmless MAPC with respect to any and all claims and demands that may arise resulting from use of this map.
            </p>
          </div>
          <div className="about-panel__object">
            <button onClick={this.toggleText.bind(this)}
                    className="about-panel__heading"
                    type="button">
                <div className="about-panel__arrow about-panel__arrow--right"></div>Export Data
              </button>
            <p className="about-panel__text about-panel__text--hidden">
              The MAPC Trailmap database is available for download in Arcmap format for organization or agency use to create or supplement their maps.
            </p>
          </div>
          <div className="about-panel__object">
            <button onClick={this.toggleText.bind(this)}
                    className="about-panel__heading"
                    type="button">
                <div className="about-panel__arrow about-panel__arrow--right"></div>Contribute to this Map
              </button>
            <p className="about-panel__text about-panel__text--hidden">
              We welcome contributions to this map including adding to and editing the data! We have an online editing tool available for you to use. To found out how to access the editing functions, please contact David Loutzenheiser at <a href="mailto:dloutzenheiser@mapc.org">dloutzenheiser@mapc.org</a>
            </p>
          </div>
        </div>

      </Portal>
    );
  }
}
