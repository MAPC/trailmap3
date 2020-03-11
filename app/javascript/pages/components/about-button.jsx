import React from 'react';

const AboutButton = () => {
  const toggleAboutPanel = () => {
    const aboutPanel = document.getElementsByClassName('about-panel')[0];
    if (aboutPanel.className === 'about-panel about-panel--hidden') {
      aboutPanel.className = 'about-panel';
    } else {
      aboutPanel.className = 'about-panel about-panel--hidden';
    }
  };
  return (
    <button
      className="about-button"
      aria-label="About"
      onClick={toggleAboutPanel}
      type="button"
    />
  );
};
export default AboutButton;
