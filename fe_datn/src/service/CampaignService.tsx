import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";

const CampaignService = {
  create: async (data: any) => {
    return axiosApi.post("http://localhost:8063/api/campaigns", data);
  },
  searchCampaign: async (params: any) => {
    return axiosApi.post("http://localhost:8063/api/campaigns/search", params);
  },
  approve: async (id: number) => {
    return axiosApi.post(`http://localhost:8063/api/campaigns/accept/${id}`);
  },
  reject: async (id: number) => {
    return axiosApi.post(`http://localhost:8063/api/campaigns/reject/${id}`);
  },
  getAllUserResponsible: async () => {
    return axiosApi.get("http://localhost:8063/api/accounts/user-responsible");
  },
  getDetailById: async (id: number) => {
    return axiosApi.get(`http://localhost:8063/api/campaigns/${id}`);
  },
  getDashboardStatus: async () => {
    return axiosApi.get("http://localhost:8063/api/campaigns/dashboard/status");
  },
  getDashboardCost: async () => {
    return axiosApi.get("http://localhost:8063/api/campaigns/dashboard/cost");
  },
  completeCampaign: async (id: number) => {
    return axiosApi.post(
      `http://localhost:8063/api/campaigns/complete-campaign/${id}`,
    );
  },
};
export default CampaignService;
