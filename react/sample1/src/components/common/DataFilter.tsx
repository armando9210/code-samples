import { Button, Form, Modal } from 'antd';
import { FormInstance } from 'antd/es/form';
import { ModalProps } from 'antd/es/modal';
import React, { useState } from 'react';
import { NamePath } from 'antd/es/form/interface';


export type OnFilter<T> = (e: React.MouseEvent<HTMLElement, MouseEvent>, filteredData: Array<T>) => void;

export interface Filter<T> {
  // Widget to be rendered on the modal
  widget: React.FC<{name: NamePath}>;
  // Filtering function
  filter: (data: T, filterValue: any) => boolean;
  // NamePath of form
  name: NamePath;
}

interface DataFilterProps<T> extends ModalProps {
  filters: Array<Filter<T>>;
  data: Array<T>;
  onFilter: OnFilter<T>;
  form?: FormInstance;
}

function DataFilter<T>({data, filters, onFilter, form, ...modalProps}: DataFilterProps<T>) {
  const [wrapForm] = Form.useForm(form);
  const [visible, setVisible] = useState(false);

  const widgets: React.ReactNode[] = filters.map(f => f.widget({name: f.name}));

  const onClose = () => setVisible(false);
  const onOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onClose();
    if (modalProps.onOk) {
      throw new Error('You must specify OnFilter instead of OnOk');
    }

    const filteredData: any = filters.reduce((prev, curr) => data.filter(d => curr.filter(d, wrapForm.getFieldValue(curr.name))), data);

    onFilter(e, filteredData);
  };

  return (
    <div>
      <Button onClick={() => setVisible(true)}>
        Filter
      </Button>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Modal {...modalProps} visible={visible} onOk={onOk} onCancel={onClose}>
        <Form form={wrapForm}>
          {widgets}
        </Form>
      </Modal>
    </div>
  );
}

DataFilter.defaultProps = {
  form: undefined,
};

export default DataFilter;
