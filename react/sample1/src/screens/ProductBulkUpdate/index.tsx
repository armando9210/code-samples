import React, { useContext, useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { Spin, Form, Tabs, notification, FormInstance } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import ContentLayout from '../../components/ContentLayout';
import ProductSearchAddRemove from '../../components/common/ProductSearchAddRemove';
import BasicInfo from './Tabs/BasicInfo';
import SiteContent from '../../components/SiteContent';
import ProductsBulkUpdateActions from '../../redux/actions/productsBulkUpdate';
import Products  from '../../services/products';
import { FormsContextType, FormsContext } from './common';
import Attributes from './Tabs/Attributes';
import { WarningMessage } from './styledComponents';
import ConfirmationModal from '../../components/ConfirmationModal';
import FormButtons from '../../components/common/FormButtons';
import { Permissions } from '../../constants/enums/permissions';
import { useAddOPTProductMutation, useGetOPTAttributesQuery } from '../../redux/api/opt';
import { ProductSearchProps } from '../../components/common/ProductSearch';


const useProductBulkUpdatePageLoad = () => {
  const dispatch = useDispatch();
  const [mainForm] = Form.useForm();
  const [attributeFilterForm] = Form.useForm();
  const [channelInvFilterForm] = Form.useForm();
  const [productFilterForm] = Form.useForm();
  const [forms] = useState<FormsContextType>({ mainForm, attributeFilterForm, channelInvFilterForm, productFilterForm });


  useEffect(() => {
    const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
    productsBulkUpdateActions.setLoading(true);
    const handler = async () => {
      const basicChannels = await Products.getChannelControlFlags();
      const attributesChannels = await Products.getAccountEnabled();
      const attributes = await Products.getAttributes();

      const labels = await Products.getLabels({
        $count: true,
        $top: 0,
      });

      let groups1 = attributes.map((a: any) => a.Group1);
      let groups2 = attributes.map((a: any) => a.Group2);
      groups1 = groups1.filter((data: any, index: any) => groups1.indexOf(data) === index && data !== '');
      groups2 = groups2.filter((data: any, index: any) => groups2.indexOf(data) === index && data !== '');

      const visibilityMap = attributes.reduce((p: any, c: Entities.ProductAttribute) => {
        const r = { ...p };
        r[c?.AttributeId || 0] = true;
        return r;
      }, {});


      productsBulkUpdateActions.setLabels(labels.LabelList || []);

      productsBulkUpdateActions.setBasicChannels(basicChannels);
      productsBulkUpdateActions.setAttributesChannels(attributesChannels);
      productsBulkUpdateActions.setBools(visibilityMap);
      productsBulkUpdateActions.setAttributes({ attributes, groups1, groups2 });

      return Promise.resolve();
    };

    handler()
      .catch(() => {

      })
      .finally(() => {
        productsBulkUpdateActions.setLoading(false);
      });
  }, [mainForm, dispatch, attributeFilterForm, channelInvFilterForm, productFilterForm]);
  return forms;
};

const saveNewLabels = async (allLabels: Array<Entities.ILabel>, labelsSaved: Array<string> ) => {
  const labels = allLabels.map((l: any) => l.ProductLabelId);
  const newLabels = labelsSaved.filter((ls: any) => !labels.includes(ls));
  const oldLabelsIds = labelsSaved.filter((ls: any) => labels.includes(ls));

  const newLabelsRequests = newLabels.map(async (nl: any) => Products.createLabel({
    ProductLabelDesc: '',
    ProductLabelName: nl,
  }));

  await Promise.all(newLabelsRequests).then();
  const labelsUpdated = await Products.getLabels({
    $count: true,
    $top: 0,
  });

  const newLabelsIds  = newLabels.map((nl: any) => {
    const found = labelsUpdated.LabelList.find((lu: any) => lu.ProductLabelName === nl);
    if (!found) return {};

    return found.ProductLabelId;
  });

  return newLabelsIds.concat(oldLabelsIds);
};

const reset = (mainForm: FormInstance, history: any) => {
  mainForm.resetFields();
  history.push('/product-bulk-update');
};

const saveProduct = async (dispatch: Dispatch, allLabels: Array<Entities.ILabel>, history: any, form: FormInstance, attributesOPT: Entities.CommerceCentralOPTAttribute[], selectedProducts: Array<Entities.ProductProfile>, saveOPTProduct: any) => {
  const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
  productsBulkUpdateActions.setLoading(true);
  productsBulkUpdateActions.setIsFormUpdated(false);
  const formValues = { ...form.getFieldsValue() };
  try {
    if (selectedProducts.length === 0) {
      notification.error({ message: 'Please select products first' });
      return await Promise.reject();
    }

    const labelsAttributeId = attributesOPT.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeName === 'labels' || f.AttributeName === 'label')[0]?.AttributeId || -1;
    let labelsToSave: any = [];
    if (labelsAttributeId !== -1 && formValues[labelsAttributeId]) {
      labelsToSave = await saveNewLabels(allLabels, formValues[labelsAttributeId]);
    }

    delete formValues?.enablers;
    delete formValues?.bools;

    const arrayValues = Object.keys(formValues).map(key => {
      const AttributeName = attributesOPT.filter((f: Entities.CommerceCentralOPTAttribute) => f.AttributeId === key)[0]?.AttributeName || -1;
      if (AttributeName === 'labels' || AttributeName === 'label') {
        return {
          AttributeId: key,
          AttributeName,
          OriginalValue: '',
          NewValue: labelsToSave,
        };
      }
      return {
        AttributeId: key,
        AttributeName,
        OriginalValue: '',
        NewValue: formValues[key],
      };
    });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const payload = {
      OPTLabel: `Bulk update ${today.toLocaleDateString('en-US')}`,
      StartDate: today.toISOString(),
      EndDate: tomorrow.toISOString(),
      ProductList: selectedProducts.map((sp: Entities.ProductProfile) => ({
        SKU: sp.SKU,
        CentralProductId: sp.ProductId,
        ProductAttributeAssignedList: arrayValues,
      })),
    };

    await saveOPTProduct(payload);
    form.resetFields();
    return await Promise.resolve();
  } catch (e) {
    return await Promise.reject(e);
  } finally {
    productsBulkUpdateActions.setLoading(false);
  }
};

const onSave = ( dispatch: Dispatch, allLabels: Array<Entities.ILabel>, history: any, form: FormInstance, attributesOPT: Entities.CommerceCentralOPTAttribute[], selectedProducts: Array<Entities.ProductProfile>, saveOPTProduct: any) => {
  saveProduct(dispatch, allLabels, history, form, attributesOPT, selectedProducts, saveOPTProduct)
    .then(() => notification.success({ message: 'Products Saved' }))
    .catch((e) => notification.error(e));
};


const Controls: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const isFormUpdated = useSelector((state: any) => state.productsBulkUpdate.isFormUpdated);
  const selectedProducts = useSelector((state: any) => state.productsBulkUpdate.products);
  const labels = useSelector((state: any) => state.productsBulkUpdate.labels);
  const [saveOPTProduct] = useAddOPTProductMutation();
  const forms = useContext(FormsContext);
  const { mainForm } = forms;
  const { data = [] } = useGetOPTAttributesQuery();
  const attributesOPT = data;
  if (!mainForm) {
    return null;
  }

  return (
    <>
      <ConfirmationModal
        handleCancel={() => setShowConfirm(false)}
        handleConfirm={reset}
        visible={showConfirm}
        title="Are you sure you want to cancel?"
        confirmText="Yes"
        cancelText="No"
      />
      <FormButtons
        editingMode
        permissionNumber={Permissions.MANAGE_PRODUCT_ELEMENTS}
        onSave={() => onSave(dispatch, labels, history, mainForm, attributesOPT, selectedProducts, saveOPTProduct)}
        onCancel={() => {
          if (isFormUpdated) {
            setShowConfirm(true);
          } else {
            reset(mainForm, history);
          }
        }}
        disableSave={!isFormUpdated}
      />
    </>
  );
};

const productsSearchProps: ProductSearchProps = {
  title: 'Product Search',
  allowMultiple: true,
  tableStyle: { height: '500px' },
  buttonText: 'Add products',
};

const SearchProductsTab: React.FC = () => {
  const dispatch = useDispatch();
  const productsBulkUpdateActions = bindActionCreators(ProductsBulkUpdateActions, dispatch);
  return (
    <ProductSearchAddRemove
      onChangeSelected={productsBulkUpdateActions.setProducts}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...productsSearchProps}
    />
  );
};

const ProductBulkUpdateScreen: React.FC = () => {
  const forms = useProductBulkUpdatePageLoad();
  const { mainForm, productFilterForm } = forms;
  const isFormUpdated = useSelector((state: any) => state.productsBulkUpdate.isFormUpdated);
  const loading = useSelector((state: any) => state.productsBulkUpdate.loading);
  const selectedProducts = useSelector((state: any) => state.productsBulkUpdate.products);
  if (!productFilterForm || !mainForm) {
    return null;
  }
  return (
    <FormsContext.Provider value={forms}>
      <ContentLayout>
        <Prompt
          when={isFormUpdated}
          message="You have unsaved changes, are you sure you want to exit?"
        />
        <Spin spinning={loading}>
          <Form
            form={mainForm}
            labelCol={{
              sm: { span: 12 },
              lg: { span: 7 },
              xl: { span: 12 },
            }}
            wrapperCol={{
              sm: { span: 13 },
              lg: { span: 12 },
              xl: { span: 12 },
            }}
            initialValues={{ size: 'middle' }}
          >
            <SiteContent>
              <Tabs defaultActiveKey="Search" tabBarExtraContent={<Controls />}>
                <Tabs.TabPane
                  tab="Search"
                  key="Search"
                  forceRender
                >
                  <SearchProductsTab />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab="Basic Info"
                  key="Basic"
                  forceRender
                  disabled={selectedProducts.length === 0}
                >
                  <WarningMessage>
                    ***Select the Attributes you want to change. These changes can not be reverted so be careful
                    with your selection.
                  </WarningMessage>
                  <BasicInfo />
                </Tabs.TabPane>
                <Tabs.TabPane
                  tab="Attributes"
                  key="Attributes"
                  disabled={selectedProducts.length === 0}
                >
                  <WarningMessage>
                    ***Select the Attributes you want to change. These changes can not be reverted so be careful
                    with your selection.
                  </WarningMessage>
                  <Attributes />
                </Tabs.TabPane>
              </Tabs>
            </SiteContent>
          </Form>
        </Spin>
      </ContentLayout>
    </FormsContext.Provider>
  );
};


export default ProductBulkUpdateScreen;
