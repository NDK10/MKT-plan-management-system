import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { Card, Typography } from "antd";
import CampaignService from "../../../service/CampaignService";

const { Title } = Typography;

export default function CampaignCostBar() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await CampaignService.getDashboardCost();

      // transform sang dạng 1 object / campaign
      const transformed = res.data.map((item) => ({
        name: item.name,
        duKien: Number(item.estimatedCost || 0),
        thucTe: Number(item.actualCost || 0),
      }));

      setData(transformed);
    }

    fetchData();
  }, []);

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={4} style={{ textAlign: "center" }}>
        Chi phí dự án đã hoàn thành
      </Title>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => value.toLocaleString("vi-VN")} />

          <Tooltip
            formatter={(value) => `${Number(value).toLocaleString("vi-VN")} ₫`}
          />

          <Legend />

          <Bar dataKey="duKien" name="Dự kiến" fill="#1890ff" />
          <Bar
            dataKey="thucTe"
            name="Thực tế"
            shape={(props) => {
              const { x, y, width, height, payload } = props;

              const isOver = payload.thucTe > payload.duKien;

              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={isOver ? "#ff4d4f" : "#52c41a"}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
