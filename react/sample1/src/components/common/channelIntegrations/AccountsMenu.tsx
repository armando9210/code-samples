import { Menu, Space, Spin, SubMenuProps } from 'antd';
import React, { useMemo } from 'react';
import { ChannelAccountEntry, ChannelEntry, useGetExportListQuery } from '../../../redux/api/channelIntegration';
import { ChannelAccountTemplateMappingType, IntegrationScheduleSettingsSection } from '../../../types/enums';
import { MenuInfo } from 'rc-menu/es/interface';

const allowedMappingTypes = new Map<IntegrationScheduleSettingsSection, ChannelAccountTemplateMappingType[]>([
  [IntegrationScheduleSettingsSection.PRODUCT_SETTINGS, [
    ChannelAccountTemplateMappingType.CATALOG_TO_CHANNEL,
    ChannelAccountTemplateMappingType.CATALOG_TO_RETAIL,
    ChannelAccountTemplateMappingType.OTHERS,
  ]],
  [IntegrationScheduleSettingsSection.INVENTORY_SETTINGS, [
    ChannelAccountTemplateMappingType.INVENTORY_TO_CHANNEL,
    ChannelAccountTemplateMappingType.INVENTORY_TO_RETAIL,
  ]],
  [IntegrationScheduleSettingsSection.INVOICE_SETTINGS, []],
  [IntegrationScheduleSettingsSection.ORDER_SETTINGS, []],
  [IntegrationScheduleSettingsSection.REFUND_SETTINGS, []],
  [IntegrationScheduleSettingsSection.SHIPPING_SETTINGS, []],
]);

interface ChannelAccountsSubMenuProps extends SubMenuProps {
  sectionKey: IntegrationScheduleSettingsSection;
  channel: ChannelEntry;
}

const ChannelAccountsSubMenu: React.FC<ChannelAccountsSubMenuProps> = ({ channel, sectionKey, ...subMenuProps }) => {
  const itemKeys = useMemo(() => channel.channelAccountList.map(account => JSON.stringify({
    ...account,
    sectionKey,
  })), [channel, sectionKey]);

  return (
    <Menu.SubMenu
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...subMenuProps}
      title={channel.channelName}
    >
      {
        channel.channelAccountList.map((account, index) => (
          <Menu.Item key={itemKeys[index]}>
            {account.channnelAccountName}
          </Menu.Item>
        ))
      }
    </Menu.SubMenu>
  );
};

interface AccountsExportMenuProps extends SubMenuProps {
  sectionKey: IntegrationScheduleSettingsSection;
}

const AccountsMenu: React.FC<AccountsExportMenuProps> = ({ sectionKey, title, children, ...subMenuProps }) => {
  const { data, isFetching = false } = useGetExportListQuery();
  const channels: ChannelEntry[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.channelList
      .map(channel => {
        const allowedMappings = allowedMappingTypes.get(sectionKey) || [];
        const channelAccountList = channel.channelAccountList.filter(ca => allowedMappings.indexOf(ca.mappingType) >= 0);

        return {
          ...channel,
          channelAccountList,
        };
      })
      .filter(channel => channel.channelAccountList.length > 0);
  }, [data, sectionKey]);

  const subMenuTitle = (
    <Space>
      {title}
      <Spin size="small" spinning={isFetching} />
    </Space>
  );

  return (
    <Menu.SubMenu
      key={sectionKey}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...subMenuProps}
      title={subMenuTitle}
      disabled={isFetching}
    >
      {children}
      {
        channels.map(channel => {
          const key = JSON.stringify({ channelName: channel.channelName, channelNum: channel.channelNum, sectionKey });

          return (
            <ChannelAccountsSubMenu
              key={key}
              channel={channel}
              sectionKey={sectionKey}
              disabled={channel.channelAccountList.length === 0}
            />
          );
        })
      }
    </Menu.SubMenu>
  );
};

/**
 * Utility function that decodes the account menu key.
 *
 * @param info - Info object from onClick event
 */
export const decodeKey = (info: MenuInfo): [ChannelAccountEntry, ChannelEntry, string] | [null, null, null] => {
  const [accountJSON, channelJSON, section] = info.keyPath;
  try {
    const account: ChannelAccountEntry = JSON.parse(accountJSON);
    const channel: ChannelEntry = JSON.parse(channelJSON);

    return [account, channel, section];
  } catch (e) {
    return [null, null, null];
  }
};

export default AccountsMenu;
