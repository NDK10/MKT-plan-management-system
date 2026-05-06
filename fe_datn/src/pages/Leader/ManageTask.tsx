import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Col,
  Row,
  Tag,
  notification,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";
import CampaignService from "../../service/CampaignService";
import DetailPlanService from "../../service/DetailPlanService";
import FilterTask from "./component/FilterTask";
import { jwtDecode } from "jwt-decode";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

interface DetailPlanDto {
  id?: number;
  title?: string;
  campaignId?: number;
  socialPlan?: string;
  timelineUp?: string;
  price?: number;
  content?: string;
  linkDrive?: string;
  performerId?: number;
  status?: string;
}

export default function ManageTask() {
  const token = localStorage.getItem("accessToken");
  const decoded = jwtDecode(token);
  const role = decoded.role;
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState<DetailPlanDto | null>(null);
  const [isApproveMode, setIsApproveMode] = useState(false);
  const [openUpdateContent, setOpenUpdateContent] = useState(false);
  const [data, setData] = useState<DetailPlanDto[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [contentForm] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [listPerformer, setListPerformer] = useState<any[]>([]);

  const { idCampaign } = useParams();

  const [filter, setFilter] = useState({
    campaignId: Number(idCampaign),
    page: 0,
    size: 10,
  });

  const [dataTask, setDataTask] = useState<DetailPlanDto[]>([]);
  const [total, setTotal] = useState(0);

  const [campaignName, setCampaignName] = useState("");

  useEffect(() => {
    async function fetchCampaignDetails() {
      const res = await CampaignService.getDetailById(Number(idCampaign));
      const resTask = await DetailPlanService.search(filter);
      setListPerformer(res?.data?.accountResponseDtoList || []);
      setCampaignName(res.data.name);
      setDataTask(resTask.data.content);
      setTotal(resTask.data.total);
    }
    fetchCampaignDetails();
  }, [idCampaign, filter]);

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Nền tảng đăng",
      dataIndex: "socialPlan",
    },
    {
      title: "Thời gian đăng",
      dataIndex: "timelineUp",
      render: (value: string) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "",
    },
    {
      title: "Chi phí thực hiện",
      dataIndex: "price",
      render: (value: number) =>
        value
          ? value.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "0 ₫",
    },
    {
      title: "Người thực hiện",
      dataIndex: "performerId",
      render: (id: number) => {
        const user = listPerformer.find((p) => p.id === id);
        return user ? `${user.fullName}` : "Không xác định";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        switch (status) {
          case "ASSIGNED":
            return <Tag color="purple">Đang đợi content</Tag>;
          case "WAITING":
            return <Tag color="warning">Đang chờ duyệt</Tag>;
          case "INPROGRESS":
            return <Tag color="processing">Đang thực hiện</Tag>;
          case "COMPLETED":
            return <Tag color="success">Hoàn thành</Tag>;
          case "CANCELED":
            return <Tag color="red">Đã hủy</Tag>;
          default:
            return status || "Không rõ";
        }
      },
    },
    {
      title: "Thao tác",
      render: (_: any, record: DetailPlanDto) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Xem nội dung">
            <Button
              type="link"
              onClick={() => {
                setViewData(record);
                setOpenView(true);
              }}
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              hidden={role !== "LEADER"}
              type="link"
              onClick={() => handleOpenEdit(record)}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Cập nhật nội dung">
            <Button
              hidden={
                role !== "EMPLOYEE" ||
                (record.status !== "ASSIGNED" && record.status !== "WAITING")
              }
              type="link"
              onClick={() => {
                contentForm.setFieldsValue({
                  id: record.id,
                  content: record.content,
                  linkDrive: record.linkDrive,
                });
                setIsApproveMode(false);
                setOpenUpdateContent(true);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="Hoàn thành">
            <Button
              hidden={role !== "EMPLOYEE" || record.status !== "INPROGRESS"}
              type="link"
              style={{ color: "blue" }}
              onClick={() => handleCompleteTask(record.id)}
            >
              <ScheduleOutlined style={{ color: "green" }} />
            </Button>
          </Tooltip>

          {record.status !== "CANCELED" && (
            <Tooltip title="Hủy task">
              <Button
                hidden={role !== "LEADER"}
                danger
                type="link"
                onClick={() => handleCancelTask(record.id)}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Duyệt">
            <Button
              hidden={role !== "LEADER" || record.status !== "WAITING"}
              type="link"
              style={{ color: "green" }}
              onClick={() => {
                contentForm.setFieldsValue({
                  id: record.id,
                  content: record.content,
                  linkDrive: record.linkDrive,
                });
                setIsApproveMode(true);
                setOpenUpdateContent(true);
              }}
            >
              <CheckOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleCompleteTask = (id: number) => {
    Modal.confirm({
      title: "Xác nhận hoàn thành",
      content: "Bạn đã hoàn thành task này?",
      okText: "Hoàn thành",
      okType: "primary",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          await DetailPlanService.updateStatusComplete(id);

          notification.success({
            message: "Thành công",
            description: "Đã cập nhật trạng thái hoàn thành",
          });

          setFilter((prev) => ({
            ...prev,
            page: 0,
          }));
        } catch (err) {
          notification.error({
            message: "Lỗi",
            description: "Không thể cập nhật trạng thái",
          });
        }
      },
    });
  };

  const handleOpenCreate = () => {
    form.resetFields();
    setIsEdit(false);
    setIsCreate(true);
    setOpen(true);
  };

  const handleOpenEdit = (record: DetailPlanDto) => {
    form.setFieldsValue({
      ...record,
      id: record.id,
      timelineUp: record.timelineUp ? dayjs(record.timelineUp) : null,
    });

    setIsEdit(true);
    setIsCreate(false);
    setOpen(true);
  };

  const handleCancelTask = (id: number) => {
    Modal.confirm({
      title: "Xác nhận hủy",
      content: "Bạn có chắc muốn hủy task này?",
      okText: "Hủy task",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        await DetailPlanService.delete(id);

        notification.success({
          message: "Đã hủy task",
        });

        setFilter((prev) => ({
          ...prev,
          page: 0,
        }));
      },
    });
  };

  const handleOk = async () => {
    try {
      if (isEdit) {
        const values = await form.validateFields();

        const updatedTask: DetailPlanDto = {
          ...values,
          id: values.id,
          campaignId: Number(idCampaign),
          timelineUp: values.timelineUp?.format("YYYY-MM-DD HH:mm:ss"),
        };
        console.log("🔥 PAYLOAD UPDATE:", updatedTask);

        await DetailPlanService.update(updatedTask);
        setOpen(false);
        form.resetFields();
        setFilter((prev) => ({
          ...prev,
          page: 0,
        }));

        notification.success({
          message: "Thành công",
          description: "Đã cập nhật kế hoạch thành công",
          placement: "topRight",
          getContainer: () => document.body, // ép ra ngoài layout
        });
      } else if (isCreate) {
        const values = await form.validateFields();

        const newTask: DetailPlanDto = {
          ...values,
          id: null,
          timelineUp: values.timelineUp?.format("YYYY-MM-DD HH:mm:ss"),
        };

        await DetailPlanService.create({
          ...newTask,
          campaignId: Number(idCampaign),
        });

        setOpen(false);
        form.resetFields();

        setFilter((prev) => ({
          ...prev,
          page: 0,
        }));

        notification.success({
          message: "Thành công",
          description: "Đã tạo kế hoạch mới thành công",
          placement: "topRight",
          getContainer: () => document.body, // ép ra ngoài layout
        });
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Lỗi",
        description: err.response?.data || "Tạo kế hoạch thất bại",
        placement: "topRight",
        getContainer: () => document.body, // ép ra ngoài layout
      });
    }
  };

  const handleUpdateContent = async () => {
    try {
      const values = await contentForm.validateFields();

      console.log("Updating content with values:", values);
      await DetailPlanService.updateContent({
        id: values.id,
        content: values.content,
        linkDrive: values.linkDrive,
      });

      notification.success({
        message: "Thành công",
        description: "Đã cập nhật nội dung",
      });

      setOpenUpdateContent(false);
      setFilter((prev) => ({
        ...prev,
        page: 0,
      }));
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description: "Cập nhật thất bại",
      });
    }
  };

  const handleApprove = async () => {
    try {
      const values = contentForm.getFieldsValue();

      await DetailPlanService.approveContent({
        id: values.id,
        status: "COMPLETED",
      });

      notification.success({
        message: "Đã duyệt",
        description: "Task đã được duyệt thành công",
      });

      setOpenUpdateContent(false);
      setFilter((prev) => ({
        ...prev,
        page: 0,
      }));
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description: "Duyệt thất bại",
      });
    }
  };

  return (
    <>
      <FilterTask
        filterForm={filterForm}
        listPerformer={listPerformer}
        setFilter={setFilter}
        campaignName={campaignName}
        idCampaign={idCampaign}
      />
      <div style={{ padding: 24 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Button
            disabled={role !== "LEADER"}
            color="green"
            variant="solid"
            onClick={handleOpenCreate}
          >
            Thêm kế hoạch
          </Button>
        </div>

        {/* Table */}
        <Table<DataType>
          columns={columns}
          dataSource={dataTask}
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

        {/* Modal */}
        <Modal
          title={isEdit ? "Chỉnh sửa kế hoạch" : "Thêm kế hoạch mới"}
          open={open}
          onOk={handleOk}
          onCancel={() => setOpen(false)}
        >
          <Form layout="vertical" form={form}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="socialPlan"
                  label="Nền tảng đăng"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="timelineUp"
                  label="Thời gian đăng"
                  rules={[{ required: true }]}
                >
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="price" label="Chi phí thực hiện (VND)">
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

              {/* <Form.Item name="content" label="Nội dung">
            <Input.TextArea />
          </Form.Item> */}

              {/* <Col span={24}>
              <Form.Item name="linkDrive" label="Link Google Drive">
                <Input />
              </Form.Item>
            </Col> */}

              <Col span={12}>
                <Form.Item
                  name="performerId"
                  label="Người thực hiện"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn người thực hiện",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn nhân viên"
                    options={listPerformer.map((item) => ({
                      value: item.id,
                      label: `${item.fullName} (${item.email})`,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title={isApproveMode ? "Duyệt nội dung" : "Cập nhật nội dung"}
          open={openUpdateContent}
          onCancel={() => {
            setOpenUpdateContent(false);
            contentForm.resetFields();
          }}
          footer={[
            <Button onClick={() => setOpenUpdateContent(false)}>Đóng</Button>,

            !isApproveMode && (
              <Button type="primary" onClick={handleUpdateContent}>
                Cập nhật
              </Button>
            ),

            isApproveMode && (
              <Button
                type="primary"
                style={{ background: "green" }}
                onClick={handleApprove}
              >
                Duyệt
              </Button>
            ),
          ]}
        >
          <Form layout="vertical" form={contentForm}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} disabled={isApproveMode} />
            </Form.Item>

            {isApproveMode ? (
              <Form.Item label="Link Google Drive">
                <a
                  href={contentForm.getFieldValue("linkDrive")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contentForm.getFieldValue("linkDrive")}
                </a>
              </Form.Item>
            ) : (
              <Form.Item
                name="linkDrive"
                label="Link Google Drive"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập link Google Drive",
                  },
                  {
                    pattern:
                      /^https:\/\/(drive\.google\.com)\/(file\/d\/|drive\/folders\/|open\?id=)/,
                    message: "Link phải là Google Drive hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Dán link Google Drive..." />
              </Form.Item>
            )}
          </Form>
        </Modal>
        <Modal
          title="Xem nội dung"
          open={openView}
          onCancel={() => {
            setOpenView(false);
            setViewData(null);
          }}
          footer={[<Button onClick={() => setOpenView(false)}>Đóng</Button>]}
        >
          <p>
            <b>Nội dung:</b>
          </p>
          <div
            style={{
              padding: 12,
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              minHeight: 80,
              whiteSpace: "pre-wrap",
            }}
          >
            {viewData?.content || "Không có nội dung"}
          </div>

          <p style={{ marginTop: 16 }}>
            <b>Link Google Drive:</b>
          </p>

          {viewData?.linkDrive ? (
            <Button
              type="primary"
              onClick={() => window.open(viewData.linkDrive, "_blank")}
            >
              Mở Google Drive
            </Button>
          ) : (
            <p>Không có link</p>
          )}
        </Modal>
      </div>
    </>
  );
}
