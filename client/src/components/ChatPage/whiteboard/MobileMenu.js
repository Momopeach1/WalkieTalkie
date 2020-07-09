import React from 'react';

import MobileSlideup from './MobileSlideup';

const MobileMenu = () => {
  return (
    <div className="mobile-menu-container">
      <MobileSlideup />
      <div className="mobile-menu-btn" />
      <div className="mobile-menu-btn" />
      <div className="mobile-menu-btn hidden" />
      <div className="mobile-menu-btn hidden" />
      <div className="mobile-menu-btn hidden" />
      <div className="mobile-menu-btn hidden" />
    </div>
  );
};

export default MobileMenu;