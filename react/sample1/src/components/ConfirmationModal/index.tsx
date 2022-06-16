import React from 'react';// eslint-disable-line
import { Button, Modal } from 'antd';
import styled from 'styled-components';

const TitleHeader = styled.label`
  width: 127px;
  height: 27px;
  font-family: Lato;
  font-size: 22px;
  font-weight: bold;
  color: #2d3f5d;
`;

function ConfirmationModal(props: any) {
  const { visible, title, handleCancel, handleConfirm, confirmText = 'Delete', cancelText = 'Cancel', bodyText = 'This action cannot be undone and you will be unable to recovery any data.' } = props;
  return (
    <Modal
      visible={visible}
      style={{ top: 30 }}
      title={
        <TitleHeader>{title}</TitleHeader>
      }
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" danger onClick={() => {handleConfirm(); handleCancel();}}>
          {confirmText}
        </Button>,
      ]}
    >
      <p>{bodyText}</p>
    </Modal>
  );
}

export default ConfirmationModal;
