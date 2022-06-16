import React from 'react';
import styled from 'styled-components';


interface SpacerProps {
  el?: React.ElementType;
  height?: any;
  width?: any;
  children?: any;
}

const SpacerElement = styled.div<{ width?: string, height?: string }>`
  width: ${props => props.width};
  height: ${props => props.height};
  min-height: ${props => props.height};
`;

const Spacer: React.FC<SpacerProps> = ({el, height, width, children}: SpacerProps) => {
  let realWidth = width;
  let realHeight = height;

  if (typeof width === 'number') {
    realWidth = `${width}px`;
  }

  if (typeof height === 'number') {
    realHeight = `${height}px`;
  }

  return <SpacerElement as={el} width={realWidth} height={realHeight}>{children}</SpacerElement>;
};

Spacer.defaultProps = {
  el: 'div',
  width: undefined,
  height: '14px',
  children: [],
};

export default Spacer;
