import React from 'react';
import { Row, Typography } from 'antd';
import ArrowTurnUp from '../../assets/icons/arrowTurnUp';

const { Text } = Typography;

const SearchTips = () => {
  return (
    <div
      style={{ marginLeft: 360, width: 740, backgroundColor: 'transparent', textAlign: 'center' }}
    >
      {/* <span role="img" aria-label="sigger" style={{ fontSize: 40 }}>
        &#128070;
      </span> */}
      <div style={{width: 35, height: 35, padding: 5, marginLeft: 330}}>
        <ArrowTurnUp />
      </div>
      <Row>
        <Text style={{ fontSize: 24, color: '#5C677D' }}>
          Input your search criteria and click "Search" button
        </Text>
      </Row>
    </div>
  );
};
export default SearchTips;
