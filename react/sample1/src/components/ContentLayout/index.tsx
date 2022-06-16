import React, { ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Popover, Select } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import '../../assets/styles/layout.less';
import DesignService from '../../assets/icons/design_service';
import _profileActions from '../../redux/actions/profiles';
import _routesActions from '../../redux/actions/routes';
import _sidebar from '../../redux/actions/sidebar';
import { fetchUserPermissions } from '../../services/userManagement';
import { logout } from '../../util';
import Settings from '../../assets/icons/settings';
import Shipping from '../../assets/icons/shipping';
import linkERP from '../../util/linkERP';

const { Option } = Select;
const { Header, Content } = Layout;

const HeaderContainer = styled(Header)`
  width: 100%;
  height: 55px;
  box-shadow: 0 -1px 8px 0 rgba(125, 140, 166, 0.08);
  border: solid 1px #d8dde6;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  padding-left: 15px;
`;

// const VerticalDivider = styled.div`
//   position: relative;
//   display: inline-block;
//   height: 2em;
//   margin-right: 16px;
//   vertical-align: middle;
//   width: 3pt;
//   border-radius: 3pt;
//   background-color: #414141;
//   opacity: 85%;
//   font-size: 14px;
//   font-variant: tabular-nums;
//   line-height: 1.5715;
//   list-style: none;
//   font-feature-settings: 'tnum';
// `;

const HeaderActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ContentContainer = styled(Content)`
  overflow-y: auto;
  padding: 24px 24px 24px 34px;
  display: flex;
  flex-direction: column;
`;

const ProfilesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ProfileSelect = styled(Select)`
  font-family: sans-serif, Lato;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.57;
  letter-spacing: normal;
  color: #2d3f5d;
`;

// const IconSpacer = styled.div`
//   margin-right: 16px;
//   display: flex;
// `;

const ButtonSpacer = styled(Button)`
  margin-right: 16px;
  display: flex;
  padding: 0px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
`;

interface Props {
  children: ReactNode,
  profilesEntity: {
    profiles: any,
    selectedIndex: number
  },
  profileActions: any,
  routesActions: any,
  sidebarActions: any,
  isModal?: any,
  collapse: boolean,
}

const LayoutContainer = styled(Layout)<{ $isModal: boolean, $collapse: boolean }>`
  margin-left: ${(props) => props.$isModal || props.$collapse ? '80px' : '250px'};
  height: 100vh;
`;

// const languages = (
//   <Menu>
//     <Menu.Item key="USA" icon={<USAIcon style={{ marginRight: '5px' }} />}>
//       US - English
//     </Menu.Item>
//   </Menu>
// );

function ContentLayout(
  {
    children,
    profilesEntity,
    profileActions,
    routesActions,
    sidebarActions,
    isModal,
    collapse,
  }: Props,
) {
  const profile = useSelector((state: any) => state.profiles.profiles[0]);
  const userActions = (
    <Menu>
      <Menu.Item key="userEmail">
        {profile.Email}
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  const handleChange = async (index: any) => {
    try {
      profileActions.setSelectedIndex(index);
      routesActions.setCurrentKey([]);
      const permissions = await fetchUserPermissions(profilesEntity.profiles[0].Email);
      profileActions.setPermissions(permissions);
    } catch (e) {
      profileActions.setPermissions([]);
    }
    const getUrl = window.location;
    window.location.href = `${getUrl.protocol}//${getUrl.host}/${getUrl.pathname.split('/')[1]}`;
  };

  return (
    <LayoutContainer $isModal={isModal} $collapse={collapse}>
      <HeaderContainer>
        {React.createElement(collapse ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          style: {
            marginRight: '15px',
          },
          onClick: () => sidebarActions.setCollapse(),
        })}
        <HeaderActionsWrapper>
          <ProfilesWrapper>
            <DesignService
              height={32}
              width={32}
              color="#006dff"
              style={{
                borderRadius: '4px',
                border: '1px solid #d8dde6',
                padding: 5,
              }}
            />
            <ProfileSelect
              onChange={handleChange}
              value={profilesEntity.selectedIndex}
              bordered={false}
            >
              {
                profilesEntity.profiles.map((p: any, index: number) => (
                  <Option key={p.ProfileNum} value={index}>{p.DisplayName}</Option>
                ))
              }
            </ProfileSelect>
          </ProfilesWrapper>
          <ActionsWrapper>
            <Popover content='Enterprise Resource Planning' title="ERP">
              <ButtonSpacer
                ghost
                onClick={(e) => {
                  e.preventDefault();
                  linkERP.open();
                }}
              >
                <Badge
                  count={0}
                  size="small"
                  style={{ backgroundColor: '#006dff' }}
                  offset={[0, 4]}
                >
                  <Settings
                    width={28}
                    height={28}
                    style={{
                      fill: '#414141',
                    }}
                  />
                </Badge>
              </ButtonSpacer>
            </Popover>
            <Popover content='Warehouse Management System' title="WMS">
              <ButtonSpacer
                ghost
                href={process.env.WMS_LINK}
                target="_blank"
              >
                <Shipping
                  width={28}
                  height={28}
                  style={{
                    fill: '#414141',
                  }}
                />
              </ButtonSpacer>
            </Popover>
            {/*<VerticalDivider />*/}
            {/*<IconSpacer>*/}
            {/*  <Badge*/}
            {/*    count={0}*/}
            {/*    size="small"*/}
            {/*    style={{ backgroundColor: '#006dff' }}*/}
            {/*    offset={[0, 4]}*/}
            {/*  >*/}
            {/*    <BubbleMessage*/}
            {/*      width={28}*/}
            {/*      height={28}*/}
            {/*      style={{*/}
            {/*        fill: '#414141',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </Badge>*/}
            {/*</IconSpacer>*/}
            {/*<IconSpacer>*/}
            {/*  <Badge*/}
            {/*    count={0}*/}
            {/*    size="small"*/}
            {/*    style={{ backgroundColor: '#006dff' }}*/}
            {/*    offset={[-4, 4]}*/}
            {/*  >*/}
            {/*    <NotificationsIcon*/}
            {/*      width={28}*/}
            {/*      height={28}*/}
            {/*      style={{*/}
            {/*        fill: '#414141',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </Badge>*/}
            {/*</IconSpacer>*/}
            {/*<Dropdown.Button*/}
            {/*  className="headerIconDropdown"*/}
            {/*  overlay={languages}*/}
            {/*  placement="bottomCenter"*/}
            {/*  icon={(*/}
            {/*    <USAIcon width={28} height={28} />*/}
            {/*  )}*/}
            {/*  style={{ border: 'none', marginRight: '15px' }}*/}
            {/*/>*/}
            <Dropdown.Button
              className="headerIconDropdown"
              overlay={userActions}
              placement="bottomCenter"
              icon={(
                <Avatar src="https://cdn.onlinewebfonts.com/svg/img_569205.png" />
              )}
            />
          </ActionsWrapper>
        </HeaderActionsWrapper>
      </HeaderContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </LayoutContainer>
  );
}

ContentLayout.defaultProps = {
  isModal: false,
};

const mapStateToProps = (state: any) => ({
  profilesEntity: state.profiles,
  collapse: state.sidebar.collapse,
});

const mapDispatchToProps = (dispatch: any) => ({
  profileActions: bindActionCreators(_profileActions, dispatch),
  routesActions: bindActionCreators(_routesActions, dispatch),
  sidebarActions: bindActionCreators(_sidebar, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentLayout);
