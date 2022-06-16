import React from 'react';
import { Row, Typography } from 'antd';

type Props = {
  icon?: React.ReactNode;
  iconWidth?: number;
  onTextClick?: Function;
  text: React.ReactNode;
  textIsButton?: boolean;
};

const SpaceCell = (props: Props) => {
  const { iconWidth = 0 } = props;
  const [styles, setStyles] = React.useState<StringKAnyVPair>({});

  const handleTextClick = () => {
    if (typeof props.onTextClick === 'function') {
      props.onTextClick();
    }
  };

  React.useEffect(() => {
    if (props.textIsButton) {
      setStyles({
        color: '#1976d2',
        cursor: 'pointer',
      });
    }
  }, [props]);

  return (
    <Row align="middle" justify="space-between">
      <Typography.Text
        ellipsis={{tooltip: props.text}}
        onClick={handleTextClick}
        style={{...styles, width: `calc(100% - ${iconWidth}px)`}}
      >
        {props.text}
      </Typography.Text>
      {props.icon && <>
        {props.icon}
      </>}
    </Row>
  );
};

export default SpaceCell;
