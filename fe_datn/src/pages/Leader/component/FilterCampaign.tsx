import { Button, Col, Form, Input, Row, Select } from "antd";
import React, { useEffect } from "react";
import AccountService from "../../../service/AccountService";
import CampaignService from "../../../service/CampaignService";

export default function CampaignFilterForm({
  setFilter,
  filter,
  userResponsible,
}) {
  const [form] = Form.useForm();

  const [listUserResponsible, setListUserResponsible] = React.useState([]);

  const listStatusCampaign = [
    { label: "Đang chờ duyệt", value: "WAITING" },
    { label: "Đang triển khai", value: "INPROGRESS" },
    { label: "Đã hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELED" },
  ];

  return (
    <>
      <h2>Quản lý các chiến dịch marketing</h2>
      <br />
      <br />
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          console.log("values", values);
          setFilter({
            ...values,
            userResponsible: userResponsible,
            page: 0,
            size: 10,
          });
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
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                options={listStatusCampaign}
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
