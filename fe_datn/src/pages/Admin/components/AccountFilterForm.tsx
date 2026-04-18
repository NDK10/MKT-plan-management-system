import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import AccountService from "../../../service/AccountService";

export default function AccountFilterForm({ setFilter, filter }) {
  const STATUS_OPTIONS = [
    { label: "Hiệu lực", value: 1 },
    { label: "Hết hiệu lực", value: 0 },
  ];

  const [form] = Form.useForm();

  const [listRole, setListRole] = React.useState([]);

  useEffect(() => {
    async function fetchDataRoles() {
      const res = await AccountService.getAccountRole();
      console.log("resRoles", res);
      let lstRole = res?.data || [];
      lstRole = lstRole?.map((item) => ({ label: item.name, value: item.id }));
      setListRole(lstRole);
    }
    fetchDataRoles();
  }, []);
  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          console.log("values", values);
          setFilter({ ...values, page: 0, size: 10 });
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                options={STATUS_OPTIONS}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Vai trò" name="roleId">
              <Select
                placeholder="Chọn vai trò"
                options={listRole}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
