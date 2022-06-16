import Icon from '@ant-design/icons';
import React from 'react';
import { BaseIcon } from './base';

const Warehouse: React.FC<BaseIcon> = ({
  style = {},
  height = 16,
  width = 16,
  viewBox = '0 0 24 24',
  pathColor = 'black',
}) => (
  <Icon
    component={() => (
      <svg xmlns="http://www.w3.org/2000/svg" style={style} height={height} viewBox={viewBox} width={width}>
        <rect fill="none" height="24" width="24" />
        <path
          fill={pathColor}
          d="M19,12h3L12,3L2,12h3v8h2v-2h10v2h2V12z M7.21,10h9.58L17,10.19V12H7v-1.81L7.21,10z M14.57,8H9.43L12,5.69L14.57,8z M7,16 v-2h10v2H7z"
        />
      </svg>
    )}
  />
);

export default Warehouse;
