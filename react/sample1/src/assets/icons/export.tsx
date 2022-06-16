import Icon from '@ant-design/icons';
import React from 'react';
import { BaseIcon } from './base';

const Export: React.FC<BaseIcon> = ({
  style = {},
  height = 16,
  width = 16,
  viewBox = '0 0 24 24',
  color = '',
  pathColor = 'black',
}) => (
  <Icon component={() => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill={color || pathColor} d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  )}
  />
);

export default Export;