import React from 'react';
import {Component} from 'react';
import { Portal } from 'react-portal';


export default class AboutButton extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  toggleAboutPanel(event) {
    const aboutPanel = document.getElementsByClassName('about-panel')[0];
    if (aboutPanel.className === 'about-panel about-panel--hidden') {
      aboutPanel.className = 'about-panel';
    } else {
      aboutPanel.className = 'about-panel about-panel--hidden';
    }
  }

  render() {
    return (
      <Portal node={document && document.getElementsByClassName('mapboxgl-ctrl-top-right')[0]}>
        <button className="about-button"
                aria-label="About"
                onClick={this.toggleAboutPanel.bind(this)} />
      </Portal>
    );
  }
}
