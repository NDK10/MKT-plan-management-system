import { Button, Col, Form, Input, Row, Select } from "antd";
import React from "react";
import Label from "../../../components/form/Label";

export default function FilterTask({
  filterForm,
  listPerformer,
  setFilter,
  campaignName,
  idCampaign,
}) {
  const listStatusTask = [
    { label: "Đang đợi content", value: "ASSIGNED" },
    { label: "Đang chờ duyệt", value: "WAITING" },
    { label: "Đang triển khai", value: "INPROGRESS" },
    { label: "Đã hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELED" },
  ];
  return (
    <>
      <div>
        <h2>Quản lý kế hoạch</h2>
        <p>
          Dự án: <b>{campaignName}</b>
        </p>
      </div>
      <br />
      <br />
      <Form
        layout="vertical"
        form={filterForm}
        onFinish={(values) => {
          console.log("values", values);
          setFilter({
            ...values,
            campaignId: Number(idCampaign),
            page: 0,
            size: 10,
          });
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Tiêu đề" name="title">
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Người thực hiện" name="performerId">
              <Select
                placeholder="Chọn nhân viên"
                options={listPerformer.map((item) => ({
                  value: item.id,
                  label: `${item.fullName} (${item.email})`,
                }))}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                placeholder="Chọn trạng thái"
                options={listStatusTask}
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
