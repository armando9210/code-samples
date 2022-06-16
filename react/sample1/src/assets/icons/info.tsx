import React from 'react';
import Icon from '@ant-design/icons';
import { BaseIcon } from './base';

const Info: React.FC<BaseIcon> = ({
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
        d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      />
    </svg>
  )}
  />
);

export default Info;