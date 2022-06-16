import { Button, Tabs } from 'antd';
import styled from 'styled-components';
import theme from '../../assets/styles/theme';

interface IButton {
  $hasPermission: boolean
}

export const CardTabs = styled(Tabs)`
  & .ant-tabs-tab-active {
    background-color: #ECECEC !important;
  }

  & .ant-tabs-tab-active .ant-badge {
    color: ${theme['@primary-color']};
  }
`;

export const FormLabel = styled.span`
  font-weight: 550;

  &::after {
    content: ' :';
  }
`;

export const HeaderButton = styled(Button)`
  height: 40px;
  padding-top: 7px;
  margin-left: 5px;
  display: ${(props: IButton) => props.$hasPermission ? 'flex' : 'none'};
`;

type ColorTheme =
  | 'danger'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

type HoverBgButtonProps = {
  hovercolor?: string;
  hovertype?: ColorTheme;
};

const hoverColor = (props: any) => {
  const { hovercolor, hovertype } = props;
  const colorDict = {
    danger: theme['@danger-color'],
    info: theme['@info-color'],
    primary: theme['@primary-color'],
    secondary: theme['@secondary-color'],
    success: theme['@success-color'],
    warning: theme['@warning-color'],
  };
  let color = 'none';

  if (hovertype in colorDict) color = colorDict[hovertype as ColorTheme];

  if (hovercolor) color = hovercolor;

  return 'string' === typeof color ? color : '';
};

export const HoverBgButton = styled(Button)<HoverBgButtonProps>`
  &.ant-btn:focus,
  &.ant-btn:hover {
    background-color: ${(props) => hoverColor(props)};
    border-color: ${(props) => hoverColor(props)};
    color: #fff;
  }

  &.ant-btn:focus {
    background-color: inherit;
    color: inherit;
  }
`;

export const InfoButton = styled(Button)`
  &.ant-btn {
    color: #fff;
    background-color: ${theme['@info-color']};
    border-color: #117a8b;
  }

  &.ant-btn:disabled {
    background-color: inherit !important;
    border-color: #d9d9d9;
    color: rgba(0, 0, 0, .25);
  }

  &.ant-btn-primary[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background: #f5f5f5;
    border-color: #d9d9d9;
  }
`;

export const Label = styled.label`
  font-size: ${(props) => props.theme.fontSize || '1em'};
    
  &.clickable {
    cursor: pointer;
  }

  &.label-primary {
    color: ${theme['@primary-color']};
  }

  & span {
    font-size: ${(props) => props.theme.fontSize || '1em'};
  }

  &.label-bold,
  & .label-bold {
    font-weight: 600;
  }

  &.label-danger,
  & .label-danger {
    color: ${theme['@danger-color']};
  }

  &.label-grey,
  & .label-grey {
    color: #666;
  }

  & .label-primary {
    color: ${theme['@primary-color']};
  }
`;

export const ModalTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 0;
`;

export const ProductDetailDialogBodyWrapper = styled.div`
  /*max-height: calc(100vh - 180px);*/
  background-color: #FFF;
  border-radius: 4px;
  height: calc(100vh - 236px);
  overflow-y: auto;
  padding: 12px;

  &.fullscreen-mode {
    height: calc(100vh - 144px);
  }

  &.fullscreen-mode2 {
    height: calc(100vh - 92px);
  }
`;

export const messageStyle = {
  textAlign: 'right',
  marginRight: 8,
};
