import React from 'react';
import {
  Form,
  Tooltip,
  Select,
  Input,
  Checkbox,
  InputNumber,
  FormItemProps,
  InputProps,
  InputNumberProps, CheckboxProps, SelectProps, Radio,
} from 'antd';

const { TextArea } = Input;

export interface FormElementProps {
  /**
   * Determines the input antd type element
   * Default: input
   * Values available:
   * input(Input), password(Input.Password)
   * select (Select), checkbox (Checkbox)
   * number (InputNumber)
   */
  inputType?: string;
  /**
   * Input selected (inputType) property values
   */
  inputProperties?: InputProps | InputNumberProps | CheckboxProps | SelectProps<any>;
  /**
   * Form.Item property values
   */
  formItemProperties?: FormItemProps;
  /**
   * Tooltip text (If it has value, the tooltip element is added)
   */
  toolTip?: string;
}

export enum Type {
  INPUT = 'input',
  PASSWORD = 'password',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  RADIO = 'radio',
}

/**
 * Components available to choose and apply on inputType param property
 *
 * In case of needing another component you can add it to the mapping.
 */
export const componentMapping = {
  [Type.INPUT]: Input,
  [Type.PASSWORD]: Input.Password,
  [Type.SELECT]: Select,
  [Type.CHECKBOX]: Checkbox,
  [Type.NUMBER]: InputNumber,
  [Type.TEXTAREA]: TextArea,
  [Type.RADIO]: Radio,
};

/**
 * This component adds a desired Antd input element within Form.Item element
 */

const FormElement: React.FC<FormElementProps> = ({
  inputType = Type.INPUT,
  inputProperties = {},
  formItemProperties = {},
  toolTip = '',
}) => {

  // @ts-ignore
  const ElementInput = componentMapping[inputType];

  const element = (
    <Form.Item
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formItemProperties}
    >
      <ElementInput
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...inputProperties}
      />
    </Form.Item>
  );

  return toolTip !== '' ? (
    <Tooltip title={toolTip}>
      {element}
    </Tooltip>
  ) : element;
};

export default FormElement;
