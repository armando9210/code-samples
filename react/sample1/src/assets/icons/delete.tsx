import React from 'react';
import Icon from '@ant-design/icons';
import { BaseIcon } from './base';

const Delete: React.FC<BaseIcon> = ({
  style = {},
  height = 16,
  width = 16,
  viewBox = '0 0 24 24',
  pathColor = 'black',
  classNameIcon = '',
}) => (
  <Icon
    className={classNameIcon}
    component={() => (
      <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} fill="currentColor" viewBox={viewBox} width={width}>
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          fill={classNameIcon !== '' ? '' : pathColor}
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
        />
      </svg>
    )}
  />
);

export default Delete;
