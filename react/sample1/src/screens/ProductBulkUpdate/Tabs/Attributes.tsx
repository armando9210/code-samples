import React, { useCallback, useContext, useState } from 'react';
import { Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProductTabContainer } from '../../ProductDetail/styledComponents';
import {
  AttributeFilters,
  ChannelsAttributes,
  ClassificationAttributes,
  CustomAttributes, FullWidthDiv,
} from '../../ProductDetail/Tabs/Attributes';
import { FormsContext } from '../common';
import ProductsBulkUpdateActions from '../../../redux/actions/productsBulkUpdate';
import { useGetClassificationsQuery } from '../../../redux/api/productElements';
import Spacer from '../../../components/common/Spacer';

const sectionsVisibilityInitState = {
  custom: false,
  classification: false,
  channels: {},
};

const Attributes: React.FC = () => {
  const attributes = useSelector((state: any) => state.productsBulkUpdate.attributes);
  const [sectionsVisibility, setSectionsVisibility] = useState(sectionsVisibilityInitState);
  const originalAttributes = useSelector((state: any) => state.productsBulkUpdate.originalAttributes);
  const isFormUpdated = useSelector((state: any) => state.productsBulkUpdate.isFormUpdated);
  const attributesChannels = useSelector((state: any) => state.productsBulkUpdate.attributesChannels);
  const { data = [] } = useGetClassificationsQuery();
  const classifications = data;
  const groups1 = useSelector((state: any) => state.productsBulkUpdate.groups1);
  const groups2 = useSelector((state: any) => state.productsBulkUpdate.groups2);
  const dispatch = useDispatch();
  const forms = useContext(FormsContext);
  const { mainForm, attributeFilterForm } = forms;
  const classification = mainForm?.getFieldValue?.('ClassificationNum') || 0;
  const attributesCustom = originalAttributes.filter((f: any) => f.AttributeType === 1);
  const attributesClassification = originalAttributes.filter((f: any) => f.AttributeType === 2);

  const filter = useCallback(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    const attributesFiltered = [...originalAttributes];
    const filterValue = attributeFilterForm?.getFieldValue?.('Filter');
    const channelValue = attributeFilterForm?.getFieldValue?.('Channel');
    const group1Value = attributeFilterForm?.getFieldValue?.('Group1');
    const group2Value = attributeFilterForm?.getFieldValue?.('Group2');
    const newBooleanMap = attributesFiltered.reduce((p: any, c: Entities.ProductAttribute) => {
      const r = { ...p };
      r[c?.AttributeId || 0] = true;
      return r;
    }, {});

    if (classification > 0) {
      attributesFiltered.map((af: any) => {
        if (!newBooleanMap[af.AttributeId]) {
          return null;
        }
        newBooleanMap[af.AttributeId] = af.AttributeClassificationProfiles?.filter((acf: any) => acf.ClassificationNum === classification).length !== 0;
        return null;
      });
    }
    if (filterValue !== undefined && filterValue !== '') {
      attributesFiltered.map((af: any) => {
        if (!newBooleanMap[af.AttributeId]) {
          return null;
        }
        newBooleanMap[af.AttributeId] = af.AttributeName.toLowerCase().includes(filterValue.toLowerCase());
        return null;
      });
    }

    if (channelValue !== undefined && channelValue !== '') {
      attributesFiltered.map((af: any) => {
        if (!newBooleanMap[af.AttributeId]) {
          return null;
        }

        newBooleanMap[af.AttributeId] = af.AttributeChannelNum === channelValue;
        return null;
      });
    }

    if (group1Value !== undefined && group1Value !== '') {
      attributesFiltered.map((af: any) => {
        if (!newBooleanMap[af.AttributeId]) {
          return null;
        }
        newBooleanMap[af.AttributeId] =  af.Group1.toLowerCase() === group1Value.toLowerCase();
        return null;
      });
    }

    if (group2Value !== undefined && group2Value !== '') {
      attributesFiltered.map((af: any) => {
        if (!newBooleanMap[af.AttributeId]) {
          return null;
        }

        newBooleanMap[af.AttributeId] = af.Group2.toLowerCase() === group2Value.toLowerCase();
        return null;
      });
    }

    productsBulkUpdateActions.setBools(newBooleanMap);

    const sections = {
      custom: originalAttributes.filter((f: any) => newBooleanMap[f.AttributeId] && f.AttributeType === 1 && f.AttributeChannelNum === 0).length > 0,
      classification: originalAttributes.filter((f: any) => newBooleanMap[f.AttributeId] && f.AttributeType === 2 && f.AttributeChannelNum === 0).length > 0,
      channels: {},
    };
    attributesChannels.map((ac: any) => {
      sections.channels = {
        ...sections.channels,
        [ac.channelNum]: originalAttributes.filter((oa: any) => newBooleanMap[oa.AttributeId] && oa.AttributeChannelNum === ac.channelNum).length > 0,
      };
      return null;
    });
    setSectionsVisibility(sections);

  }, [attributeFilterForm, attributesChannels, classification, dispatch, originalAttributes]);

  const clear = useCallback(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    attributeFilterForm?.resetFields();
    const attributesFiltered = [...originalAttributes];
    const newBooleanMap = attributesFiltered.reduce((p: any, c: Entities.ProductAttribute) => {
      const r = { ...p };
      r[c?.AttributeId || 0] = true;
      return r;
    }, {});
    productsBulkUpdateActions.setBools(newBooleanMap);

    const sections = {
      custom: originalAttributes.filter((f: any) => newBooleanMap[f.AttributeId] && f.AttributeType === 1 && f.AttributeChannelNum === 0).length > 0,
      classification: originalAttributes.filter((f: any) => newBooleanMap[f.AttributeId] && f.AttributeType === 2 && f.AttributeChannelNum === 0).length > 0,
      channels: {},
    };
    attributesChannels.map((ac: any) => {
      sections.channels = {
        ...sections.channels,
        [ac.channelNum]: originalAttributes.filter((oa: any) => newBooleanMap[oa.AttributeId] && oa.AttributeChannelNum === ac.channelNum).length > 0,
      };
      return null;
    });
    setSectionsVisibility(sections);

  }, [attributeFilterForm, attributesChannels, dispatch, originalAttributes]);

  const onFormChange = useCallback(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    if (!isFormUpdated) {
      productsBulkUpdateActions.setIsFormUpdated(true);
    }
  }, [isFormUpdated, dispatch]);

  if (!mainForm || !attributeFilterForm) {
    return null;
  }

  return (
    <ProductTabContainer>
      <Row style={{ backgroundColor: '#e3e2e2', padding: '15px' }}>
        <Col span={24}>
          <Row>
            <Col span={24} style={{ marginBottom: '45px' }}>
              <h3 style={{ marginBottom: '2px' }}>Filter Attributes</h3>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ paddingLeft: '15px', marginBottom: '10px' }}>
              <AttributeFilters
                channels={attributesChannels}
                groups1={groups1}
                groups2={groups2}
                attributeFilterForm={attributeFilterForm}
                filterAttributesFunc={filter}
                clearFiltersFunc={clear}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {
        attributes.length > 0 ? (
          <FullWidthDiv>
            <Spacer />
            <ClassificationAttributes
              classification={classification}
              attributes={attributesClassification}
              classifications={classifications}
              editMode
              enabler
              onCheckChange={onFormChange}
              show={sectionsVisibility.classification}
            />
            <Spacer />
            <CustomAttributes
              classification={classification}
              attributes={attributesCustom}
              editMode
              enabler
              onCheckChange={onFormChange}
              show={sectionsVisibility.custom}
            />
            <Spacer />
            <ChannelsAttributes
              classification={classification}
              channels={attributesChannels}
              attributes={attributes}
              editMode
              enabler
              onCheckChange={onFormChange}
              show={sectionsVisibility.channels}
            />
          </FullWidthDiv>
        ) : (<h4 style={{ textAlign: 'center' }}>No data found</h4>)
      }
    </ProductTabContainer>
  );
};

export default Attributes;
