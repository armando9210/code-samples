import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Input, Popover, Select, Space, Table } from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/es/form/FormList';
import { LabeledValue } from 'antd/es/select';
import { ValidatorRule } from 'rc-field-form/lib/interface';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 200px;
  min-width: 120px;
  border: 1px solid #d8dde6;
  border-radius: 8px;
  overflow: hidden;
`;

/* eslint-disable react/no-unused-prop-types,react/require-default-props */
interface ListInputBaseProps<T, U> {
  form: FormInstance;
  choices: T[];
  /**
   * Attribute of the choice object to use as key for rendering purposes.
   * Defaults to 'key';
   */
  choiceKey?: string;
  /**
   * Attribute of the choice object to use as a human-readable label
   * on the select options.
   *
   * Defaults to 'label';
   */
  choiceLabel?: string;

  /**
   * Attribute of the choice object to be used as value for the select
   * component and to find the selected choice.
   *
   * Defaults to 'value'
   */
  choiceValue?: string;

  /**
   * Attribute of the item to use as label.
   *
   * This is used to render a Form.Item with an Input that will render the human-friendly value
   * of the objects in the list.
   */
  itemKey?: string;

  /**
   * Callback when adding an item to the list.
   *
   * Use this to shape the choice to the data you need to insert on the form.
   * @param choice
   */
  onAdd?: (choice: T) => object;

  /**
   * Define this function to determine whether to add or skip a selected item.
   *
   * Item will be added if the function yields true.
   */
  unique?: (currentValues: U[], newValue: T) => boolean;
}

/* eslint-enable react/no-unused-prop-types,react/require-default-props */

interface ListInputProps<T, U> extends ListInputBaseProps<T, U> {
  disabled?: boolean;
  prefixCls?: string;
  name: string | number | (string | number)[];
  rules?: ValidatorRule[];
  initialValue?: T[];
}

const Item: React.FC<{ field: FormListFieldData, onRemove: () => void, itemKey: string, disabled: boolean }> = (
  {
    field,
    itemKey,
    onRemove,
    disabled,
  },
) => (
  <Space>
    <Button onClick={onRemove} type="text" size="small" disabled={disabled} danger>
      <MinusCircleOutlined />
    </Button>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Form.Item {...field} name={[field.name, itemKey]} noStyle>
      <Input disabled bordered={false} />
    </Form.Item>
  </Space>
);

interface ChoiceSelectProps<T> {
  choices: T[];
  /**
   * Attribute of the choice object to use as key.
   * Defaults to 'key'
   */
  choiceKey?: string;
  /**
   * Attribute of the choice object to use as a human-readable label.
   * Defaults to 'label'
   */
  choiceLabel?: string;

  /**
   * Attribute of the choice object to use as value
   */
  choiceValue?: string;

  onSelect: (choice: T) => void;

  disabled?: boolean;

  children: React.ReactNode;
}

function ChoiceSelect<T>(
  {
    choices = [],
    choiceKey = 'key',
    choiceLabel = 'label',
    choiceValue = 'value',
    onSelect,
    children,
    disabled,
  }: ChoiceSelectProps<T>) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const onOptionSelected = useCallback((value: string | number | LabeledValue) => {
    const selectedChoice = choices.find((choice: any) => choice[choiceValue] === value);

    if (!selectedChoice) {
      return;
    }

    onSelect(selectedChoice);
  }, [onSelect, choices, choiceValue]);

  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
      placement="bottom"
      trigger="click"
      content={!disabled && (
        <Space direction="horizontal">
          <Select
            style={{ minWidth: '300px' }}
            onSelect={onOptionSelected}
            showSearch
            autoFocus
          >
            {
              choices.map((choice: any, index: number) => {
                const key = choice[choiceKey];
                const value = choice[choiceValue] || choiceKey;
                const label = choice[choiceLabel] || `Item ${index}`;

                return (
                  <Select.Option value={value} key={key}>
                    {label}
                  </Select.Option>
                );
              })
            }
          </Select>
        </Space>
      )}
    >
      {children}
    </Popover>
  );
}

ChoiceSelect.defaultProps = {
  choiceKey: 'key',
  choiceLabel: 'label',
  choiceValue: 'key',
  disabled: false,
};

interface ListInputContentProps<T, U> extends ListInputBaseProps<T, U> {
  formFieldName: string | number | (string | number)[];
  fields: FormListFieldData[];
  operation: FormListOperation;
  disabled: boolean;
  onAdd: (choice: T) => object;
}

function ListInputContent<T, U>(
  {
    formFieldName,
    itemKey = 'key',
    fields,
    operation,
    disabled,
    choices,
    onAdd,
    choiceKey = 'key',
    choiceLabel = 'label',
    choiceValue = 'value',
    form,
    unique,
  }: ListInputContentProps<T, U>,
) {
  const onOptionSelected = useCallback((choice: T) => {
    const shouldAdd = unique ? unique(form.getFieldValue(formFieldName), choice) : true;

    if (!shouldAdd) {
      return;
    }

    const values: any = onAdd(choice);
    operation.add(values);
  }, [onAdd, operation, form, unique, formFieldName]);

  const columns = useMemo(() => [
    {
      title: '',
      dataIndex: 'key',
      ellipsis: true,
      width: 120,
      render(text: string, record: FormListFieldData, index: number) {
        return (
          <Item
            field={record}
            onRemove={() => operation.remove(index)}
            itemKey={itemKey}
            disabled={disabled}
          />
        );
      },
    },
  ], [itemKey, operation, disabled]);

  const addButton = useMemo(() => {
    const button = (
      <Button
        type="link"
        disabled={disabled}
        icon={<PlusCircleOutlined />}
      >
        Add
      </Button>
    );

    if (disabled) {
      return button;
    }

    return (
      <ChoiceSelect<T>
        choices={choices}
        choiceValue={choiceValue}
        choiceLabel={choiceLabel}
        choiceKey={choiceKey}
        onSelect={onOptionSelected}
      >
        {button}
      </ChoiceSelect>
    );
  }, [disabled, choiceKey, choiceLabel, choiceValue, onOptionSelected, choices]);

  return (
    <Space align="start">
      <Container>
        <Table
          size="small"
          showHeader={false}
          columns={columns}
          dataSource={fields}
          pagination={false}
          scroll={{ y: 280 }}
        />
      </Container>
      <Space size="small" />
      {addButton}
    </Space>
  );
}


function ListInput<T, U>(
  {
    itemKey = 'name',
    choices, disabled = false,
    onAdd = (choice: any) => choice,
    unique,
    choiceKey,
    choiceLabel,
    choiceValue,
    form,
    ...formListProps
  }: ListInputProps<T, U>,
) {
  const { name } = formListProps;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Form.List {...formListProps}>
      {
        (fields, operation) => (
          <ListInputContent
            form={form}
            formFieldName={name}
            fields={fields}
            operation={operation}
            disabled={disabled}
            choiceKey={choiceKey}
            choiceValue={choiceValue}
            choiceLabel={choiceLabel}
            itemKey={itemKey}
            choices={choices}
            onAdd={onAdd}
            unique={unique}
          />
        )
      }
    </Form.List>
  );
}

ListInput.defaultProps = {
  itemKey: 'label',
  prefixCls: '',
  rules: [],
  initialValue: [],
  disabled: false,
  onAdd: (choice: any) => choice,
  choiceKey: 'key',
  choiceLabel: 'label',
  choiceValue: 'value',
};

export default ListInput;
