import React, { Component } from 'react';
import Logo from '../../../assets/images/logo.svg';


export default class Header extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  render() {
    return (
      <header className="header">
        <img src="https://www.mapc.org/wp-content/themes/mapc/assets/images/mapc-logo.svg" className="header__image" alt="Metropolitan Area Planning Council"/>
        <h1 className="header__title">
          <span className="header__title-bold">Trailmap: </span>Metro Boston's Regional Walking and Cycling Map
        </h1>
      </header>
    );
  }
}
