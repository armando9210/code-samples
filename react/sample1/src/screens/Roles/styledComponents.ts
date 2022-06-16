import styled from 'styled-components';
import { Button } from 'antd';

export const PermissionsWrapper = styled.div`
  /*max-height: calc(100vh - 180px);*/
  height: calc(100vh - 180px);
  /*padding: 0 12px 12px 12px;*/
  padding: 16px 24px;

  &.fullscreen-mode {
    height: calc(100vh - 80px);
  }
`;

export const GrayTableButton = styled(Button)`
  width: 200px;
  height: 40px;
  border-radius: 4px;
  background-color: #f5f6fa;
  font-family: Lato;
  font-size: 14px;
  font-weight: bold;
  float: left;
  text-align: center;
  color: #006dff;
  border-width: 0;
`;

export const PermissionsGroupsWrapper = styled.div`
  margin-top: 12px;
  height: calc(100% - 40px);
  overflow-y: auto;
`;

export const GroupMainRow = styled.div`
  background-color: #D8D8D8;
  padding: 10px 7px;
`;
export const GroupBody = styled.div`
  padding: 5px;
`;
export const GroupWrapper = styled.div`
  border: 1px solid #D8D8D8;
  border-radius: 4px;
  margin-bottom: 12px;
  & .white-stripe {
    background-color: #FFF;
  }

  & .gray-stripe {
    background-color: #F6F6F6;
  }
`;

export const GroupItem = styled.div`
padding: 5px 0;
`;

export const TableButtonWrapper = styled.div`
  margin-top: 5px;
  cursor: pointer;
  float: left;
  margin-left: 5px;
`;

export const EditActionsWrapper = styled.div`
  margin-left: 35px;
`;
