import React from "react";
import axiosApi from "../axiosConfig/AxiosApi";
import { API_URL } from "../axiosConfig/Api";

const CampaignService = {
  create: async (data: any) => {
    return axiosApi.post(`${API_URL}/api/campaigns`, data);
  },
  searchCampaign: async (params: any) => {
    return axiosApi.post(`${API_URL}/api/campaigns/search`, params);
  },
  approve: async (id: number) => {
    return axiosApi.post(`${API_URL}/api/campaigns/accept/${id}`);
  },
  reject: async (id: number) => {
    return axiosApi.post(`${API_URL}/api/campaigns/reject/${id}`);
  },
  getAllUserResponsible: async () => {
    return axiosApi.get(`${API_URL}/api/accounts/user-responsible`);
  },
  getDetailById: async (id: number) => {
    return axiosApi.get(`${API_URL}/api/campaigns/${id}`);
  },
  getDashboardStatus: async () => {
    return axiosApi.get(`${API_URL}/api/campaigns/dashboard/status`);
  },
  getDashboardCost: async () => {
    return axiosApi.get(`${API_URL}/api/campaigns/dashboard/cost`);
  },
  completeCampaign: async (id: number) => {
    return axiosApi.post(`${API_URL}/api/campaigns/complete-campaign/${id}`);
  },
};
export default CampaignService;
