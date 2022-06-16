import Icon from '@ant-design/icons';
import React from 'react';
import { BaseIcon } from './base';

const Import: React.FC<BaseIcon> = ({
  style = {},
  height = 16,
  width = 16,
  viewBox = '0 0 24 24',
  color = '',
  pathColor = 'black',
}) => (
  <Icon
    component={() => (
      <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill={color || pathColor} d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z" />
      </svg>
    )}  
  />
);

export default Import;