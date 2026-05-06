import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import AccountService from "../../../service/AccountService";
import CampaignService from "../../../service/CampaignService";

export default function CampaignFilterForm({ setFilter, filter, type }) {
  const [form] = Form.useForm();

  const [listUserResponsible, setListUserResponsible] = React.useState([]);

  useEffect(() => {
    async function fetchDataUserResponsible() {
      const res = await CampaignService.getAllUserResponsible();
      let lstUserResponsible = res?.data || [];
      lstUserResponsible = lstUserResponsible?.map((item) => ({
        label: item.fullName,
        value: item.id,
      }));
      setListUserResponsible(lstUserResponsible);
    }
    fetchDataUserResponsible();
  }, []);

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          console.log("values", values);
          setFilter({ ...values, status: type, page: 0, size: 10 });
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Code" name="code">
              <Input placeholder="Nhập code dự án" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Tên" name="name">
              <Input placeholder="Nhập tên dự án" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Người phụ trách" name="userResponsible">
              <Select
                placeholder="Chọn người phụ trách"
                options={listUserResponsible}
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
