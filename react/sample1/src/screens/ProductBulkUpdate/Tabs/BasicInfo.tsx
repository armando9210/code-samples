import { Col, Row } from 'antd';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ProductTabContainer } from '../../ProductDetail/styledComponents';
import FormItemEnabler from '../FormItemEnabler';
import { bulkUpdateFields } from '../common';
import { useGetOPTAttributesQuery } from '../../../redux/api/opt';
import { ClassificationFilterField } from '../../../components/common/Products/SearchFields';
import ProductsBulkUpdateActions from '../../../redux/actions/productsBulkUpdate';

const BasicInfo: React.FC = () => {
  const [basicInfoHeight, setHeight] = useState<number>(500);
  const dispatch = useDispatch();
  const labels = useSelector((state: any) => state.productsBulkUpdate.labels);
  const basicChannels = useSelector((state: any) => state.productsBulkUpdate.basicChannels);
  const isFormUpdated = useSelector((state: any) => state.productsBulkUpdate.isFormUpdated);
  const { data = [] } = useGetOPTAttributesQuery();
  const attributesOPT = data;
  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const onFormChange = useCallback(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    if (!isFormUpdated) {
      productsBulkUpdateActions.setIsFormUpdated(true);
    }
  }, [isFormUpdated, dispatch]);

  return (
    <ProductTabContainer>
      <Row>
        <Col span={24} style={{ paddingLeft: '15px' }}>
          <Row style={{ width:'100%', flexDirection:'row', display:'flex' }}>
            <Col style={{ height: 'fit-content' }} ref={measuredRef} span={12}>
              {bulkUpdateFields(attributesOPT, labels, basicChannels).basicInfo.map((f: any) => (
                <FormItemEnabler
                  key={`basicField-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
              <ClassificationFilterField
                enabler
                name={attributesOPT.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'ClassificationNum')[0]?.AttributeId || 'ClassificationNum'}
                formLabelVertical={false}
                onCheckChange={onFormChange}
              />
            </Col>
            <Col span={12} style={{ height: basicInfoHeight, textAlign:'center' }}>
              <img src="https://via.placeholder.com/500x400" alt='product' />
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ borderBottom: 'solid 1px #016dff', marginBottom: '15px' }}>
              <h3 style={{ marginBottom: '2px' }}>Pricing</h3>
            </Col>
            <Col span={12}>
              {bulkUpdateFields(attributesOPT).pricing1.map((f: any) => (
                <FormItemEnabler
                  key={`pricingField1-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
            </Col>
            <Col span={12} style={{ paddingLeft: '15px' }}>
              {bulkUpdateFields(attributesOPT).pricing2.map((f: any) => (
                <FormItemEnabler
                  key={`pricingField2-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ borderBottom: 'solid 1px #016dff', marginBottom: '15px' }}>
              <h3 style={{ marginBottom: '2px' }}>Technical</h3>
            </Col>
            <Col span={12}>
              {bulkUpdateFields(attributesOPT).technical1.map((f: any) => (
                <FormItemEnabler
                  key={`technicalField1-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
            </Col>
            <Col span={12} style={{ paddingLeft: '15px' }}>
              {bulkUpdateFields(attributesOPT).technical2.map((f: any) => (
                <FormItemEnabler
                  key={`technicalField2-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ borderBottom: 'solid 1px #016dff', marginBottom: '15px' }}>
              <h3 style={{ marginBottom: '2px' }}>Physical</h3>
            </Col>
            <Col span={12}>
              {bulkUpdateFields(attributesOPT).physical1.map((f: any) => (
                <FormItemEnabler
                  key={`physicalField1-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
            </Col>
            <Col span={12} style={{ paddingLeft: '15px' }}>
              {bulkUpdateFields(attributesOPT).physical2.map((f: any) => (
                <FormItemEnabler
                  key={`physicalField2-${f.formItemProperties.name}`}
                  onCheckChange={onFormChange}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...f}
                />
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </ProductTabContainer>
  );
};

export default BasicInfo;
