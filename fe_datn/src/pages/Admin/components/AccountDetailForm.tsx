import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import React, { use, useEffect } from "react";
import AccountService from "../../../service/AccountService";

export default function AccountDetailForm({
  isOpenFormAccount,
  setIsOpenFormAccount,
  roleForm,
  detailForm,
  filter,
  setFilter,
}) {
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  const [listRole, setListRole] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await AccountService.getAccountRole();
      console.log(res);
      setListRole(res?.data || []);
    };
    fetchData();
  }, []);
  const handleOk = async () => {
    try {
      const values = await detailForm.validateFields();
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null,
      };

      if (roleForm === "update") {
        const res = await AccountService.updateAccount(
          payload,
          detailForm.getFieldValue("id"),
        );
        if (res.status === 200) {
          notification.success({
            message: "Thành công",
            description: "Đã cập nhật tài khoản thành công",
            placement: "topRight",
            getContainer: () => document.body, // ép ra ngoài layout
          });
        }
      } else {
        const res = await AccountService.createAccount(payload);
        if (res.status === 200) {
          notification.success({
            message: "Thành công",
            description: "Đã tạo tài khoản thành công",
            placement: "topRight",
            getContainer: () => document.body, // ép ra ngoài layout
          });
        }
      }

      setIsOpenFormAccount(false);
      detailForm.resetFields();
      setFilter({ ...filter }); // reload table
    } catch (err) {
      console.log("Validate failed:", err);
    }
  };
  const handleCancel = () => {
    setIsOpenFormAccount(false);
  };

  let title = "";
  if (roleForm === "create") title = "Tạo mới tài khoản";
  else if (roleForm === "update") title = "Cập nhật tài khoản";

  return (
    <>
      {" "}
      <Modal
        title={title}
        zIndex={200000}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpenFormAccount}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={detailForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="fullName"
                label="Họ tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="SĐT"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "SĐT phải gồm 10 chữ số",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="address" label="Địa chỉ">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker style={{ width: "100%" }} format={dateFormatList} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleId"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  // onChange={handleProvinceChange}
                  options={listRole.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Mật khẩu không khớp");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
