import { Pie } from "@ant-design/plots";
import { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import CampaignService from "../../../service/CampaignService";

const { Title } = Typography;

export default function CampaignStatusPie() {
  const [data, setData] = useState([]);

  // map status -> tiếng Việt
  const statusMap = {
    WAITING: "Đang chờ duyệt",
    INPROGRESS: "Đang thực hiện",
    COMPLETED: "Đã hoàn thành",
    CANCELED: "Đã hủy",
  };

  useEffect(() => {
    async function fetchData() {
      const response = await CampaignService.getDashboardStatus();

      // map sang tiếng Việt luôn
      const mappedData = response.data.map((item) => ({
        ...item,
        statusLabel: statusMap[item.status] || item.status,
      }));

      setData(mappedData);
    }
    fetchData();
  }, []);

  const config = {
    data,
    angleField: "count",
    colorField: "statusLabel",
    radius: 0.75,

    label: {
      text: (d) => `${d.statusLabel}: ${d.count}`,
      style: {
        fontSize: 12,
      },
    },

    legend: {
      position: "bottom",
    },

    color: ({ status }) => {
      switch (status) {
        case "COMPLETED":
          return "#52c41a"; // xanh lá (success)
        case "INPROGRESS":
          return "#1890ff"; // xanh dương
        case "WAITING":
          return "#fa8c16"; // cam (orange)
        case "CANCELED":
          return "#8c8c8c"; // xám
        default:
          return "#d9d9d9";
      }
    },

    interactions: [{ type: "element-active" }],
  };

  return (
    <Card
      style={{ width: "100%", borderRadius: 12 }}
      bodyStyle={{ padding: 20 }}
    >
      <Title level={4} style={{ textAlign: "center", marginBottom: 20 }}>
        Thống kê trạng thái chiến dịch
      </Title>

      <Pie {...config} />
    </Card>
  );
}
