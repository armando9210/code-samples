import React from 'react';

function TextField({
 style = {},
 height = 16,
 width = 16,
 viewBox = "0 0 24 24",
 color = '',
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
      <path fill={color}  d="M2.5,4v3h5v12h3V7h5V4H2.5z M21.5,9h-9v3h3v7h3v-7h3V9z"/>
    </svg>
  );
};

export default TextField;

