import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import AccountService from "../../service/AccountService";
import { notification } from "antd";
import { Form, Input as AntInput } from "antd";

export default function UserInfoCard() {
  const token = localStorage.getItem("accessToken");
  const decode = jwtDecode(token || "") as any;
  const [dataAccount, setDataAccount] = React.useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const res = await AccountService.getAccountById(decode.accountId);

      setDataAccount(res.data);
    }
    fetchData();
  }, []);

  const [formPassword] = Form.useForm();

  const {
    isOpen: isOpenPassword,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
  } = useModal();
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = React.useState<any>(null);
  const handleSave = async () => {
    try {
      const res = await AccountService.updateProfile(
        formData,
        decode.accountId,
      );
      // chỉ khi thành công mới cập nhật UI
      setDataAccount(res.data);
      notification.success({
        message: "Cập nhật thông tin thành công",
      });
      closeModal();
    } catch (error) {
      notification.error({
        message: "Cập nhật thông tin thất bại",
      });
    }
  };

  const openPasswordModalHandler = () => {
    formPassword.resetFields();
    openPasswordModal();
  };

  const openEditModal = () => {
    setFormData({ ...dataAccount }); // clone
    openModal();
  };

  function formatDateInput(date) {
    if (!date) return "";
    return date.split("T")[0];
  }

  function formatDateDisplay(date) {
    if (!date) return "";
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const handleChangePassword = async (values) => {
    try {
      await AccountService.changePassword({
        accountId: decode.accountId,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      notification.success({
        message: "Đổi mật khẩu thành công",
      });

      formPassword.resetFields();
      closePasswordModal();
    } catch (error) {
      const message = error?.response?.data;

      formPassword.setFields([
        {
          name: "oldPassword",
          errors: ["Mật khẩu cũ không đúng"],
        },
      ]);

      notification.error({
        message: "Đổi mật khẩu thất bại",
      });
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Thông tin người dùng
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Họ và tên
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {dataAccount?.fullName}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Địa chỉ
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {dataAccount?.address}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {dataAccount?.email}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Số điện thoại
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {dataAccount?.phoneNumber}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ngày sinh
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDateDisplay(dataAccount?.dateOfBirth)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openEditModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] m-4"
        >
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Sửa thông tin cá nhân
              </h4>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="flex flex-col"
            >
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Thông tin cá nhân
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Địa chỉ email</Label>
                      <Input disabled type="text" value={dataAccount?.email} />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Họ và tên</Label>
                      <Input
                        type="text"
                        value={formData?.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Địa chỉ</Label>
                      <Input
                        type="text"
                        value={formData?.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Số điện thoại</Label>
                      <Input
                        type="text"
                        value={formData?.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Ngày sinh</Label>
                      <Input
                        type="date"
                        value={formatDateInput(formData?.dateOfBirth)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={closeModal}
                >
                  Đóng
                </Button>
                <Button size="sm" type="submit">
                  Lưu
                </Button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isOpen={isOpenPassword}
          onClose={closePasswordModal}
          className="max-w-[500px] m-4"
        >
          <div className="p-6 bg-white rounded-2xl dark:bg-gray-900">
            <h4 className="mb-4 text-xl font-semibold">Đổi mật khẩu</h4>

            <Form
              form={formPassword}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              {/* Mật khẩu cũ */}
              <Form.Item
                label="Mật khẩu cũ"
                name="oldPassword"
                rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}
              >
                <AntInput.Password
                  onChange={() => {
                    formPassword.setFields([
                      {
                        name: "oldPassword",
                        errors: [],
                      },
                    ]);
                  }}
                />
              </Form.Item>

              {/* Mật khẩu mới */}
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Nhập mật khẩu mới" },
                  { min: 6, message: "Ít nhất 6 ký tự" },
                ]}
              >
                <AntInput.Password />
              </Form.Item>

              {/* Xác nhận */}
              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  { required: true, message: "Xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Mật khẩu không khớp");
                    },
                  }),
                ]}
              >
                <AntInput.Password />
              </Form.Item>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closePasswordModal}
                >
                  Hủy
                </Button>
                <Button type="submit">Xác nhận</Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
      <button
        onClick={openPasswordModalHandler}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-theme-xs hover:bg-red-50 lg:inline-flex lg:w-auto"
      >
        Đổi mật khẩu
      </button>
    </>
  );
}
