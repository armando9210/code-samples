import Icon from '@ant-design/icons';
import React from 'react';
import { BaseIcon } from './base';

const DropShippingIcon: React.FC<BaseIcon> = ({
  style = {},
  height = 16,
  width = 16,
  viewBox = '0 0 24 24',
  pathColor = 'black',
}) => (
  <Icon component={() => (
    <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        fill={pathColor}
        d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z"
      />
    </svg>
  )}
  />
);

export default DropShippingIcon;
