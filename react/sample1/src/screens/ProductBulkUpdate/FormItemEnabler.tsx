import React, { useCallback, useMemo, useState } from 'react';
import {
  Row,
  Col,
  Form,
  Tooltip,
  Checkbox,
} from 'antd';
import { useSelector } from 'react-redux';
import { componentMapping, FormElementProps, Type } from '../../components/common/FormElement';

interface FormEnablerProps extends FormElementProps {
  onCheckChange?: Function,
}

const FormItemEnabler: React.FC<FormEnablerProps> = ({
  inputType = Type.INPUT,
  inputProperties = {},
  formItemProperties = {},
  toolTip = '',
  onCheckChange = () => {},
}) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  // @ts-ignore
  const ElementInput = componentMapping[inputType];
  const [formName, formProps] = useMemo(() => {
    const { name, ...rest } = formItemProperties;
    return [name, rest];
  }, [formItemProperties]);

  const display = useSelector((state: any) => state.productsBulkUpdate.booleanMap[`${formName}`]);

  const enableInput = useCallback((valueParam: any) => {
    setEnabled(valueParam.target.checked);
    onCheckChange();
  }, [onCheckChange]);
  return (
    <Row style={{ display: display ? '' : 'none' }}>
      <Col span={2}>
        <Form.Item name={['bools', `enable-${formName}`]} valuePropName="checked">
          <Checkbox style={{ marginTop: '7px' }} onChange={enableInput} />
        </Form.Item>
      </Col>
      <Col span={22}>
        <Tooltip title={toolTip}>
          <Form.Item
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...formProps}
            name={enabled ? formName : undefined}
          >
            <ElementInput
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...inputProperties}
              disabled={!enabled}
            />
          </Form.Item>
        </Tooltip>
      </Col>
    </Row>
  );
};

export default FormItemEnabler;
