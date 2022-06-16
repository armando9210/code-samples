import React from 'react';
import { Row } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import theme from '../../assets/styles/theme';

/**
 * The type definition for properties of Loading.
 *
 * @param {?number} size - the icon size
 # @param {?string} color
 */
type Props = {
  color?: string;
  children?: React.ReactNode;
  size?: number;
  style?: StringKAnyVPair;
};

function Loading(props: Props) {
  const { size = 36, color, children, style } = props;
  const colStyle = {
    color: color || theme['@primary-color'],
    fontSize: size,
    ...style,
  };
  const rowStyle = { ...colStyle, height: '100%' };

  return (
    <Row align="middle" justify="center" style={ rowStyle }>
      {children ? children :
      <Loading3QuartersOutlined spin />}
    </Row>
  );
}

Loading.defaultProps = {
  color: '',
  size: 0,
  style: {},
};

export default Loading;
