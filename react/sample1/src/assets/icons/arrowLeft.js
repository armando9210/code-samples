import React from 'react';

function ArrowLeft({
  style = {},
  height = 16,
  width = 16,
  viewBox = "0 0 24 24",
  color = '',
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path fill={color} d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/>
    </svg>
  );
};

export default ArrowLeft;