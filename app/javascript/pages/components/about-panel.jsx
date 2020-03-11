import React from 'react';

const AboutPanel = () => {
  const toggleText = (event) => {
    let target;

    if (event.target.className.includes('about-panel__heading')) {
      target = event.target;
    } else {
      target = event.target.parentNode;
    }

    if (target.nextSibling.className === 'about-panel__text about-panel__text--hidden') {
      const elements = document.getElementsByClassName('about-panel__text');

      Array.prototype.forEach.call(elements, (element) => {
        element.className = 'about-panel__text about-panel__text--hidden';
      });

      target.nextSibling.className = 'about-panel__text';
      target.querySelector('.about-panel__arrow--right').className = 'about-panel__arrow about-panel__arrow--down';
    } else {
      target.nextSibling.className = 'about-panel__text about-panel__text--hidden';
      target.querySelector('.about-panel__arrow--down').className = 'about-panel__arrow about-panel__arrow--right';
    }
  };

  return (
    <div className="about-panel about-panel--hidden">
      <div className="about-panel__object">
        <button
          onClick={event => toggleText(event)}
          className="about-panel__heading"
          type="button"
        >
          <div className="about-panel__arrow about-panel__arrow--right" />
          About
        </button>
        <p className="about-panel__text about-panel__text--hidden">
          This map is a comprehensive map of pedestrian and bicycle facilities throughout the MAPC region and beyond. The data on this map tool has been collected from a number of sources including city/town trail data, land trusts, DCR, MassDOT, and other sources.
        </p>
      </div>
      <div className="about-panel__object">
        <button
          onClick={event => toggleText(event)}
          className="about-panel__heading"
          type="button"
        >
          <div className="about-panel__arrow about-panel__arrow--right" />
          Glossary
        </button>
        <p className="about-panel__text about-panel__text--hidden">
          <span className="about-panel__glossary">
            <strong>Paved Paths </strong>
            - Hard packed accessible surface, typically asphalt or stonedust
          </span>
          <br />
          <span className="about-panel__glossary">
            <strong>Unimproved Paths </strong>
            - Future paved paths, currently with an unimproved natural surface
          </span>
          <br />
          <span className="about-panel__glossary">
            <strong>Protected Bike Lane </strong>
            - Physically separated from motor vehicle traffic
          </span>
          <br />
          <span className="about-panel__glossary">
            <strong>Bike Lane </strong>
            - Striped lane within the roadway adjacent to traffic
          </span>
          <br />
          <span className="about-panel__glossary">
            <strong>Paved Footway </strong>
            - Hard surface path, typically in city park or campus environments
          </span>
          <br />
          <span className="about-panel__glossary">
            <strong>Natural Surface Footway </strong>
            - Hiking trail, typically found in conservation areas
          </span>
        </p>
      </div>
      <div className="about-panel__object">
        <button
          onClick={event => toggleText(event)}
          className="about-panel__heading"
          type="button"
        >
          <div className="about-panel__arrow about-panel__arrow--right" />
        Disclaimer
        </button>
        <p className="about-panel__text about-panel__text--hidden">
          The data herein is provided for informational purposes only. MAPC makes no warranties, either expressed or implied, and assumes no responsibility for its completeness or accuracy. Users assume all responsibility and risk associated with use of the map and agree to indemnify and hold harmless MAPC with respect to any and all claims and demands that may arise resulting from use of this map.
        </p>
      </div>
      <div className="about-panel__object">
        <button
          onClick={event => toggleText(event)}
          className="about-panel__heading"
          type="button"
        >
          <div className="about-panel__arrow about-panel__arrow--right" />
          Contribute to this Map
        </button>
        <p className="about-panel__text about-panel__text--hidden">
          We welcome contributions to this map including adding to and editing the data! We have an online editing tool available for you to use. To found out how to access the editing functions, please contact David Loutzenheiser at
          {' '}
          <a href="mailto:dloutzenheiser@mapc.org">dloutzenheiser@mapc.org</a>
        </p>
      </div>
    </div>
  );
};

export default AboutPanel;
