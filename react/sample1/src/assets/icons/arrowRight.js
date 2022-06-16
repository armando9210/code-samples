import React from 'react';

function ArrowRight({
  style = {},
  height = 16,
  width = 16,
  viewBox = "0 0 24 24",
  color = '',
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path fill={color} d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/>
    </svg>
  );
};

export default ArrowRight;