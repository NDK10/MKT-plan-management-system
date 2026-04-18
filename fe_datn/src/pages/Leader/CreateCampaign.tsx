import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  DatePicker,
  Select,
  notification,
} from "antd";
import dayjs from "dayjs";
import AccountService from "../../service/AccountService";
import CampaignService from "../../service/CampaignService";

const { TextArea } = Input;
const { Option } = Select;

export default function CreateCampaign() {
  const [form] = Form.useForm();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await AccountService.getAll();
      setAccounts(res.data);
    } catch (error) {
      message.error("Không load được danh sách nhân viên");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        dateStart: values.dateStart ? values.dateStart.toISOString() : null,
        dateComplete: values.dateComplete
          ? values.dateComplete.toISOString()
          : null,
      };

      await CampaignService.create(payload);

      notification.success({
        message: "Thành công",
        description: "Đã tạo chiến dịch thành công vui lòng đợi duyệt",
        placement: "topRight",
        getContainer: () => document.body, // ép ra ngoài layout
      });
      form.resetFields();
    } catch (error: any) {
      notification.error({
        message: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <Card title="Thêm mới Campaign">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Code"
              rules={[{ required: true, message: "Nhập code" }]}
            >
              <Input placeholder="Nhập mã campaign" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên Campaign"
              rules={[{ required: true, message: "Nhập tên" }]}
            >
              <Input placeholder="Nhập tên campaign" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="status" label="Trạng thái">
              <Select
                options={[
                  { label: "Đang chạy", value: "PROGRESS" },
                  { label: "Hoàn thành", value: "COMPLETE" },
                  { label: "Hủy", value: "CANCEL" },
                ]}
                placeholder="Chọn trạng thái"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="userResponsible" label="Người phụ trách">
              <Input placeholder="Nhập user id" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="dateStart" label="Ngày bắt đầu">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="dateComplete" label="Ngày hoàn thành">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="price" label="Ngân sách (VND)">
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={100000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/,/g, "")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="accountIds" label="Nhân viên tham gia">
              <Select
                mode="multiple"
                placeholder="Chọn nhân viên"
                optionFilterProp="children"
                showSearch
              >
                {accounts.map((acc) => (
                  <Option key={acc.id} value={acc.id}>
                    {acc.fullName} - {acc.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="slogan" label="Slogan">
              <Input placeholder="Nhập slogan" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="fileUrl" label="File URL">
              <Input placeholder="Link file" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="target" label="Mục tiêu">
              <TextArea rows={3} placeholder="Nhập mục tiêu campaign" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả">
              <TextArea rows={4} placeholder="Nhập mô tả" />
            </Form.Item>
          </Col>

          <Col span={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
