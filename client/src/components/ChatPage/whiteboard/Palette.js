import React, { useEffect, useRef } from 'react';

const Palette = ({ showPalette, handleClosePalette }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleClosePalette();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  const renderPalette = () => {
    return showPalette && (
      <div ref={wrapperRef} className="palette-grid">
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
        <div className="palette-color"></div>
      </div>
    );
  };

  return renderPalette();
};

export default Palette;