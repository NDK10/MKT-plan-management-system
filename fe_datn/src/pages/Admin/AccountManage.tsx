import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  Button,
  Flex,
  Form,
  message,
  Modal,
  notification,
  Table,
  Tag,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
import AccountService from "../../service/AccountService";
import AccountDetailForm from "./components/AccountDetailForm";
import AccountFilterForm from "./components/AccountFilterForm";
import dayjs from "dayjs";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: string;
  dateOfBirth: string;
  createdAt: string;
  roleName: string;
}

export default function AccountManage() {
  const columns: TableColumnsType<DataType> = [
    { title: "Họ và tên", dataIndex: "fullName" },
    { title: "Email", dataIndex: "email" },
    { title: "Số điện thoại", dataIndex: "phoneNumber" },
    { title: "Địa chỉ", dataIndex: "address" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) =>
        value === 1 ? (
          <Tag color="green">Hiệu lực</Tag>
        ) : (
          <Tag color="red">Hết hiệu lực</Tag>
        ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : ""),
    },
    { title: "Vai trò", dataIndex: "roleName" },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>

          <Button type="link" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ page: 0, size: 10 });
  const [isOpenFormAccount, setIsOpenFormAccount] = useState(false);
  const [roleForm, setRoleForm] = useState("");

  const [dataTable, setDataTable] = useState<DataType[]>([]);

  const [detailForm] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const res = await AccountService.searchAccounts(filter);
      setDataTable(
        (res?.data?.content || []).map((item) => ({
          ...item,
          key: item.id,
        })),
      );
      setTotal(res?.data?.totalElements || 0);
    };

    fetchData();
  }, [filter]);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (record) => {
    setIsOpenFormAccount(true);
    setRoleForm("update");
    detailForm.setFieldsValue({
      ...record,
      dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      content: `Bạn có chắc muốn xóa tài khoản ${record.fullName}?`,
      okText: "Xóa",
      zIndex: 200000,
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await AccountService.deleteAccount(record.key);

          notification.success({
            message: "Thành công",
            description: "Đã xóa tài khoản thành công",
            placement: "topRight",
            getContainer: () => document.body, // ép ra ngoài layout
          });

          setFilter((prev) => ({ ...prev }));
        } catch (err) {
          notification.error({
            message: "Lỗi",
            description: "Xóa thất bại",
            placement: "topRight",
            getContainer: () => document.body, // ép ra ngoài layout
          });
        }
      },
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <AccountFilterForm setFilter={setFilter} filter={filter} />
      <AccountDetailForm
        isOpenFormAccount={isOpenFormAccount}
        setIsOpenFormAccount={setIsOpenFormAccount}
        roleForm={roleForm}
        detailForm={detailForm}
        filter={filter}
        setFilter={setFilter}
      />
      <Flex gap="medium" vertical>
        <Flex align="center" gap="medium">
          <Button
            color="green"
            variant="solid"
            onClick={() => {
              setIsOpenFormAccount(true);
              setRoleForm("create");
            }}
            loading={loading}
          >
            Thêm mới
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>
        <Table<DataType>
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: filter.page + 1,
            pageSize: filter.size,
            total: total,
            showSizeChanger: false,
          }}
          onChange={(pagination) => {
            setFilter((prev) => ({
              ...prev,
              page: pagination.current - 1,
              size: pagination.pageSize,
            }));
          }}
        />
      </Flex>
    </>
  );
}
