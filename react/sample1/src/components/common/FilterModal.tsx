import React, { useCallback, useState } from 'react';
import { Button, Form, FormProps, Modal } from "antd";
import { ModalTitle } from './styledComponents';
import styled from "styled-components";
import Spacer from "./Spacer";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";


const ApplyButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;


interface FilterModalProps<T> extends FormProps {
  title?: string;
  onFilter?: (data: T) => void;
  children?: React.ReactNode;
  modalStyle?: React.CSSProperties;
}

function FilterModal<T>(
  {
    title = 'Filter by',
    children,
    onFilter,
    modalStyle,
    ...formProps
  }: FilterModalProps<T>,
) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onFormFinished = useCallback((data: T) => {

    const dataCopy: any = { ...data };
    // API does not like empty query parameters, so it's better
    // to remove them
    Object.keys(dataCopy).forEach(k => {
      if (!dataCopy[k]) {
        delete dataCopy[k];
      }
    });

    setVisible(false);
    onFilter?.(dataCopy);
  }, [onFilter]);

  return (
    <>
      <Button
        onClick={() => setVisible(true)}
        icon={<FilterOutlined />}
      >
        Filter by
      </Button>

      <Modal
        style={{
          minWidth: '640px',
          ...modalStyle,
        }}
        title={(
          <ModalTitle>
            {title}
          </ModalTitle>
        )}
        onCancel={() => setVisible(false)}
        visible={visible}
        closable={false}
        footer={null}
        forceRender
      >
        <Form
          labelCol={{ xs: 24, md: 8, lg: 6 }}
          wrapperCol={{ xs: 24, md: 16, lg: 18 }}
          {...formProps}
          form={form}
          onFinish={onFormFinished}
        >
          <ApplyButtonContainer>
            <Button htmlType="submit">
              Apply
              <PlusOutlined />
            </Button>
          </ApplyButtonContainer>
          <Spacer />
          {children}
        </Form>
      </Modal>
    </>
  );
}

export default FilterModal;
