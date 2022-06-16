import React from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import {
  LOADING_ICON_SIZE1,
  LOADING_ICON_SIZE3,
  LOADING_ICON_SIZE5,
} from '../../constants/config';
import theme from '../../assets/styles/theme';

type Props = {
  color?: string;
  size?: 'small' | 'middle' | 'large';
};

const LoadingIcon = (props: Props) => {
  const { size = 'middle', color } = props;
  const sizeDict = {
    small: LOADING_ICON_SIZE3,
    middle: LOADING_ICON_SIZE5,
    large: LOADING_ICON_SIZE1,
  };
  const loadingStyle = {
    color: color || theme['@primary-color'],
    fontSize: sizeDict[size],
  };

  return <Loading3QuartersOutlined style={loadingStyle} spin />;
};
LoadingIcon.defaultProps = {
  color: '',
  size: 'middle',
};
export default LoadingIcon;
