import { Form, Input, InputNumber } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';
import styled from 'styled-components';

const BaseInput = styled.input`
margin: 0;
border-radius: 4px;
height: 38px;
border: solid 1px #006dff;
`;

interface CellConfig {
  inputType: any;
  editing: boolean;
}

interface EditableCellProps extends ColumnProps<any> {
  record?: any;
  title: string;
  children: any | React.ReactNode;
  config?: CellConfig;
}

const EditableCell: React.FC<EditableCellProps> = (
  {
    record,
    title,
    dataIndex,
    config,
    children,
    ...props
  }: EditableCellProps,
) => {
  if (!config || !config.editing) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <td {...props}>{children}</td>;
  }

  let inputComponent;
  switch (config.inputType) {
    case 'number':
      inputComponent = InputNumber;
      break;
    case 'textarea':
      inputComponent = Input.TextArea;
      break;
    default:
      inputComponent = Input;
      break;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <td {...props}>
      <Form.Item
        name={dataIndex as string}
        style={{margin: 0}}
        rules={[
          {
            required: true,
            message: `Please input ${title}`,
          },
        ]}
      >
        <BaseInput as={inputComponent} />
      </Form.Item>
    </td>
  );
};

EditableCell.defaultProps = {
  record: undefined,
  config: undefined,
};

export default EditableCell;
