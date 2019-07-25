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
        <button className="about-button"
                aria-label="About"
        />
      </Portal>
    );
  }
}
