import React, { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChannelInvTab } from '../../ProductDetail/Tabs/ChannelInv';
import { FormsContext } from '../common';
import ProductsBulkUpdateActions from '../../../redux/actions/productsBulkUpdate';


const ChannelsInv: React.FC = () => {

  const attributesChannels = useSelector((state: any) => state.productsBulkUpdate.attributesChannels);
  const channelInvDcs = useSelector((state: any) => state.productsBulkUpdate.channelInvDcs);
  const channelInv = useSelector((state: any) => state.productsBulkUpdate.channelInv);
  const isFormUpdated = useSelector((state: any) => state.productsBulkUpdate.isFormUpdated);
  const forms = useContext(FormsContext);
  const { mainForm, channelInvFilterForm } = forms;
  const dispatch = useDispatch();
  const onFormChange = useCallback(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    if (!isFormUpdated) {
      productsBulkUpdateActions.setIsFormUpdated(true);
    }
  }, [isFormUpdated, dispatch]);
  const setChannelInvFilter = useCallback(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    if (!mainForm || !channelInvFilterForm) {
      return null;
    }



    const filterValues = channelInvFilterForm.getFieldsValue();
    let newChannelsInv = [...mainForm.getFieldValue('channelsInv')];

    if (filterValues.Channel !== undefined) {
      newChannelsInv = newChannelsInv.map((channel: any) =>({
        ...channel,
        display: channel.platFormNum === 0 ? channel.channelNum === filterValues.Channel : channel.platFormNum === filterValues.Channel,
      }));
    } else {
      newChannelsInv = newChannelsInv.map((channel: any) =>({
        ...channel,
        display: true,
      }));
    }

    if (filterValues.DistributionCenter !== undefined) {
      newChannelsInv = newChannelsInv.map((channel: any) => ({
        ...channel,
        channelAccountList: channel.channelAccountList.map((channelAccountListElement: any) => ({
          ...channelAccountListElement,
          distributionList: channelAccountListElement.distributionList.map((dl: any) => ({
            ...dl,
            display: dl.distributionCenterNum === filterValues.DistributionCenter,
          })),
        })),
      }));
    }

    if (filterValues.Filter !== '' && filterValues.Filter !== undefined) {
      newChannelsInv = newChannelsInv.map((channel: any) => ({
        ...channel,
        channelAccountList: channel.channelAccountList.map((channelAccountListElement: any) => ({
          ...channelAccountListElement,
          distributionList: channelAccountListElement.distributionList.map((dl: any) => ({
            ...dl,
            display: dl.distributionCenterCode ? dl.distributionCenterCode.toString().toLowerCase().includes(filterValues.Filter.toString().toLowerCase()) : false,
          })),
        })),
      }));
    }

    if ((filterValues.Filter === '' || filterValues.Filter === undefined) && filterValues.DistributionCenter === undefined) {
      newChannelsInv = newChannelsInv.map((channel: any) => ({
        ...channel,
        channelAccountList: channel.channelAccountList.map((channelAccountListElement: any) => ({
          ...channelAccountListElement,
          distributionList: channelAccountListElement.distributionList.map((dl: any) => ({
            ...dl,
            display: true,
          })),
        })),
      }));
    }

    mainForm.setFieldsValue({
      ...mainForm.getFieldsValue(),
      channelsInv: newChannelsInv.sort((a: any, b: any) => (a.channelName > b.channelName) ? 1 : -1),
    });

    productsBulkUpdateActions.setChannelInv(newChannelsInv.sort((a: any, b: any) => (a.channelName > b.channelName) ? 1 : -1));


    return null;
  }, [channelInvFilterForm, dispatch, mainForm]);

  if (!mainForm || !channelInvFilterForm) {
    return null;
  }

  return (
    <ChannelInvTab
      channelInvForm={channelInvFilterForm}
      attributesChannels={attributesChannels}
      editMode
      setFilter={setChannelInvFilter}
      channelsInventory={channelInv}
      channelsInvDCs={channelInvDcs}
      enabler
      onCheckChange={onFormChange}
    />
  );
};

export default ChannelsInv;
