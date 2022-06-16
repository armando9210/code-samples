import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  backgroundColor?: string;
  children?: React.ReactNode;
};

export default function ScreenMask(props: Props) {
  const { children } = props;
  const div = document.createElement('div');

  React.useEffect(() => {
    const { style } = div;

    document.body.appendChild(div);
    style.position = 'fixed';
    //style.left = (document?.scrollingElement?.scrollLeft || 0) + 'px';
    style.left = '0px';
    //style.top = (document?.scrollingElement?.scrollTop || 0) + 'px';
    style.top = '0px';
    style.width = '100%';
    style.height = '100vh';
    style.backgroundColor = props.backgroundColor || 'rgba(0, 0, 0, 0.3)';
    style.zIndex = '1000';

    return () => {
      document.body.removeChild(div);
    };
  });

  return ReactDOM.createPortal(children, div);
}
