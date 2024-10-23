import React, { useState } from 'react';
import { Modal, Checkbox, Button, Table, Divider } from 'antd';
import styles from './RoleManagementModal.module.css';
import { RoleData, RoleManagementModalProps } from '@/app/types/workspace';

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ isModalOpen, onClose, workspaceId }) => {
  const [dataSource, setDataSource] = useState<RoleData[]>([
    {
      key: '1',
      functionality: 'Data Upload',
      adminRead: true,
      adminWrite: true,
      userRead: false,
      userWrite: false,
    },
    {
      key: '2',
      functionality: 'Pre validation',
      adminRead: true,
      adminWrite: true,
      userRead: false,
      userWrite: false,
    },
    {
      key: '3',
      functionality: 'Pre processing',
      adminRead: true,
      adminWrite: true,
      userRead: false,
      userWrite: false,
    },
    {
      key: '4',
      functionality: 'Clean Data Management',
      adminRead: true,
      adminWrite: true,
      userRead: false,
      userWrite: false,
    },
  ]);

  const handleCheckboxChange = (key: string, field: keyof RoleData) => (e: any) => {
    const updatedData = dataSource.map((item) => {
      if (item.key === key) {
        return { ...item, [field]: e.target.checked };
      }
      return item;
    });
    setDataSource(updatedData);
  };

  const columns = [
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      key: 'functionality',
    },
    {
      title: 'Admin Read',
      dataIndex: 'adminRead',
      key: 'adminRead',
      render: (_: any, record: RoleData) => (
        <Checkbox
          checked={record.adminRead}
          onChange={handleCheckboxChange(record.key, 'adminRead')}
        />
      ),
    },
    {
      title: 'Admin Write',
      dataIndex: 'adminWrite',
      key: 'adminWrite',
      render: (_: any, record: RoleData) => (
        <Checkbox
          checked={record.adminWrite}
          onChange={handleCheckboxChange(record.key, 'adminWrite')}
        />
      ),
    },
    {
      title: 'User Read',
      dataIndex: 'userRead',
      key: 'userRead',
      render: (_: any, record: RoleData) => (
        <Checkbox
          checked={record.userRead}
          onChange={handleCheckboxChange(record.key, 'userRead')}
        />
      ),
    },
    {
      title: 'User Write',
      dataIndex: 'userWrite',
      key: 'userWrite',
      render: (_: any, record: RoleData) => (
        <Checkbox
          checked={record.userWrite}
          onChange={handleCheckboxChange(record.key, 'userWrite')}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Role Management"
      open={isModalOpen}
      onCancel={onClose}
      footer={[
        <Button key="done" type="primary" onClick={onClose} className='btn'>
          Done
        </Button>,
      ]}
      width={600}
    >
      <p>Manage role for a particular workspace.</p>
      <Divider />
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className={styles.roleManagementTable}
        rowKey="key"
      />
    </Modal>
  );
};

export default RoleManagementModal;
