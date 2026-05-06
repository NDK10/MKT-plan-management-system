import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  Tag,
  notification,
  Modal,
  Descriptions,
  Tooltip,
} from "antd";
import type { TableColumnsType } from "antd";
import CampaignService from "../../service/CampaignService";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import CampaignFilterForm from "./component/FilterCampaign";
import { EyeOutlined, ScheduleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import CampaignFilterFormEmployee from "./components/FilterCampagin";

interface DataType {
  key: React.Key;
  code: string;
  name: string;
  status: string;
  dateStart: string;
  dateComplete: string;
  price: number;
  incurredCosts: number;
  percentTarget: number;
  userResponsibleName: string;
  userResponsibleEmail: string;
  createdAt: string;

  description?: string;
  target?: string;
  slogan?: string;
  fileUrl?: string;
  accountResponseDtoList?: any[];
}

export default function ManageCampaignEmployee() {
  const navigate = useNavigate();
  const [dataTable, setDataTable] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("accessToken");
  const decoded = jwtDecode(token);
  const accountId = decoded.accountId;
  const [filter, setFilter] = useState({
    page: 0,
    size: 10,
    accountId: accountId,
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  const columns: TableColumnsType<DataType> = [
    { title: "Code", dataIndex: "code" },
    { title: "Tên Campaign", dataIndex: "name" },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value) => {
        if (value === "WAITING") {
          return <Tag color="orange">Chờ duyệt</Tag>;
        } else if (value === "CANCELED") {
          return <Tag color="red">Đã hủy</Tag>;
        } else if (value === "INPROGRESS") {
          return <Tag color="green">Đang triển khai</Tag>;
        } else if (value === "COMPLETED") {
          return <Tag color="blue">Đã hoàn thành</Tag>;
        }
      },
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "dateStart",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "dateComplete",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
    },

    {
      title: "Ngân sách",
      dataIndex: "price",
      render: (value) => (value ? value.toLocaleString("vi-VN") + " VND" : ""),
    },

    // {
    //   hidden: type !== "COMPLETED",
    //   title: "Chi phí đã dùng",
    //   dataIndex: "incurredCosts",
    //   render: (value) => (value ? value.toLocaleString("vi-VN") + " VND" : ""),
    // },

    // {
    //   hidden: type !== "COMPLETED",
    //   title: "% đạt được",
    //   dataIndex: "percentTarget",
    //   render: (value) => (value ? value + " %" : ""),
    // },

    {
      title: "Người phụ trách",
      dataIndex: "userResponsibleName",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY HH:mm") : ""),
    },

    {
      title: "Hành động",
      render: (_, record) => {
        return (
          <Flex gap={8}>
            <Tooltip title="Xem chi tiết">
              <Button type="link" onClick={() => handleAccept(record)}>
                <EyeOutlined />
              </Button>
            </Tooltip>

            <Tooltip title="Chi tiết kế hoạch">
              <Button
                type="link"
                onClick={() => {
                  navigate(`/employee/manage-tasks/${record.id}`);
                }}
                disabled={record.status !== "INPROGRESS"}
              >
                <ScheduleOutlined style={{ color: "green" }} />
              </Button>
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CampaignService.searchCampaign(filter);

        setDataTable(
          (res?.data?.content || []).map((item: any) => ({
            ...item,
            key: item.id,
          })),
        );

        setTotal(res?.data?.totalElements || 0);
      } catch (err) {
        notification.error({
          message: "Lỗi",
          description: "Không load được danh sách campaign",
        });
      }
    };

    fetchData();
  }, [filter]);

  const handleAccept = (record: DataType) => {
    setSelectedRecord(record);
    setIsOpenModal(true);
  };

  const Field = ({
    label,
    value,
    full,
  }: {
    label: string;
    value?: any;
    full?: boolean;
  }) => (
    <Flex
      justify="space-between"
      style={{
        width: "100%",
        flexDirection: full ? "column" : "row",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}:</span>
      <span style={{ maxWidth: "70%", textAlign: "right" }}>
        {value || "-"}
      </span>
    </Flex>
  );

  return (
    <>
      <CampaignFilterFormEmployee
        accountId={accountId}
        filter={filter}
        setFilter={setFilter}
      />
      <Flex vertical gap="middle">
        <Table<DataType>
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
        <Modal
          title="Chi tiết Campaign"
          open={isOpenModal}
          width={800}
          onCancel={() => setIsOpenModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsOpenModal(false)}>
              Đóng
            </Button>,
          ]}
        >
          {selectedRecord && (
            <>
              {/* ================= THÔNG TIN CHUNG ================= */}
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Code">
                  {selectedRecord.code}
                </Descriptions.Item>

                <Descriptions.Item label="Tên">
                  {selectedRecord.name}
                </Descriptions.Item>

                <Descriptions.Item label="Trạng thái">
                  <Tag color="orange">
                    {selectedRecord.status === "WAITING"
                      ? "Chờ duyệt"
                      : selectedRecord.status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Người phụ trách">
                  {selectedRecord.userResponsibleName} -{" "}
                  {selectedRecord.userResponsibleEmail}
                </Descriptions.Item>

                <Descriptions.Item label="Ngày bắt đầu">
                  {selectedRecord.dateStart
                    ? dayjs(selectedRecord.dateStart).format("DD/MM/YYYY")
                    : "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Ngày kết thúc">
                  {selectedRecord.dateComplete
                    ? dayjs(selectedRecord.dateComplete).format("DD/MM/YYYY")
                    : "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Ngân sách dự kiến ">
                  {selectedRecord.price?.toLocaleString("vi-VN")} VND
                </Descriptions.Item>

                <Descriptions.Item label="Ngày tạo">
                  {selectedRecord.createdAt
                    ? dayjs(selectedRecord.createdAt).format("DD/MM/YYYY HH:mm")
                    : "-"}
                </Descriptions.Item>
              </Descriptions>

              {/* ================= MÔ TẢ ================= */}
              <Descriptions
                bordered
                column={1}
                size="small"
                style={{ marginTop: 16 }}
              >
                <Descriptions.Item label="Mô tả">
                  {selectedRecord.description || "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Mục tiêu">
                  {selectedRecord.target || "-"}
                </Descriptions.Item>

                <Descriptions.Item label="Slogan">
                  {selectedRecord.slogan || "-"}
                </Descriptions.Item>

                <Descriptions.Item label="File">
                  {selectedRecord.fileUrl ? (
                    <a href={selectedRecord.fileUrl} target="_blank">
                      Xem file
                    </a>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
              </Descriptions>

              {/* ================= NHÂN VIÊN ================= */}
              <div style={{ marginTop: 16 }}>
                <b>Danh sách nhân viên đăng ký:</b>

                <div style={{ marginTop: 8 }}>
                  {selectedRecord.accountResponseDtoList?.length ? (
                    selectedRecord.accountResponseDtoList.map((acc) => (
                      <Tooltip key={acc.id} title={acc.email}>
                        <Tag color="blue">{acc.fullName}</Tag>
                      </Tooltip>
                    ))
                  ) : (
                    <span>Không có</span>
                  )}
                </div>
              </div>
            </>
          )}
        </Modal>
      </Flex>
    </>
  );
}
